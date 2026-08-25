import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import {
    mediaPublicUrl,
    mediaStoragePath,
    safeStorageSegment,
} from "@/src/lib/media-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
]);

export async function POST(request: Request) {
    let savedPath: string | null = null;

    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const sedeId = formData.get("sedeId");
        const roomValue = formData.get("room");

        if (!file || typeof file === "string" || !sedeId || typeof sedeId !== "string") {
            return NextResponse.json(
                { success: false, error: "Archivo y sede requeridos." },
                { status: 400 }
            );
        }

        if (!allowedMimeTypes.has(file.type)) {
            return NextResponse.json(
                { success: false, error: "Formato no permitido." },
                { status: 415 }
            );
        }

        if (file.size === 0 || file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { success: false, error: "El archivo debe pesar entre 1 byte y 100 MB." },
                { status: 413 }
            );
        }

        const sede = await prisma.sede.findUnique({
            where: { id: sedeId },
            select: { id: true },
        });

        if (!sede) {
            return NextResponse.json(
                { success: false, error: "La sede no existe." },
                { status: 404 }
            );
        }

        const safeSedeId = safeStorageSegment(sedeId);
        const room = typeof roomValue === "string" && roomValue.trim()
            ? safeStorageSegment(roomValue)
            : "general";
        const originalExtension = path.extname(file.name).toLowerCase();
        const safeExtension = /^\.[a-z0-9]{1,10}$/.test(originalExtension)
            ? originalExtension
            : "";
        const storedFileName = `${randomUUID()}${safeExtension}`;
        const targetDirectory = path.join(mediaStoragePath, safeSedeId, room);

        await mkdir(targetDirectory, { recursive: true });
        savedPath = path.join(targetDirectory, storedFileName);
        await writeFile(savedPath, Buffer.from(await file.arrayBuffer()));

        const ultimo = await prisma.media.count({ where: { sedeId } });
        const media = await prisma.media.create({
            data: {
                sedeId,
                url: mediaPublicUrl([safeSedeId, room, storedFileName]),
                type: file.type.startsWith("video/") ? "video" : "image",
                orden: ultimo + 1,
                fileName: file.name,
                room: typeof roomValue === "string" && roomValue.trim() ? roomValue : null,
            },
        });

        return NextResponse.json({ success: true, data: media }, { status: 201 });
    } catch (error) {
        if (savedPath) {
            await unlink(savedPath).catch(() => undefined);
        }

        console.error("No se pudo guardar la multimedia local.", error);
        return NextResponse.json(
            { success: false, error: "No se pudo guardar la multimedia." },
            { status: 500 }
        );
    }
}
