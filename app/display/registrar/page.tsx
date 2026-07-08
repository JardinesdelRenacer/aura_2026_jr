"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import RegistrarDisplayClient from "./RegistrarDisplayClient";

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
            Cargando...
        </div>}>
            <RegistrarDisplayClient />
        </Suspense>
    );
}

   