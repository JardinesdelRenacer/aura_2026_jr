import Card from "@/app/kiosk/condolencias/components/ui/Card";
import { CondolenceForm } from "@/src/types/condolencias";

interface LetterPreviewProps {
    formData: CondolenceForm;
}

export default function LetterPreview({
    formData,
}: LetterPreviewProps) {
    return (

        <Card className="h-full p-10">
            {/* Header */}
            <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto mb-6" />

                <h2 className="text-3xl font-bold text-slate-800">
                    Mensaje para la familia
                </h2>

                <p className="mt-2 text-slate-500">
                    Así visualizara la familia su mensaje.
                </p>
            </div>

            <div className="my-8 h-px bg-grandient-to-r from-transparent via-blue-200 to-transparent" />

            {/* Carta */}
            <div className="flex-1">
                <div className="flex h-full items-center justify-center">
                    <h3 className="text-2xl font-bold text-slate-700">
                        {formData.fullName || "Nombre del remitente"}
                    </h3>

                    <p className="mt-8 text-lg leading-9 text-slate-600">
                        {formData.message || "Aquí aparecerá el mensaje que desea competir con la familia."}
                    </p>   
                </div>

                <div className="my-8 h-px bg-grandient-to-r from-transparent via-blue-200 to-transparent" />

            </div>

            {/* Firma */}
            <div className="text-center">
                <p className="text-slate-500">
                    Con respeto y solidaridad.

                    {formData.fullName || "Nombre d remitente"}
                </p>

                <p className="mt-2 font-semibold text-slate-700">
                    Jardines del renacer
                </p>

                {/* Fecha */}
                {new Date().toLocaleDateString("es-CO")}

            </div>
        </Card>
        
    );
}