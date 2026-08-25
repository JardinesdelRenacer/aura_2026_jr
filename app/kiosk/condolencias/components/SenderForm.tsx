"use client";

import React, { useState } from "react";

import Card from "@/app/kiosk/condolencias/components/ui/Card";

import AuraInput from "@/src/components/ui/AuraInput";
import AuraSelect from "@/src/components/ui/AuraSelect";
import AuraTextarea from "@/src/components/ui/AuraTextarea";
import AuraCheckbox from "@/src/components/ui/AuraCheckbox";

import { AuraKeyboard } from "@/src/components/aura-touch/AuraKeyboard";

import { CondolenceForm } from "@/src/types/condolencias";

interface SenderFormProps {
    formData: CondolenceForm;

    setFormData: React.Dispatch<
        React.SetStateAction<CondolenceForm>
    >;
}

type KeyboardField =
    | "fullName"
    | "documentNumber"
    | "phone"
    | "email"
    | "message";

export default function SenderForm({
    formData,
    setFormData,
}: SenderFormProps) {
    const [keyboardOpen, setKeyboardOpen] =
        useState(false);

    const [activeField, setActiveField] =
        useState<KeyboardField | null>(null);

    function abrirTeclado(
        field: KeyboardField
    ) {
        setActiveField(field);

        setKeyboardOpen(true);
    }

    function cerrarTeclado() {
        setKeyboardOpen(false);

        setActiveField(null);
    }

    function obtenerValorActivo() {
        if (!activeField) {
            return "";
        }

        const value =
            formData[activeField];

        return typeof value === "string"
            ? value
            : "";
    }

    function actualizarCampoActivo(
        value: string
    ) {
        if (!activeField) {
            return;
        }

        setFormData((prev) => ({
            ...prev,

            [activeField]: value,
        }));
    }

    function escribirTecla(
        key: string
    ) {
        if (!activeField) {
            return;
        }

        const valorActual =
            obtenerValorActivo();

        actualizarCampoActivo(
            valorActual + key
        );
    }

    function borrarCaracter() {
        if (!activeField) {
            return;
        }

        const valorActual =
            obtenerValorActivo();

        actualizarCampoActivo(
            valorActual.slice(0, -1)
        );
    }

    function agregarEspacio() {
        if (!activeField) {
            return;
        }

        /*
         * Documento y teléfono
         * no necesitan espacios.
         */
        if (
            activeField ===
                "documentNumber" ||
            activeField === "phone"
        ) {
            return;
        }

        const valorActual =
            obtenerValorActivo();

        actualizarCampoActivo(
            valorActual + " "
        );
    }

    return (
        <>
            <Card className="h-full p-10">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">
                        Información del remitente
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Complete la siguiente
                        información.
                    </p>
                </div>

                <div className="my-8 h-px bg-gradient-to-r from-blue-200 via-slate-200 to-transparent" />

                {/* Formulario */}
                <div className="space-y-7">
                    {/* Nombre completo */}
                    <AuraInput
                        label="Nombre completo"
                        value={
                            formData.fullName
                        }
                        onChange={(value) =>
                            setFormData(
                                (prev) => ({
                                    ...prev,

                                    fullName:
                                        value,
                                })
                            )
                        }
                        onFocus={() =>
                            abrirTeclado(
                                "fullName"
                            )
                        }
                        placeholder="Nombre completo"
                        required
                    />

                    {/* Documento */}
                    <div className="grid grid-cols-2 gap-5">
                        {/* Tipo documento */}
                        <AuraSelect
                            label="Tipo de Documento"
                            value={
                                formData.documentType
                            }
                            onChange={(value) =>
                                setFormData(
                                    (
                                        prev
                                    ) => ({
                                        ...prev,

                                        documentType:
                                            value,
                                    })
                                )
                            }
                            required
                            options={[
                                {
                                    value: "CC",
                                    label:
                                        "Cédula de Ciudadanía",
                                },
                                {
                                    value: "TI",
                                    label:
                                        "Tarjeta de Identidad",
                                },
                                {
                                    value: "CE",
                                    label:
                                        "Cédula de Extranjería",
                                },
                                {
                                    value: "PP",
                                    label:
                                        "Pasaporte",
                                },
                            ]}
                        />

                        {/* Número documento */}
                        <AuraInput
                            label="Número de Documento"
                            value={
                                formData.documentNumber
                            }
                            onChange={(value) =>
                                setFormData(
                                    (
                                        prev
                                    ) => ({
                                        ...prev,

                                        documentNumber:
                                            value,
                                    })
                                )
                            }
                            onFocus={() =>
                                abrirTeclado(
                                    "documentNumber"
                                )
                            }
                            placeholder="Ej: 1088245678"
                            inputMode="numeric"
                            required
                        />
                    </div>

                    {/* Contacto */}
                    <div className="grid grid-cols-2 gap-5">
                        {/* Celular */}
                        <AuraInput
                            label="Celular"
                            value={
                                formData.phone
                            }
                            onChange={(value) =>
                                setFormData(
                                    (
                                        prev
                                    ) => ({
                                        ...prev,

                                        phone: value,
                                    })
                                )
                            }
                            onFocus={() =>
                                abrirTeclado(
                                    "phone"
                                )
                            }
                            placeholder="3001234567"
                            type="tel"
                            inputMode="numeric"
                            required
                        />

                        {/* Email */}
                        <AuraInput
                            label="Correo electrónico"
                            value={
                                formData.email
                            }
                            onChange={(value) =>
                                setFormData(
                                    (
                                        prev
                                    ) => ({
                                        ...prev,

                                        email: value,
                                    })
                                )
                            }
                            onFocus={() =>
                                abrirTeclado(
                                    "email"
                                )
                            }
                            placeholder="correo@ejemplo.com"
                            type="email"
                            inputMode="email"
                        />
                    </div>

                    {/* Mensaje */}
                    <div>
                        <AuraTextarea
                            label="Mensaje para la familia"
                            value={
                                formData.message
                            }
                            onChange={(value) =>
                                setFormData(
                                    (
                                        prev
                                    ) => ({
                                        ...prev,

                                        message:
                                            value,
                                    })
                                )
                            }
                            onFocus={() =>
                                abrirTeclado(
                                    "message"
                                )
                            }
                            placeholder="Escriba aquí unas palabras de apoyo para la familia..."
                            required
                        />
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-4">
                        <AuraCheckbox
                            label="Autorizo el tratamiento de mis datos personales para el envío de este mensaje"
                            checked={
                                formData.acceptedTerms
                            }
                            onChange={(
                                checked
                            ) =>
                                setFormData(
                                    (
                                        prev
                                    ) => ({
                                        ...prev,

                                        acceptedTerms:
                                            checked,
                                    })
                                )
                            }
                            required
                        />
                    </div>
                </div>
            </Card>

            {/* Teclado virtual */}
            <AuraKeyboard
                visible={keyboardOpen}
                onKeyPress={
                    escribirTecla
                }
                onBackspace={
                    borrarCaracter
                }
                onSpace={agregarEspacio}
                onClose={cerrarTeclado}
            />
        </>
    );
}