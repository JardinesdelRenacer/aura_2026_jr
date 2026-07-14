import Card from "@/app/kiosk/condolencias/components/ui/Card";
import AuraInput from "@/src/components/ui/AuraInput";
import { CondolenceForm } from "@/src/types/condolencias";
import AuraSelect from "@/src/components/ui/AuraSelect";
import AuraTextarea from "@/src/components/ui/AuraTextarea";

import React from "react";

interface SenderFormProps {
    formData: CondolenceForm;
    setFormData: React.Dispatch<React.SetStateAction<CondolenceForm>>;

}
export default function SenderForm({
    formData,
    setFormData,
}: SenderFormProps) {

    return (

        <Card className="h-full p-8">

            {/* Header */}

            <div>
                <h2 className="text-3xl font-bold text-slate-800">
                    👤 Tus datos
                </h2>

                <p className="mt-2 text-slate-500">
                    Complete la siguiente información.
                </p>
            </div>

            <div className="my-8 h-px bg-gradient-to-r from-blue-200 via-slate-200 to-transparent" />

            {/* Formulario */}
            <div className="space-y-6">

                {/*  Nombre  Completo */}
                <div>
                    <AuraInput label="Nombre completo" value={formData.fullName} onChange={(value)=> setFormData({ ...formData, fullName: value })}
                        placeholder="Nombre completo" required />
                </div>


                {/* */}
                <div className="grid grid-cols-2 gap-5">

                    {/* Tipo de Documento*/}
                    <div>
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
                        
                    </div>
                    
                    {/* C.C */}
                    <div>
                        <AuraInput
                            label="Número de Documento"
                            value={formData.documentNumber}
                            onChange={(value) =>
                                setFormData({...formData, documentNumber: value })
                            }
                            placeholder="Ej: 1088245678" required
                        />
                    </div>
                </div>


                {/* */}
                <div className="grid grid-cols-2 gap-5">

                    {/* Número de teléfono */}
                    <div>
                        <AuraInput
                            label="Celular"
                            value={formData.phone}
                            onChange={(value) => setFormData({...formData, phone: value })}
                            placeholder="3001234567"
                            type="tel"
                            required
                        />
                    </div>
                    
                    {/* Email */}
                    <div>
                        <AuraInput
                            label="Correo electronico"
                            value={formData.email}
                            onChange={(value) => setFormData({...formData, email: value })}
                            placeholder="correo@ejemplo.com" 
                            type="email"
                        />
                    </div>
                </div>
                

                {/* Checkbox */}
                <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded border-2 border-slate-300" />

                    <div className="h-4 w-64 rounded bg-slate-200" />

                </div>

                {/* Mensaje/condolencia */}
                <div>
                    <AuraTextarea
                        label="Mensaje para la familia"
                        value={formData.message}
                        onChange={(value) => setFormData({...formData, message: value })}
                        placeholder="Escriba aquí unas palabras de apoyo para la familia..."
                        required
                    />
                </div>

            </div>
        </Card>
    );
}
