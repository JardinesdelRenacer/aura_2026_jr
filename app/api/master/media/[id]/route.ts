import {
    NextResponse,
} from "next/server";

import {
    prisma,
} from "@/src/lib/prisma";

import {
    MEDIA_BUCKET,
    storageKeyFromPublicUrl,
} from "@/src/lib/media-storage";

import {
    supabaseAdmin,
} from "@/src/lib/supabase-admin";

export async function DELETE(
    request: Request,
    {
        params,
    }: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    try {
        const {
            id,
        } = await params;

        const media =
            await prisma.media.findUnique({
                where: {
                    id,
                },
            });

        if (!media) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Multimedia no encontrada.",
                },
                {
                    status: 404,
                }
            );
        }

        // =========================
        // ELIMINAR STORAGE
        // =========================

        const storageKey =
            storageKeyFromPublicUrl(
                media.url
            );

        if (storageKey) {
            const {
                error: storageError,
            } =
                await supabaseAdmin
                    .storage
                    .from(
                        MEDIA_BUCKET
                    )
                    .remove([
                        storageKey,
                    ]);

            if (storageError) {
                console.error(
                    "No se pudo eliminar archivo de Supabase:",
                    storageError
                );

                return NextResponse.json(
                    {
                        success:
                            false,

                        error:
                            "No se pudo eliminar el archivo del almacenamiento.",
                    },
                    {
                        status:
                            500,
                    }
                );
            }
        }

        // =========================
        // ELIMINAR PRISMA
        // =========================

        await prisma.media.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "Error eliminando multimedia:",
            error
        );

        return NextResponse.json(
            {
                success: false,

                error:
                    "No fue posible eliminar la multimedia.",
            },
            {
                status: 500,
            }
        );
    }
}


// import { unlink } from "node:fs/promises";
// import { prisma } from "@/src/lib/prisma";
// import { NextResponse } from "next/server";
// import { localMediaPathFromUrl } from "@/src/lib/media-storage";

// export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> } ) {
//     try {
//         const { id } = await params;

//         const media = await prisma.media.findUnique({ where: { id } });

//         if (!media) {
//             return NextResponse.json(
//                 { success: false, error: "Multimedia no encontrada." },
//                 { status: 404 }
//             );
//         }

//         const localPath = localMediaPathFromUrl(media.url);
//         if (localPath) {
//             await unlink(localPath).catch((error: NodeJS.ErrnoException) => {
//                 if (error.code !== "ENOENT") {
//                     throw error;
//                 }
//             });
//         }

//         await prisma.media.delete({
//             where: { id }
//         });

//         return NextResponse.json({ success: true });
//     } catch (error) {
//         console.error(error);

//         return NextResponse.json({ success: false, error: "No se pudo eliminar la multimedia" }, { status: 500 })
//     };
// }
