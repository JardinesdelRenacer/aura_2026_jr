import Card from "@/app/kiosk/condolencias/components/ui/Card";
import AuraInput from "@/src/components/ui/AuraInput";
import AuraSelect from "@/src/components/ui/AuraSelect";
import AuraTextarea from "@/src/components/ui/AuraTextarea";
import AuraCheckbox from "@/src/components/ui/AuraCheckbox";

import { CondolenceForm } from "@/src/types/condolencias";
import React from "react";
import { UserRound } from "lucide-react";

interface SenderFormProps {
    formData: CondolenceForm;
    setFormData: React.Dispatch<React.SetStateAction<CondolenceForm>>;

}
export default function SenderForm({
    formData,
    setFormData,
}: SenderFormProps) {

    return (

        <Card className="h-full p-10">

            {/* Header */}

            <div>
                <h2 className="text-3xl font-bold text-slate-800">
                    Información del remitente
                </h2>

                <p className="mt-2 text-slate-500">
                    Complete la siguiente información.
                </p>
            </div>

            <div className="my-8 h-px bg-gradient-to-r from-blue-200 via-slate-200 to-transparent" />

            {/* Formulario */}
            <div className="space-y-7">

                {/*  Nombre  Completo */}
                    <AuraInput label="Nombre completo" value={formData.fullName} onChange={(value)=> setFormData({ ...formData, fullName: value })}
                        placeholder="Nombre completo" required />

                {/* Documento */}
                <div className="grid grid-cols-2 gap-5">

                    {/* Tipo de Documento*/}
                    <AuraSelect
                        label="Tipo de Documento"
                        value={formData.documentType}
                        onChange={(value) =>
                            setFormData({...formData, documentType: value })
                        }
                        required options={[
                            {
                                value: "CC", label: "Cédula de Ciudanía"
                            },
                            {
                                value: "CE", label: "Cédula de Extranjeria"
                            },
                            {
                                value: "PP", label: "Pasaporte"
                            },
                        ]}
                    />
                                        
                    {/* C.C */}
                    <AuraInput
                        label="Número de Documento"
                        value={formData.documentNumber}
                        onChange={(value) =>
                            setFormData({...formData, documentNumber: value })
                        }
                        placeholder="Ej: 1088245678" required
                    />
                </div>


                {/* Contacto */}
                <div className="grid grid-cols-2 gap-5">

                    {/* Número de teléfono */}
                    <AuraInput
                        label="Celular"
                        value={formData.phone}
                        onChange={(value) => setFormData({...formData, phone: value })}
                        placeholder="3001234567"
                        type="tel"
                        //inputMode="numeric"
                        required
                    />
                    
                    {/* Email */}
                    <AuraInput
                        label="Correo electronico"
                        value={formData.email}
                        onChange={(value) => setFormData({...formData, email: value })}
                        placeholder="correo@ejemplo.com" 
                        type="email"
                    />
                </div>

                {/* Mensaje/condolencia */}
                <div>
                    {/*
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-700">
                                Mensaje para la familia
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                                Dedique unas palabras de apoyo, solidaridad y acompañamiento
                            </p>
                        </div>

                        <span className="text-sm text-slate-400">
                            {formData.message.length}/500
                        </span>
                    </div>
                    */}

                    <AuraTextarea
                        label="Mensaje para la familia"
                        value={formData.message}
                        onChange={(value) => setFormData({...formData, message: value })}
                        placeholder="Escriba aquí unas palabras de apoyo para la familia..."
                        required
                    />
                </div>
                
                {/* Checkbox */}
                <div className="flex items-center gap-4">
                    <AuraCheckbox 
                        label="Autorizo el tratamiento de mis datos personales para el envio de este mensaje"
                        checked={formData.acceptedTerms}
                        onChange={(checked) => setFormData({ ...formData, acceptedTerms: checked })}
                        required
                    />

                </div>
            </div>
        </Card>
    );
}
