import path from "node:path";

export const mediaStoragePath = path.join(process.cwd(), "public", "uploads");

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

export function mediaPublicUrl(segments: string[]) {
    return `/uploads/${segments.map(encodeURIComponent).join("/")}`;
}

/**
 * Obtiene la ruta interna del objeto
 * a partir de la URL pública de Supabase.
 *
 * Se utiliza principalmente para eliminar
 * archivos posteriormente.
 */
export function localMediaPathFromUrl(url: string) {
    if (!url.startsWith("/uploads/")) {
        return null;
    }

    const relativePath = url.slice("/uploads/".length);
    const targetPath = path.resolve(mediaStoragePath, relativePath);
    const storagePrefix = `${mediaStoragePath}${path.sep}`;

    return targetPath.startsWith(storagePrefix) ? targetPath : null;
}
