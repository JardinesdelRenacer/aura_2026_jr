"use client";

import { useParams } from "next/navigation";
import PantallaView from "@/app/display/components/PantallaView";


export default function PantallaById() {
    const params = useParams();

    const id = params.id as string;

    return (
        <PantallaView
            presentacionId={id}
        />
    );
}