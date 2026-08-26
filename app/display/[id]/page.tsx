"use client";

import { useParams, useSearchParams } from "next/navigation";
import PantallaView from "@/app/display/components/PantallaView";


export default function PantallaById() {
    const params = useParams();
    const searchParams = useSearchParams();

    const id = params.id as string;

    return (
        <PantallaView
            presentacionId={id}
            preview={searchParams.get("preview") === "1"}
        />
    );
}
