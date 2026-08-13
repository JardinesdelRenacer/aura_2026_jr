"use client";

interface Props {
    sede: any;
    onClose: () => void;
}

export default function DetallePantallaModal({
    sede,
    onClose,
}: Props) {

    const cliente = sede.pantallas?.find((pantalla: any) => {
        if (!pantalla.lastSeen) return false;
        return Date.now() - new Date(pantalla.lastSeen).getTime() < 15000;
    }) ?? sede.pantallas?.[0];

    const navegador =
        cliente?.userAgent?.includes("Chrome")
            ? "Google Chrome"
            : cliente?.userAgent?.includes("Firefox")
            ? "Mozilla Firefox"
            : cliente?.userAgent?.includes("Edg")
            ? "Microsoft Edge"
            : cliente?.userAgent?.includes("Safari")
            ? "Safari"
            : "Desconocido";

    const ultimaConexion = cliente?.lastSeen
        ? new Date(cliente.lastSeen)
        : null;

    const transmitiendo =
        ultimaConexion &&
        Date.now() - ultimaConexion.getTime() < 15000;
    const tabletasEnLinea = (sede.auraTouches ?? []).filter((tableta: any) =>
        tableta.activo &&
        tableta.lastSeen &&
        Date.now() - new Date(tableta.lastSeen).getTime() < 15000
    );

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 backdrop-blur-md sm:p-6">

            <div className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

                {/* HEADER */}

                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-8 sm:py-6">

                    <div>

                        <h2 className="text-xl font-black text-slate-800 sm:text-2xl">
                            {sede.nombre}
                        </h2>

                        <p className="text-sm text-slate-500 sm:text-base">
                            Información técnica de la pantalla
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-slate-100 transition"
                    >
                        ✕
                    </button>

                </div>

                {/* BODY */}

                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:gap-6 sm:p-8">

                    {/* ESTADO */}

                    <div className="rounded-2xl border border-slate-200 p-5 sm:p-6">

                        <h3 className="font-bold text-slate-800 mb-5">
                            Estado General
                        </h3>

                        <div className="space-y-3">

                            <Item
                                titulo="Estado"
                                valor={
                                    transmitiendo
                                        ? "🟢 Transmitiendo"
                                        : "🔴 Offline"
                                }
                            />

                            <Item
                                titulo="Administrador"
                                valor={
                                    sede.admin
                                        ? `${sede.admin.nombres} ${sede.admin.apellidos}`
                                        : "Sin administrador"
                                }
                            />

                            <Item
                                titulo="Departamento"
                                valor={sede.departamento}
                            />

                            <Item
                                titulo="Ciudad"
                                valor={sede.ciudad}
                            />

                            <Item
                                titulo="Aura Touch"
                                valor={tabletasEnLinea.length > 0 ? `${tabletasEnLinea.length} tableta(s) en línea` : "Sin tabletas en línea"}
                            />

                        </div>

                    </div>

                    {/* PANTALLA */}

                    <div className="rounded-2xl border border-slate-200 p-5 sm:p-6">

                        <h3 className="font-bold text-slate-800 mb-5">
                            Pantalla
                        </h3>

                        <div className="space-y-3">

                            <Item
                                titulo="Resolución"
                                valor={`${cliente?.screenWidth ?? "-"} × ${cliente?.screenHeight ?? "-"}`}
                            />

                            <Item
                                titulo="Viewport"
                                valor={`${cliente?.viewportWidth ?? "-"} × ${cliente?.viewportHeight ?? "-"}`}
                            />

                            <Item
                                titulo="Idioma"
                                valor={cliente?.language ?? "-"}
                            />

                            <Item
                                titulo="Navegador"
                                valor={navegador}
                            />

                            <Item
                                titulo="Conectado"
                                valor={
                                    cliente?.online
                                        ? "Sí"
                                        : "No"
                                }
                            />

                        </div>

                    </div>

                    {/* PRESENTACIÓN */}

                    <div className="rounded-2xl border border-slate-200 p-5 sm:p-6">

                        <h3 className="font-bold text-slate-800 mb-5">
                            Presentación
                        </h3>

                        <div className="space-y-3">

                            <Item
                                titulo="Presentaciones"
                                valor={sede.presentaciones?.length ?? 0}
                            />

                            <Item
                                titulo="Multimedia"
                                valor={sede.media?.length ?? 0}
                            />

                            <Item
                                titulo="Obituarios"
                                valor={sede.obituarios?.length ?? 0}
                            />

                            <Item
                                titulo="Modo"
                                valor={
                                    sede.presentaciones?.[0]?.projectionMode ??
                                    "-"
                                }
                            />

                        </div>

                    </div>

                    {/* HEARTBEAT */}

                    <div className="rounded-2xl border border-slate-200 p-5 sm:p-6">

                        <h3 className="font-bold text-slate-800 mb-5">
                            Heartbeat
                        </h3>

                        <div className="space-y-3">

                            <Item
                                titulo="Última conexión"
                                valor={
                                    ultimaConexion
                                        ? ultimaConexion.toLocaleString()
                                        : "-"
                                }
                            />

                            <Item
                                titulo="Última actualización"
                                valor={
                                    cliente?.updatedAt
                                        ? new Date(
                                              cliente.updatedAt
                                          ).toLocaleString()
                                        : "-"
                                }
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

interface ItemProps {
    titulo: string;
    valor: any;
}

function Item({
    titulo,
    valor,
}: ItemProps) {
    return (
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2">

            <span className="min-w-0 text-sm text-slate-500">
                {titulo}
            </span>

            <span className="max-w-[58%] break-words text-right text-sm font-semibold text-slate-800">
                {valor}
            </span>

        </div>
    );
}
