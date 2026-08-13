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

    const [submitError, setSubmitError] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (!obituary) {
            setSubmitError("No se encontro el obituario seleccinado.");   
            return;
        }
        try {
            setSubmitError(null);
            setIsSubmitting(true);

            await submitCondolence({
                obituaryId: obituary.id,
                fullName: formData.fullName,
                documentType: formData.documentType,
                documentNumber: formData.documentNumber,
                phone: formData.phone,
                email: formData.email,
                message: formData.message,
                acceptedTerms: formData.acceptedTerms,
            });

            onSuccess();
            
        } catch (error) {
            if (error instanceof Error) {
                setSubmitError(error.message);
            } else {
                setSubmitError(
                    "Ocurrió un error al enviar la condolencia."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="w-full min-h-screen px-4 pb-10 pt-6 sm:px-6 lg:px-10">

            {/* errores */}
            {submitError && (
                <div role="alert" className="fixed top-6 left-1/2 z-[9999] w-[calc(100%-3rem)] max-w-xl -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-start gap-4 rounded-2xl border border-red-200 bg-white px-5 py-4 shadow-2xl">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600">!</div>

                        <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-800">Revisa la información</p>

                            <p className="mt-1 text-sm text-slate-600">{submitError}</p>
                        </div>

                        <button type="button" onClick={() => setSubmitError(null)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Cerrar alerta">✕</button>
                    </div>
                </div>
            )}

            {/* Encabezado */}
            <div className="mx-auto max-w-[1800px]">
                <Header />
            </div>
            
            {/* Contenido */}
            <div className="mx-auto mt-6 grid max-w-[1800px] grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">

                {/* Formulario */}
                <div className="lg:col-span-5">
                    <SenderForm formData={formData} setFormData={setFormData} />
                </div>


                {/* Vista Previa */}
                <div className="lg:col-span-7">

                    {/* Test 2
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
                    {/* <div className="mb-10 text-center">
                        <h2 className="text-4xl font-bold text-slate-800">
                            {obituary?.name} {obituary?.surname}
                        </h2>

                        <p className="mt-2 text-xl text-blue-700">
                            {obituary?.roomName}
                        </p>

                        <p className="mt-4 text-slate-500">
                            {obituary?.description}
                        </p>
                    </div> */} 


                    <LetterPreview obituary={obituary} formData={formData} />
                </div>
            </div>

            {/* Footer */}
            <div className="mx-auto mt-6 flex max-w-[1800px] justify-center border-t border-slate-200/80 pt-6 sm:mt-8 sm:pt-8">
                <SubmitButton disabled={!isFormValid} loading={isSubmitting} onClick={handleSubmit} />
            </div>
            
        </div>
    
    );
}
