import React, { useState, useRef, useEffect } from "react";


interface Props{
    presentacionId: string;
}

export const PantallaEscalada = ({ presentacionId }:Props) => {
    console.log("Escalando:", presentacionId);
    return (
        <iframe src={`/display/${presentacionId}`} className="w-full h-full border-0" />
    );
};
  