import Image from "next/image";
import Card from "@/app/kiosk/condolencias/components/ui/Card";
import Paper from "@/src/components/ui/Paper";
import { CondolenceForm } from "@/src/types/condolencias";

import { Obituary } from "@/src/types/obituary";

interface LetterPreviewProps {
    obituary: Obituary | null;
    formData: CondolenceForm;
}

export default function LetterPreview({
    obituary,
    formData,
}: LetterPreviewProps) {
    return (

        <Card className="h-full p-10">
            <Paper className="flex h-full flex-col justify-between px-14 py-12">
                {/* Header */}
                <div className="text-center">
                    
                    <Image src="/imagenes/Logo_test.png" alt="Jardines del Renacer" width={85} height={85} className="mx-auto mb-6 object-contain"/>

                    <p className="mt-3 text-xs uppercase tracking-[0.35em] text-slate-400">
                        Carta de Condolencias
                    </p>

                    <h2 className="mt-5 text-4xl font-bold text-slate-800">
                        Mensaje para la familia de Mushu
                    </h2>

                    <h3 className="mt-2 text-3xl font-bold text-blue-700">
                        {obituary?.name} {obituary?.surname}
                    </h3>

                    <p className="mt-2 text-slate-500">
                        {obituary?.roomName}
                    </p>

                    <p className="mt-3 text-slate-500">
                        Así visualizará la familia su mensaje.
                    </p>
                </div>

                <div className="my-10 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

                {/* Inicio de carta */}
                <div className="flex-1 px-6">
                    <p className="text-lg font-medium text-slate-700">
                        Estimada familia:
                    </p>

                    {/* Carta */}
                    <p className="mt-10 text-lg leading-9 whitespace-pre-wrap text-slate-600">
                        {formData.message || `las palabras de apoyo que escriba aparecerán aquí mientras redacta su mensaje.`}
                    </p>

                    <div className="my-8 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

                </div>

                {/* Firma */}
                <div className="text-center">
                    <p className="text-slate-500 italic">
                        Con respeto y solidaridad.
                    </p>

                    <h3 className="mt-6 text-2xl font-semibold text-slate-800">
                        {formData.fullName || "Nombre del remitente"}
                    </h3>

                    <p className="mt-2 font-semibold text-slate-700">
                        Jardines del Renacer
                    </p>

                    {/* Fecha */}
                    {new Date().toLocaleDateString("es-CO")}

                </div>
            </Paper>
        </Card>
        
    );
}