"use client";

import Header from "../components/Header";
import SenderForm from "../components/SenderForm";
import LetterPreview from "../components/LetterPreview";
import SubmitButton from "../components/SubmitButton";
import { Obituary } from "@/src/types/obituary";
import { CondolenceForm } from "@/src/types/condolencias";
import { useEffect, useState } from 'react';
import { submitCondolence } from "@/src/services/condolenceApi";

interface FormScreenProps{
    obituary: Obituary | null;
    onSuccess: () => void;
}

export default function FormScreen({
    obituary,
    onSuccess,
}: FormScreenProps) {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<CondolenceForm>({
       
        fullName: "",
        documentType: "",
        documentNumber: "",
        phone: "",
        email: "",
        message: "",
        acceptedTerms: false
    });

    const isFormValid = 
        formData.fullName.trim() !== "" &&
        formData.documentType !== "" &&
        formData.documentNumber.trim() !== "" &&
        formData.phone.trim() !== "" &&
        formData.message.trim() !== "" &&
        formData.acceptedTerms;

    // TODO: Integrar con Prisma
    const handleSubmit = async() => {
        if (!obituary) return;

        try {
            setLoading(true);
            
            await submitCondolence({...formData, 
                // Lo agregamos al formulario
                obituaryId: obituary.id
            });

            onSuccess();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="w-full h-full">

            {/* Encabezado */}
            <div className="pt-8"> 
                {/* Espacio entre el encabezado y cuerpo */}
                <Header />
                
            </div>
            
            {/* Contenido */}
            <div className="grid grid-cols-12 gap-8 mt-8 px-10">

               

                {/* Formulario */}
                <div className="col-span-5">
                    <SenderForm formData={formData} setFormData={setFormData} />
                </div>


                {/* Vista Previa */}
                <div className="col-span-7">

                    {/* Test 2 */}
                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2 text-blue-700 font-semibold">
                            🌿
                            <span>Servicio Funerario</span>
                        </div>

                        <h2 className="mt-6 text-4xl font-bold text-slate-800">
                            {obituary?.name} {obituary?.surname}
                        </h2>

                        <p className="mt-2 text-xl font-medium text-blue-700">
                            {obituary?.description}
                        </p>
                    </div>

                    {/* test */}
                    <div className="mb-10 text-center">
                        <h2 className="text-4xl font-bold text-slate-800">
                            {obituary?.name} {obituary?.surname}
                        </h2>

                        <p className="mt-2 text-xl text-blue-700">
                            {obituary?.roomName}
                        </p>

                        <p className="mt-4 text-slate-500">
                            {obituary?.description}
                        </p>
                    </div>


                    <LetterPreview obituary={obituary} formData={formData} />
                </div>
            </div>

            {/* Footer */}
            <div className="h-[12vh] flex items-center justify-center">
                <SubmitButton disabled={!isFormValid} loading={loading} onClick={handleSubmit} />
            </div>
            
        </div>
    
    );
}