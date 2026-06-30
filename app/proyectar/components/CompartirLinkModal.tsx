"use client";

import { useState } from "react";

interface Props {
    presentacionId: string;
    onClose: () => void;
}

export default function CompartirLinkModal({
    presentacionId,
    onClose,
}: Props) {

    const [copiado, setCopiado] = useState(false);

    const url = `${window.location.origin}/Pantalla/${presentacionId}`;

    const copiar = async () => {
        await navigator.clipboard.writeText(url);
        setCopiado(true);

        setTimeout(() => {
            setCopiado(false);
        }, 2000);
    };

    return(
        <div className="firex inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">

            <div className="w-full max-w xl rounded-3xl bg-white shadow-2xl border-slate-200 overflow-hidden">

                <div className="px-8 py-6 border-b">
                    <h2 className="text-2xl font-black text-slate-800">
                        Compartir Pantalla
                    </h2>

                    <p className="text-sm text-slate-500 mt-2">
                        Comparte este enlace para proyectar la presentación desde cualquier Smart TV o Navegador.
                    </p>
                </div>

                <div className="p-8 space-y-6">
                    <div>
                        <label className="text-xs uppercase font-blod text-slate-500">
                            Link generado
                        </label>

                        <input
                            readOnly
                            value={url}
                            className="mt-2 w-full border rounded-xl px-4 py-3 bg-slate-50 text-sm"/>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={copiar}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-bold transition">
                                {copiado ? "✅ Copiado" : "📋 Copiar enlace" }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}