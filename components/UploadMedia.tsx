"use client";

interface Props {
    setFiles: React.Dispatch<
        React.SetStateAction<File[]>
    >;
}

export default function UploadMedia({
    setFiles,
}: Props) {
    
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        if (!e.target.files) return

        // Tomamos los archivos nuevos seleccionados
        const newFiles = Array.from(e.target.files);
        // Los añadimos al final de la lista que ya existía (en lugar de borrarlos)
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        
        // Limpiamos el input para que te permita subir la misma foto/video más de una vez si lo necesitas
        e.target.value = "";
    };

    return(
        <div className="w-full flex justify-center md:justify-start">
            {/* Ocultamos el input nativo que dice "Ningún archivo seleccionado" y usamos un label estilizado */}
            <label 
                htmlFor="file-upload" 
                className="cursor-pointer inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-green-500/40 to-emerald-600/40 border border-green-400/50 rounded-xl backdrop-blur-md shadow-[0_8px_32px_0_rgba(34,197,94,0.3)] hover:bg-green-500/60 hover:shadow-[0_8px_32px_0_rgba(34,197,94,0.5)] hover:-translate-y-1 w-full sm:w-auto text-center overflow-hidden relative group"
            >
                {/* Brillo 3D interno */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-transparent via-white/5 to-white/20"></div>
                
                <span className="relative z-10 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Agregar Fotos / Videos
                </span>
            </label>
            <input id="file-upload" type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleChange} />
        </div>
    );
}
