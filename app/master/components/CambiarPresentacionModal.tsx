"use client";

import { useEffect, useState } from "react";
import {
    Check,
    DoorOpen,
    Monitor,
    RotateCw,
    X,
} from "lucide-react";
import { roomLabel, type RoomKey } from "@/src/lib/rooms";

interface Props {
    open: boolean;
    onClose: () => void;

    pantalla: {
        id: string;
        nombre?: string;
        verticalRoom?: RoomKey | null;
        screenRotation?: string | null;
    };

    rooms: RoomKey[];
    permiteModoVertical: boolean;
    permiteRotacionFisica: boolean;
    onActualizada: () => void;
}

function obtenerNombreSala(room: RoomKey) {
    return roomLabel(room);
}

export default function CambiarPresentacionModal({
    open,
    onClose,
    pantalla,
    rooms,
    permiteModoVertical,
    permiteRotacionFisica,
    onActualizada,
}: Props) {
    const [seleccionada, setSeleccionada] =
        useState<RoomKey | null>(
            pantalla.verticalRoom ?? null
        );

    const [guardando, setGuardando] =
        useState(false);

    const [screenRotation, setScreenRotation] =
        useState("0");

    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;

        setSeleccionada(
            pantalla.verticalRoom ?? null
        );
        setScreenRotation(
            ["90", "270"].includes(pantalla.screenRotation ?? "")
                ? pantalla.screenRotation!
                : "0"
        );

        setError("");
    }, [
        open,
        pantalla.id,
        pantalla.verticalRoom,
        pantalla.screenRotation,
    ]);

    async function guardar() {
        try {
            setGuardando(true);
            setError("");

            const response = await fetch(
                `/api/master/pantallas/${pantalla.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        verticalRoom: permiteModoVertical
                            ? seleccionada
                            : null,
                        ...(permiteRotacionFisica
                            ? { screenRotation }
                            : {}),
                    }),
                }
            );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.success
            ) {
                setError(
                    result.error ??
                        "No se pudo cambiar la sala."
                );
                return;
            }

            onActualizada();
        } catch (error) {
            console.error(
                "Error cambiando sala:",
                error
            );

            setError(
                "Ocurrió un error al cambiar la sala."
            );
        } finally {
            setGuardando(false);
        }
    }

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-slate-100 px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                            <DoorOpen size={22} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                Configurar proyección
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Pantalla:{" "}
                                <span className="font-semibold text-slate-700">
                                    {pantalla.nombre ??
                                        "Sin nombre"}
                                </span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={guardando}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto px-8 py-6">
                    {!permiteModoVertical ? (
                        <button
                            type="button"
                            onClick={() =>
                                setSeleccionada(null)
                            }
                            className="relative w-full rounded-2xl border-2 border-blue-600 bg-blue-50 p-5 text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                                    <Monitor size={20} />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900">
                                        Pantalla completa
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Esta sede no usa
                                        visualización por sala.
                                    </p>
                                </div>

                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                                    <Check
                                        size={16}
                                        strokeWidth={3}
                                    />
                                </div>
                            </div>
                        </button>
                    ) : (
                        <div className="space-y-3">
                            {rooms.map((room) => {
                                const activa =
                                    seleccionada === room;

                                return (
                                    <button
                                        type="button"
                                        key={room}
                                        onClick={() => {
                                            setSeleccionada(
                                                room
                                            );
                                            setError("");
                                        }}
                                        className={`relative w-full rounded-2xl border-2 p-5 text-left transition-all ${
                                            activa
                                                ? "border-blue-600 bg-blue-50 shadow-md shadow-blue-100"
                                                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                                                    activa
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                <DoorOpen
                                                    size={20}
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900">
                                                    {obtenerNombreSala(
                                                        room
                                                    )}
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    Mostrar contenido
                                                    exclusivo de esta
                                                    sala.
                                                </p>
                                            </div>

                                            {activa && (
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                                                    <Check
                                                        size={16}
                                                        strokeWidth={
                                                            3
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {permiteRotacionFisica && (
                        <section className="mt-6 rounded-2xl border border-violet-200 bg-violet-50/70 p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
                                    <RotateCw size={19} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Montaje vertical de la TV
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Solo afecta esta pantalla física de Zaragoza. La vista previa no se modifica.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                {[
                                    { value: "0", title: "Sin giro", description: "Usar la orientación actual." },
                                    { value: "90", title: "Giro a la derecha", description: "Para TV montada 90°." },
                                    { value: "270", title: "Giro a la izquierda", description: "Para el montaje contrario." },
                                ].map((option) => {
                                    const active = screenRotation === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setScreenRotation(option.value)}
                                            className={`rounded-xl border-2 p-3 text-left transition-all ${
                                                active
                                                    ? "border-violet-600 bg-white shadow-sm"
                                                    : "border-transparent bg-white/70 hover:border-violet-200"
                                            }`}
                                        >
                                            <span className="block text-sm font-bold text-slate-900">
                                                {option.title}
                                            </span>
                                            <span className="mt-1 block text-xs leading-4 text-slate-500">
                                                {option.description}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-8 py-5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={guardando}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={guardar}
                        disabled={
                            guardando ||
                            (permiteModoVertical &&
                                !seleccionada)
                        }
                        className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {guardando
                            ? "Guardando..."
                            : "Guardar cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
}
