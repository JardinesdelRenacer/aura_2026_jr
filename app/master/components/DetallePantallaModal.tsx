"use client";

interface Props {
    sede: any;
    onClose: () => void;
}

export default function DetallePantallaModal({
    sede,
    onClose,
}: Props) {

    const cliente = sede.pantallaCliente;

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

    const ultimaConexion = sede.lastSeen
        ? new Date(sede.lastSeen)
        : null;

    const transmitiendo =
        ultimaConexion &&
        Date.now() - ultimaConexion.getTime() < 15000;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">

            <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden">

                {/* HEADER */}

                <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center">

                    <div>

                        <h2 className="text-2xl font-black text-slate-800">
                            {sede.nombre}
                        </h2>

                        <p className="text-slate-500">
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

                <div className="grid grid-cols-2 gap-6 p-8">

                    {/* ESTADO */}

                    <div className="rounded-2xl border border-slate-200 p-6">

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

                        </div>

                    </div>

                    {/* PANTALLA */}

                    <div className="rounded-2xl border border-slate-200 p-6">

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

                    <div className="rounded-2xl border border-slate-200 p-6">

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

                    <div className="rounded-2xl border border-slate-200 p-6">

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
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">

            <span className="text-slate-500 text-sm">
                {titulo}
            </span>

            <span className="font-semibold text-slate-800 text-sm">
                {valor}
            </span>

        </div>
    );
}