"use client";

import Header from "../components/Header";
import SenderForm from "../components/SenderForm";
import LetterPreview from "../components/LetterPreview";
import SubmitButton from "../components/SubmitButton";
import { CondolenceForm } from "@/src/types/condolencias";
import { useEffect, useState } from 'react';

interface FormScreenProps{
    onSuccess: () => void;
}

export default function FormScreen({
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
        setLoading(true);

        // Guarda en prisma
        setLoading(false);
    }
    
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
                    <LetterPreview formData={formData} />
                </div>
            </div>

            {/* Footer */}
            <div className="h-[12vh] flex items-center justify-center">
                <SubmitButton disabled={!isFormValid} loading={loading} onClick={handleSubmit} />
            </div>
            
        </div>
    
    );
}