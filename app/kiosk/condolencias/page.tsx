"use client";

import Header from "./components/Header";
import SenderForm from "./components/SenderForm";
import LetterPreview from "./components/LetterPreview";
import SubmitButton from "./components/SubmitButton";

import { CondolenceForm } from "@/src/types/condolencias";
import { useEffect, useState } from 'react';


export default function KioskCondolencias() {

    const [formData, setFormData] = useState<CondolenceForm>({
        fullName: "",
        documentType: "",
        documentNumber: "",
        phone: "",
        email: "",
        message: "",
        acceptedTerms: false
    });

    const [screen, setScreen] = useState<"form" | "thanks">("form");

    useEffect(() => {
        if(screen==="thanks") {
            setTimeout(() => {
                setScreen("form");
            }, 5000)
        }
    }, [screen])

    return (

        <main className="min-h-screen bg-slate-100">

            {/* Encabezado */}
            <div className="h-[18vh]">
                <Header />
                
            </div>

            
            {/* Contenido */}
            <div className="grid grid-cols-12 gap-8 mt-8">
                

                {/* Formulario */}
                <div className="col-span-5">
                    <SenderForm formData={formData} setFormData={setFormData} />
                </div>


                {/* Vista Previa */}
                <div className="col-span-7">
                    <LetterPreview formData={formData} />
                </div>
            </div>

            {/* Footer */}
            <div className="h-[12vh] flex items-center justify-center">
                <SubmitButton />
            </div>
            
                
            <section>

                <p>Ahogandome en un mar de dudas.</p>
                
                {/* No borrar, organizar despues del header */}
                <div className="mt-6 mb-8 h-px bg-gradient-to-r from-blue-200 via-slate-200 to-transparent"/>
            </section>

            


            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <h1 className="text-5xl font-black">Aura Touch</h1>
            </div>
        </main>
        
        
    );
}