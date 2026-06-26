"use client";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase";


interface Props {
    sedeId: string;

    setFiles: React.Dispatch<
        React.SetStateAction<File[]>

    >;
    room?: string;
    onUploadComplete?: () => void;
}

export default function UploadMedia({
    sedeId, setFiles, room, onUploadComplete
}: Props) { 
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const handleChange =  async(
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        if (!e.target.files) return
        const nuevosArchivos = Array.from(e.target.files);
        if (nuevosArchivos.length === 0) return;

        setIsUploading(true);
        setShowSuccess(false);

        // Creamos objetos File con la información del room para el estado local
        const archivosConRoom = nuevosArchivos.map(file => {
            const fileWithRoom: any = file;
            fileWithRoom.room = room;
            return fileWithRoom;
        });

        for (const file of nuevosArchivos) {
            const fileName = `${sedeId}/${Date.now()}-${file.name}`;

            const { error } = await supabase.storage.from("media").upload(fileName, file, { upsert: false, });

            if (error) {
                console.log(error);
                continue;
            }

            const  { data } = supabase.storage.from("media").getPublicUrl(fileName);

            const response = await fetch("/api/master/media", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({
                    sedeId,
                    url: data.publicUrl,
                    type: file.type.startsWith("video/") ? "video" : "image", fileName: file.name, room: room
                }),
            }); 

            const result = await response.json();

            console.log("MEDIA GUARDADA:");
            console.log(result);
        }

        // Actualizamos el estado local con los archivos que incluyen el room
        setFiles((prev) => [
            ...prev,
            ...archivosConRoom,
        ]);

        // Notificamos al padre que la carga ha terminado para que pueda recargar la lista
        onUploadComplete?.();
        setIsUploading(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // Ocultar el mensaje después de 3 segundos

        // Limpiamos el input para que te permita subir la misma foto/video más de una vez si lo necesitas
        e.target.value = "";
    };
        
    return(
        <div className="w-full flex justify-center md:justify-start">
            {/* Ocultamos el input nativo que dice "Ningún archivo seleccionado" y usamos un label estilizado */}
            <label 
                htmlFor="file-upload" 
                className={`cursor-pointer inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 rounded-xl backdrop-blur-md w-full sm:w-auto text-center overflow-hidden relative group ${
                    isUploading 
                        ? 'bg-slate-400 border-slate-500 cursor-not-allowed' 
                        : showSuccess
                        ? 'bg-gradient-to-r from-blue-500 to-sky-600 border-blue-400'
                        : 'bg-gradient-to-r from-green-500/40 to-emerald-600/40 border border-green-400/50 shadow-[0_8px_32px_0_rgba(34,197,94,0.3)] hover:bg-green-500/60 hover:shadow-[0_8px_32px_0_rgba(34,197,94,0.5)] hover:-translate-y-1'
                }`}
            >
                {/* Brillo 3D interno */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-transparent via-white/5 to-white/20"></div>
                
                <span className="relative z-10 flex items-center gap-2">
                    {isUploading ? (
                        <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Cargando...</>
                    ) : showSuccess ? (
                        <>¡Listo!</>
                    ) : (
                        <><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>Agregar Fotos / Videos</>
                    )}
                </span>
            </label>
            <input id="file-upload" type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleChange} disabled={isUploading} />
        </div>
    );
}
