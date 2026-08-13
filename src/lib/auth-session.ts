const SESSION_COOKIE = "aura_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export type AuraSession = {
    userId: string;
    email: string;
    role: "SUPER_MASTER" | "MASTER" | "ADMIN";
    sedeId: string | null;
    expiresAt: number;
};

function toBase64Url(value: Uint8Array) {
    let binary = "";

    for (const byte of value) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary)
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replaceAll("=", "");
}

function fromBase64Url(value: string) {
    const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const binary = atob(padded);

    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function sign(value: string) {
    const secret = process.env.AUTH_SECRET;

    if (!secret) {
        throw new Error("AUTH_SECRET no está configurada.");
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

    return toBase64Url(new Uint8Array(signature));
}

export async function createSession(
    user: Omit<AuraSession, "expiresAt">
) {
    const payload: AuraSession = {
        ...user,
        expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
    };
    const encodedPayload = toBase64Url(
        new TextEncoder().encode(JSON.stringify(payload))
    );

    return `${encodedPayload}.${await sign(encodedPayload)}`;
}

export async function readSession(value?: string): Promise<AuraSession | null> {
    if (!value) {
        return null;
    }

    const [encodedPayload, signature, ...extraParts] = value.split(".");

    if (!encodedPayload || !signature || extraParts.length > 0) {
        return null;
    }

    const expectedSignature = await sign(encodedPayload);

    if (signature !== expectedSignature) {
        return null;
    }

    try {
        const payload = JSON.parse(
            new TextDecoder().decode(fromBase64Url(encodedPayload))
        ) as AuraSession;

        if (
            !payload.userId ||
            !payload.email ||
            !payload.role ||
            typeof payload.expiresAt !== "number" ||
            payload.expiresAt <= Date.now()
        ) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

export { SESSION_COOKIE, SESSION_DURATION_SECONDS };
