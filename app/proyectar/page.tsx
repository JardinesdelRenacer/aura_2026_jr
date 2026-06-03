"use client";

import { useState } from "react";
import UploadMedia from "@/components/UploadMedia";
import Slideshow from "@/components/Slideshow";

export default function Proyectar() {

    const [files, setFiles] = useState<File[]>([]);

    const [autoPlay, setAutoplay] = useState(true);

    const [seconds, setSeconds] = useState(10);

    const [selectedImage, setSelectedImage] = useState(0);

    const imageUrls = files.map((file) =>
        URL.createObjectURL(file)
    );

    const guardarPresentacion = () => {
        localStorage.setItem(
            "presentacion", JSON.stringify({images: imageUrls, autoPlay, seconds, selectedImage})
        );
    };

    return (
        <div className="p-10">
            <h1 className="text-3xl">Configurar Presentación</h1>

            <div className="mt-6 space-y-4">
                <div>
                    <label className="block font-blod">Modo visualización</label>

                    <select value={autoPlay ?"auto" : "fixed"} onChange={(e) => setAutoplay(e.target.value === "auto")} className="border p-2 rounded">
                        <option value="fixed">Imagen fija</option>

                        <option value="auto">Presentación automática</option>
                    </select>
                </div>

                <div>
                    {/* Juntar label con input */}
                    <label className="block font-bold">Tiempo por imagen</label> 
                    <input type="number" min={1} value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} className="border p-2 rounded w-32"></input>
                </div>
            </div>

            { 
                !autoPlay && (
                    <div>
                        <label className="block font-bold">Imagen a mostrar</label>

                        <select value={selectedImage} onChange={(e) => setSelectedImage(Number(e.target.value))} className="border p-2 rounded">
                            {files.map((file, index) => (
                                <option key={index} value={index}>{file.name}</option>
                            ))}
                        </select>
                    </div>
                )
            }
           
            <div className="p-10">   
                <UploadMedia files={files} setFiles={setFiles}/>

                <p className="mt-5">
                    Total archivos: {files.length}
                </p>

                <div className="grid grid-cols-3 gap-4 mt-5">
                    {imageUrls.map((url, index) => (
                        <img key={index} src={url} alt={`imagen-${index}`} className="w-full h-48 object-cover rounded"></img> 
                    ))}
                </div>

                <div className="mt-10">
                    <h2 className="text-xl font-bold mb-4">Vista previa de la presentiación</h2>

                    <Slideshow images={imageUrls} autoPlay={autoPlay} seconds={seconds} selectedImage={selectedImage}></Slideshow>
                </div>
                
                {/* Esto es un botón, no lo junte en una sola linea y se ve medio feo xd */}
                <button onClick={() => {
                    guardarPresentacion();

                    window.open("/Pantalla","_blank");
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded mt-5">
                        Proyectar
                </button>


            </div>
        </div>    
    );
}

