import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { supabase } from "@/src/lib/supabase";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const mediaId = params.id;

        // 1. Encontrar el registro en la BD para obtener el `fileName`
        const media = await prisma.media.findUnique({
            where: { id: mediaId },
        });

        if (!media) {
            return NextResponse.json({ success: false, error: "Media no encontrada" }, { status: 404 });
        }

        // 2. Eliminar el archivo de Supabase Storage
        const { error: storageError } = await supabase.storage.from("media").remove([media.fileName]);
        if (storageError) {
            console.error("Error al eliminar de Supabase:", storageError);
            // Decidimos continuar incluso si falla para eliminar el registro de la BD
        }

        // 3. Eliminar el registro de la base de datos
        await prisma.media.delete({ where: { id: mediaId } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error al eliminar media:", error);
        return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
    }
}