"use client";

import React from "react";

import { cn } from "@/src/lib/cn";

import { cardVariants } from "./card.styles";

import { AuraCardProps } from "./card.types";

export default function AuraCard({
    children,
    className,
    variant,
    padding,
    hover,
    clickable,
    ...props
}: AuraCardProps) {
    return (
        <div className={cn(cardVariants({variant, padding, hover, clickable}), className)} {...props}>
            {children}
        </div>
    );
}