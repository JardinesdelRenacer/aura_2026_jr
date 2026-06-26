import type { Obituary } from "./page";

interface Props {
    obituary: Obituary;
    formatDate: (date: string) => string;
    formatTime: (time?: string) => string;
}

export default function ObituarioVertical({ obituary, formatDate, formatTime }: Props) {
    const isActive = Boolean(obituary && (obituary.name || obituary.surname));

    return (
        <div className="relative flex h-full w-full flex-col items-center justify-start overflow-hidden rounded-[1.6rem] bg-[url('/imagenes/35.png')] bg-size-[100%_100%] bg-no-repeat p-5 text-center text-black sm:p-8">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-white/30 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-tr-full bg-white/30 blur-2xl" />

            <h2 className="z-10 mb-3 w-3/4 border-b border-black/20 pb-2 text-sm font-bold uppercase tracking-[0.2em] [text-shadow:0_1px_3px_rgb(255_255_255)] sm:text-lg">
                En memoria de
            </h2>

            {isActive ? (
                <div className="z-10 flex min-h-0 w-full grow flex-col items-center justify-center">
                    <h3 className="w-full truncate px-2 text-3xl font-extrabold [text-shadow:0_1px_3px_rgb(255_255_255)] sm:text-5xl">
                        {obituary.name}
                    </h3>
                    <h3 className="mb-3 w-full truncate px-2 text-2xl font-bold text-black/90 [text-shadow:0_1px_3px_rgb(255_255_255)] sm:text-4xl">
                        {obituary.surname}
                    </h3>

                    {(obituary.dob || obituary.dod) && (
                        <div className="mb-3 flex max-w-full items-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-black/10 bg-white/40 px-4 py-1.5 text-sm font-medium shadow-lg backdrop-blur-sm sm:text-lg">
                            {obituary.dob && <span>Nacimiento: {formatDate(obituary.dob)}</span>}
                            {obituary.dob && obituary.dod && <span className="text-black/50">|</span>}
                            {obituary.dod && <span>Fallecimiento: {formatDate(obituary.dod)}</span>}
                        </div>
                    )}

                    {(obituary.massTime || obituary.massChurch) && (
                        <div className="mb-3 flex w-[95%] flex-col items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white/40 px-4 py-2 shadow-lg backdrop-blur-sm">
                            <span className="text-xs font-bold uppercase tracking-widest text-black/80">Eucaristía</span>
                            <span className="w-full truncate px-2 text-base font-bold sm:text-xl">
                                {obituary.massChurch ? `${obituary.massChurchType || "Parroquia"}: ${obituary.massChurch}` : (obituary.massChurchType || "Parroquia")}
                                {obituary.massTime && ` - ${formatTime(obituary.massTime)}`}
                            </span>
                            {obituary.massAddress && (
                                <span className="w-full truncate px-2 text-sm font-medium text-black/80 sm:text-base">{obituary.massAddress}</span>
                            )}
                        </div>
                    )}

                    <div className="mt-auto grid w-full grid-cols-2 gap-3">
                        {(obituary.timeStart || obituary.timeEnd) && (
                            <div className="overflow-hidden rounded-xl border border-black/10 bg-white/30 p-3 shadow-lg backdrop-blur-md">
                                <p className="mb-1 truncate text-xs font-bold uppercase tracking-widest text-black/80">Horario</p>
                                <p className="truncate text-base font-bold sm:text-xl">
                                    {obituary.timeStart && formatTime(obituary.timeStart)}
                                    {obituary.timeStart && obituary.timeEnd && " - "}
                                    {obituary.timeEnd && formatTime(obituary.timeEnd)}
                                </p>
                            </div>
                        )}
                        {obituary.cemetery && (
                            <div className="overflow-hidden rounded-xl border border-black/10 bg-white/30 p-3 shadow-lg backdrop-blur-md">
                                <p className="mb-1 truncate text-xs font-bold uppercase tracking-widest text-black/80">Destino</p>
                                <p className="truncate text-base font-bold sm:text-xl" title={obituary.cemetery}>{obituary.cemetery}</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="z-10 flex grow items-center justify-center">
                    <p className="text-2xl font-bold uppercase tracking-widest text-black/40 [text-shadow:0_1px_3px_rgb(255_255_255)]">Sala disponible</p>
                </div>
            )}
        </div>
    );
}
