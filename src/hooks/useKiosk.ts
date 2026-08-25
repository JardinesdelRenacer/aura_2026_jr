"use client";

import { useCallback, useState } from "react";

export function useKiosk() {
    const [keyboardOpen, setKeyboardOpen] =
        useState(false);

    const openKeyboard = useCallback(() => {
        setKeyboardOpen(true);
    }, []);

    const closeKeyboard = useCallback(() => {
        setKeyboardOpen(false);
    }, []);

    const restartSession = useCallback(() => {
        window.location.href =
            "/kiosk/condolencias";
    }, []);

    const enterFullScreen = useCallback(
        async () => {
            try {
                if (!document.fullscreenElement) {
                    await document.documentElement.requestFullscreen();
                }
            } catch (error) {
                console.error(
                    "No fue posible entrar en pantalla completa:",
                    error
                );
            }
        },
        []
    );

    const exitFullScreen = useCallback(
        async () => {
            try {
                if (document.fullscreenElement) {
                    await document.exitFullscreen();
                }
            } catch (error) {
                console.error(
                    "No fue posible salir de pantalla completa:",
                    error
                );
            }
        },
        []
    );

    return {
        keyboardOpen,

        openKeyboard,
        closeKeyboard,

        restartSession,

        enterFullScreen,
        exitFullScreen,
    };
}