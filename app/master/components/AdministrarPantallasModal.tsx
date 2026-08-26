"use client";

import { useEffect, useMemo, useState } from "react";

import PantallaCard from "./PantallaCard";
import EstadisticaCard from "./EstadisticaCard";
import RegistrarPantallaModal from "./registrarPantallaModal";
import PantallaDetalleModal from "./PantallaDetalleModal";
import CambiarPresentacionModal from "./CambiarPresentacionModal";
import ConfirmarEliminacionDispositivoModal from "./ConfirmarEliminacionDispositivoModal";

import { isVerticalProjectionSede } from "@/app/proyectar/projection-config";

interface Props {
    sede: any;
    onClose: () => void;
    onActualizar: () => void;
}

type RoomKey = "VIP" | "SALA_1" | "SALA_2" | "SALA_3";

const SALAS_VALIDAS: RoomKey[] = [
    "SALA_1",
    "SALA_2",
    "SALA_3",
];

export default function AdministrarPantallasModal({
    sede,
    onClose,
    onActualizar,
}: Props) {
    const [showRegistrar, setShowRegistrar] = useState(false);

    const [pantallaDetalle, setPantallaDetalle] =
        useState<any | null>(null);

    const [pantallaPresentacion, setPantallaPresentacion] =
        useState<any | null>(null);

    const [pantallaParaEliminar, setPantallaParaEliminar] =
        useState<any | null>(null);
    const [eliminandoPantalla, setEliminandoPantalla] = useState(false);

    useEffect(() => {
        if (!sede?.id) return;

        const interval = window.setInterval(() => {
            onActualizar();
        }, 5000);

        return () => {
            window.clearInterval(interval);
        };
    }, [sede?.id, onActualizar]);

    const roomsDisponibles = useMemo<RoomKey[]>(() => {
        const rooms: RoomKey[] = [];

        if (sede?.salaVip) {
            rooms.push("VIP");
        }

        const numeroSalas = Math.min(
            Math.max(Number(sede?.numeroSalas ?? 0), 0),
            SALAS_VALIDAS.length
        );

        rooms.push(...SALAS_VALIDAS.slice(0, numeroSalas));

        return rooms;
    }, [sede?.salaVip, sede?.numeroSalas]);

    async function reiniciarPantalla(pantalla: any) {
        try {
            const response = await fetch(
                `/api/master/pantallas/${pantalla.id}/reiniciar`,
                {
                    method: "POST",
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                alert("No fue posible reiniciar la pantalla.");
                return;
            }

            alert("Solicitud de reinicio enviada.");
        } catch (error) {
            console.error("Error reiniciando pantalla:", error);
            alert("Error al reiniciar.");
        }
    }

    async function eliminarPantalla() {
        if (!pantallaParaEliminar) return;

        try {
            setEliminandoPantalla(true);
            const response = await fetch(
                `/api/master/pantallas/${pantallaParaEliminar.id}`,
                { method: "DELETE" }
            );
            const result = await response.json();

            if (!response.ok || !result.success) {
                alert(result.error ?? "No fue posible eliminar la pantalla.");
                return;
            }

            setPantallaParaEliminar(null);
            onActualizar();
        } catch (error) {
            console.error("Error eliminando pantalla:", error);
            alert("No fue posible eliminar la pantalla.");
        } finally {
            setEliminandoPantalla(false);
        }
    }

    const pantallas = sede?.pantallas ?? [];
    const presentaciones = sede?.presentaciones ?? [];
    const media = sede?.media ?? [];
    const obituarios = sede?.obituarios ?? [];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-6 backdrop-blur-md">
            <div className="w-full max-w-7xl overflow-visible rounded-3xl bg-white shadow-2xl">
                <div className="border-b px-8 py-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-3xl font-black">
                                {sede?.nombre}
                            </h2>

                            <p className="text-slate-500">
                                {sede?.ciudad} · {sede?.departamento}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowRegistrar(true)}
                                className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
                            >
                                + Registrar Pantalla
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Cerrar"
                                className="h-10 w-10 rounded-full transition hover:bg-slate-100"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-h-[calc(90vh-110px)] overflow-y-auto p-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <EstadisticaCard
                            titulo="Pantallas"
                            valor={pantallas.length}
                        />

                        <EstadisticaCard
                            titulo="Presentaciones"
                            valor={presentaciones.length}
                        />

                        <EstadisticaCard
                            titulo="Media"
                            valor={media.length}
                        />

                        <EstadisticaCard
                            titulo="Obituarios"
                            valor={obituarios.length}
                        />
                    </div>

                    <h3 className="mt-8 text-xl font-bold">
                        Pantallas registradas
                    </h3>

                    <div className="mt-4 space-y-4">
                        {pantallas.length > 0 ? (
                            pantallas.map((pantalla: any) => (
                                <PantallaCard
                                    key={pantalla.id}
                                    pantalla={pantalla}
                                    onVerDetalles={(pantalla) => {
                                        setPantallaDetalle(pantalla);
                                    }}
                                    onCambiarPresentacion={(pantalla) => {
                                        setPantallaPresentacion(pantalla);
                                    }}
                                    onReiniciar={reiniciarPantalla}
                                    onEliminar={setPantallaParaEliminar}
                                />
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
                                No hay pantallas registradas.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {pantallaDetalle && (
                <PantallaDetalleModal
                    pantalla={pantallaDetalle}
                    onClose={() => setPantallaDetalle(null)}
                />
            )}

            {pantallaPresentacion && (
                <CambiarPresentacionModal
                    open
                    pantalla={pantallaPresentacion}
                    rooms={roomsDisponibles}
                    permiteModoVertical={isVerticalProjectionSede(
                        sede?.nombre
                    )}
                    onClose={() => {
                        setPantallaPresentacion(null);
                    }}
                    onActualizada={() => {
                        onActualizar();
                        setPantallaPresentacion(null);
                    }}
                />
            )}

            <RegistrarPantallaModal
                open={showRegistrar}
                onClose={() => setShowRegistrar(false)}
                sedeId={sede?.id}
                onRegistrada={() => {
                    setShowRegistrar(false);
                    onActualizar();
                }}
            />

            <ConfirmarEliminacionDispositivoModal
                open={Boolean(pantallaParaEliminar)}
                tipo="pantalla"
                nombre={pantallaParaEliminar?.nombre ?? ""}
                loading={eliminandoPantalla}
                onCancel={() => setPantallaParaEliminar(null)}
                onConfirm={() => void eliminarPantalla()}
            />
        </div>
    );
}

// Codigo anterior, no borrar

// "use client";

// import PantallaCard from "./PantallaCard";
// import EstadisticaCard from "./EstadisticaCard";
// import { useEffect, useMemo, useState } from "react";
// import RegistrarPantallaModal from "./registrarPantallaModal";
// import PantallaDetalleModal from "./PantallaDetalleModal";
// import CambiarPresentacionModal from "./CambiarPresentacionModal";
// import { PresentationIcon } from "lucide-react";
// import { isVerticalProjectionSede } from "@/app/proyectar/projection-config";

// interface Props {
//     sede: any;
//     onClose:()=>void;
//     onActualizar: () => void;
//     //onCambiarPresentacion: () => void;
// }

// export default function AdministrarPantallasModal({
//     sede,
//     onClose,
//     onActualizar,
//     //onCambiarPresentacion,
// }:Props){

//     {/* Botones de PantallaCard */}

//     const [showRegistrar, setShowRegistrar] = useState(false);

//     const [pantallaDetalle, setPantallaDetalle] = useState<any | null>(null);

//     const [pantallaPresentacion, setPantallaPresentacion] = useState<any | null>(null);

//     const [menuAbierto, setMenuAbierto] = useState(false);

//     const [showCambiarPresentacion, setShowCambiarPresentacion] = useState(false);
    
//     useEffect(() => {
//         if (!pantallaPresentacion) return;

//         console.log("Cambiar presentacion");

//         console.log(pantallaPresentacion);
//     }, [pantallaPresentacion]);


    
//     useEffect(() => {
//         if (!sede?.id) return;

//         const interval = setInterval(() => {
//             onActualizar();
//         }, 5000);

//         return () => clearInterval(interval);
//     }, [sede.id, onActualizar]);
    
//     async function reiniciarPantalla(pantalla: any) {
//         try {
//             const response = await fetch(`/api/master/pantallas/${pantalla.id}/reiniciar`,
//                 { method: "POST" }
//             );

//             const result = await response.json();

//             if(!result.success) {alert("No fue posible reiniciar la pantalla.");
//                 return;
//             }

//             alert("Solicitud de reinicio enviada.");
            
//         } catch (error) {
//             console.error (error);
//             alert("Error al reiniciar.");
//         }
//     }

//     type RoomKey = "VIP" | "SALA_1" | "SALA_2" | "SALA_3";

//     const SALAS_VALIDAS: RoomKey[] = [
//         "SALA_1",
//         "SALA_2",
//         "SALA_3",
//     ];

//     const roomsDisponibles: RoomKey[] = [];

//     if (sede?.salaVip) {
//         roomsDisponibles.push("VIP");
//     }

//     const numeroSalas = Math.min(
//         Math.max(Number(sede?.numeroSalas ?? 0), 0),
//         SALAS_VALIDAS.length
//     );

//     roomsDisponibles.push(...SALAS_VALIDAS.slice(0, numeroSalas));

//     return(
//         <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
//             <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-visible">

//                 {/* Header */}
//                 <div className="border-b px-8 py-6">
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <h2 className="text-3xl font-black">{sede.nombre}</h2>

//                             <p className="text-slate-500">{sede.ciudad} · {sede.departamento}</p>
//                         </div>
                        
//                         <div className="flex items-center gap-3">
//                             <button
//                                 onClick={() => setShowRegistrar(true)}
//                                 className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition"
//                             >
//                                 + Registrar Pantalla
//                             </button>
                            
//                             <button
//                                 onClick={onClose}
//                                 className="w-10 h-10 rounded-full hover:bg-slate-100 transition"
//                             >
//                                 ✕
//                             </button>  
//                         </div>       
//                     </div>  
//                 </div>

//                 {/* Body */}
//                 <div className="p-8 max-h-[calc(90vh-110px)] overflow-y-auto">
//                     {/* Estadistica */}
//                     <div className="grid grid-cols-4 gap-4">
//                         <EstadisticaCard
//                             titulo="Pantallas"
//                             valor={sede.pantallas.length}
//                         />

//                         <EstadisticaCard
//                             titulo="Presentaciones"
//                             valor={sede.presentaciones.length}
//                         />

//                         <EstadisticaCard
//                             titulo="Media"
//                             valor={sede.media.length}
//                         />

//                         <EstadisticaCard
//                             titulo="Obituarios"
//                             valor={sede.obituarios.length}
//                         />
//                     </div>

//                     {/* Pantallas Registradas*/}
//                     <h3 className="text-xl font-bold">Pantallas registradas</h3>
//                     <div className="space-y-4">
//                         {sede.pantallas?.length > 0 ? (
//                             sede.pantallas.map((pantalla:any) => (

//                             <PantallaCard
//                                 key={pantalla.id}
                                
//                                 pantalla={pantalla}
//                                 onVerDetalles={(pantalla) => {
//                                     setPantallaDetalle(pantalla);
//                                 }}
//                                 onCambiarPresentacion={(pantalla) => {
//                                     console.log("Pantalla recibida en Administrar", pantalla);
//                                     setPantallaPresentacion(pantalla);
//                                 }}
//                                 // onVerDetalles={setPantallaDetalle}
//                                 // onCambiarPresentacion={setPantallaPresentacion}
//                                 onReiniciar={reiniciarPantalla}

//                             />
//                         ))
//                     ) : (
//                         <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
//                             No hay pantallas registradas.
//                         </div>
//                     )}
//                     </div>
                


              

//                 </div>
//             </div>
//             {pantallaDetalle && (
//                 <PantallaDetalleModal
//                     pantalla={pantallaDetalle}
//                     onClose={() => setPantallaDetalle(null)}
//                 />  
//             )}

//             {pantallaPresentacion && (
//                 <CambiarPresentacionModal
//                     open={true}
//                     pantalla={pantallaPresentacion}
//                     rooms={roomsDisponibles}
//                     permiteModoVertical={isVerticalProjectionSede(
//                         sede.nombre
//                     )}
//                     onClose={() => setPantallaPresentacion(null)}            
//                     onActualizada={() => { onActualizar(); setPantallaPresentacion(null);}}
//                 />
//             )}
            
//             <RegistrarPantallaModal
//                 open={showRegistrar}
//                 onClose={() => setShowRegistrar(false)}
//                 sedeId={sede.id}
//                 onRegistrada={() => {
//                     setShowRegistrar(false);

//                     onActualizar();
//                 }}
//             />
//         </div>  
//     )
// }
