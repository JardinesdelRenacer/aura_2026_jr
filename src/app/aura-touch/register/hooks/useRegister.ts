"use client";

import { useState } from "react";

export interface RegisterFormData {
    firstName: string;
    lastName: string;
    document: string;
    email: string;
    phone: string;
}

export function useRegister() {
    const [form, setForm] = useState<RegisterFormData>({
        firstName: "",
        lastName: "",
        document: "",
        email: "",
        phone: "",
    });

    function handleChange(
        field: keyof RegisterFormData,
        value: string
    ) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function handleSubmit() {
        console.log(form);
    }

    return {
        form,
        handleChange,
        handleSubmit,
    };
}