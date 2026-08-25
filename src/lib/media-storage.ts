export const MEDIA_BUCKET =
    process.env.SUPABASE_MEDIA_BUCKET ??
    "aura-media";

export function safeStorageSegment(
    value: string
) {
    return (
        value
            .replace(
                /[^a-zA-Z0-9_-]/g,
                "_"
            )
            .slice(0, 100) ||
        "general"
    );
}

export function mediaStorageKey(
    segments: string[]
) {
    return segments
        .map(safeStorageSegment)
        .join("/");
}

/**
 * Obtiene la ruta interna del objeto
 * a partir de la URL pública de Supabase.
 *
 * Se utiliza principalmente para eliminar
 * archivos posteriormente.
 */
export function storageKeyFromPublicUrl(
    url: string
) {
    const marker =
        `/storage/v1/object/public/${MEDIA_BUCKET}/`;

    const index = url.indexOf(marker);

    if (index === -1) {
        return null;
    }

    const key = url.slice(
        index + marker.length
    );

    try {
        return decodeURIComponent(key);
    } catch {
        return key;
    }
}

// NOTA IMPORTANTE: NO BORRAR

// import path from "node:path";

// export const mediaStoragePath = path.join(process.cwd(), "public", "uploads");

// export function safeStorageSegment(value: string) {
//     return value.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 100) || "general";
// }

// export function mediaPublicUrl(segments: string[]) {
//     return `/uploads/${segments.map(encodeURIComponent).join("/")}`;
// }

// export function localMediaPathFromUrl(url: string) {
//     if (!url.startsWith("/uploads/")) {
//         return null;
//     }

//     const relativePath = url.slice("/uploads/".length);
//     const targetPath = path.resolve(mediaStoragePath, relativePath);
//     const storagePrefix = `${mediaStoragePath}${path.sep}`;

//     return targetPath.startsWith(storagePrefix) ? targetPath : null;
// }
