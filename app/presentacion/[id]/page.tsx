import { PrismaClient } from "@/app/generated/prisma/client";
import SlideshowViewer from "@/components/SlideshowViewer";

const prisma = new PrismaClient();

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function PresentacionPage({params,}: Props) {
    const { id } = await params;
    
    const presentacion = await prisma.presentacion.findUnique({where: {id,},});

    if (!presentacion) {
        return (
            <div className="p-10">
                presentación no encontrada
            </div>
        );
    }

    return(
        <SlideshowViewer 
            images={JSON.parse(presentacion.images)}
            autoPlay={presentacion.autoPlay}
            seconds={presentacion.seconds}>
        </SlideshowViewer>
    );
    
}