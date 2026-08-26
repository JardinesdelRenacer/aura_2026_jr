import React, { useState, useRef, useEffect } from "react";


interface Props{
    presentacionId: string;
}

export const PantallaEscalada = ({ presentacionId }:Props) => {
    console.log("Escalando:", presentacionId);
    return (
        <iframe title="Vista previa de la pantalla" src={`/display/${presentacionId}?preview=1`} className="w-full h-full border-0" />
    );
};
