import { unlink } from "node:fs/promises";
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { localMediaPathFromUrl } from "@/src/lib/media-storage";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const media = await prisma.media.findUnique({ where: { id } });

        if (!media) {
            return NextResponse.json(
                { success: false, error: "Multimedia no encontrada." },
                { status: 404 }
            );
        }

        const localPath = localMediaPathFromUrl(media.url);
        if (localPath) {
            await unlink(localPath).catch((error: NodeJS.ErrnoException) => {
                if (error.code !== "ENOENT") {
                    throw error;
                }
            });
        }

        await prisma.media.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("No se pudo eliminar la multimedia.", error);
        return NextResponse.json(
            { success: false, error: "No se pudo eliminar la multimedia." },
            { status: 500 }
        );
    }
}
