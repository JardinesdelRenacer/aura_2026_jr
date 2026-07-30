import React from "react";

import { VariantProps } from "class-variance-authority";
import { cardVariants } from "./card.styles";

export interface AuraCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof cardVariants> {
    
    children: React.ReactNode;

    hover?: boolean;

    clickable?: boolean;

    className?: string;
}