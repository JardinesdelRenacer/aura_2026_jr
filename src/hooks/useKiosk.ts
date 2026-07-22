"use client";

const isWindows = typeof navigator !== "undefined" && navigator.userAgent.includes("Windows");

export function useKiosk() {
    const openKeyboard = () => {

        if (isWindows) {
            console.log("Abrir teclado en pantalla virtual");
        }
    };

    const closeKeyboard = () => {
        console.log("Cerrar teclado virtual");
    };

    const restartSession = () => {
        console.log("Reiniciar sesión del kiosk")
    };

    const enterFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    };

    const exitFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    };

    return{ openKeyboard, closeKeyboard, restartSession, enterFullScreen, exitFullScreen };
}