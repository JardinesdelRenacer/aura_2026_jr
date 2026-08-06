import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/src/lib/prisma";

import KioskCondolenciasClient from "./KioskCondolenciasClient";

export default async function KioskCondolenciasPage() {
    const cookieStore = await cookies();

    const token =
        cookieStore.get(
            "aura_touch_token"
        )?.value;

    if (!token) {
        redirect(
            "/kiosk/condolencias/registrar"
        );
    }

    const auraTouch =
        await prisma.auraTouch.findUnique({
            where: {
                token,
            },

            select: {
                id: true,
                activo: true,
            },
        });

    if (!auraTouch || !auraTouch.activo) {
        redirect(
            "/kiosk/condolencias/registrar"
        );
    }

    return <KioskCondolenciasClient />;
}