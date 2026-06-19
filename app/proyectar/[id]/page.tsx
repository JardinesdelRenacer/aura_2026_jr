"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import AdministrarTab from "@/app/proyectar/components/AdministrarTab";
import ConfiguracionTab from "@/app/proyectar/components/ConfiguracionTab";
import VistaPreviaTab from "@/app/proyectar/components/VistaPreviaTab";

import ProyectarPage from "../page";

export default function ProyectarSede() {
    return <ProyectarPage />;
}

