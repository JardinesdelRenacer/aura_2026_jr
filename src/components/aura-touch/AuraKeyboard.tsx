"use client";

interface AuraKeyboardProps {
    visible: boolean;
    onKeyPress: (key: string) => void;
    onBackspace: () => void;
    onSpace: () => void;
    onClose: () => void;
}

const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "@"],
    ["Z", "X", "C", "V", "B", "N", "M", "."],
];

export function AuraKeyboard({
    visible,
    onKeyPress,
    onBackspace,
    onSpace,
    onClose,
}: AuraKeyboardProps) {
    if (!visible) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-slate-200 bg-white/95 p-4 shadow-[0_-10px_40px_rgba(15,23,42,0,15)]">
            <div className="mx-auto max-w-5xl">

                {/* encabezado */}
                <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Teclado Aura Touch</span>
                
                    <button type="button" onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200">
                        Cerrar
                    </button>
                </div>

                {/* Letras */}
                <div className="space-y-2">
                    {rows.map((row, index) => (
                        <div key={index} className="flex justify-center gap-2">
                            {row.map((key) => (
                                <button key={key} type="button" onClick={() => onKeyPress(key)} className="flex h-14 min-w-14 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-lg font-bold text-slate-700 shadow-sm transition active:scale-95 active:bg-blue-100">
                                    {key}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>


                {/* Controles */}
                <div className="mt-3 flex justify-center gap-2">
                    {/* <button type="button" onClick={onBackspace} className="h-14 rounded-xl bg-slate-100 px-8 font-bold text-slate-700 active:scale-95">
                        ⌫
                    </button> */}
                    
                    <button type="button" onClick={onSpace} className="h-14 flex-1 rounded-xl bg-slate-100 px-8 font-bold text-slate-700 active:scale-95">
                        Espacio
                    </button>

                    <button type="button" onClick={onClose} className="h-14 rounded-xl bg-slate-600 px-8 font-bold text-slate-700 active:scale-95">
                        Listo
                    </button>

                    <button type="button" onClick={onBackspace} className="h-14 rounded-xl bg-slate-100 px-8 font-bold text-slate-700 active:scale-95">
                        ⌫
                    </button>

                    
                </div>
            </div>
        </div>
    );
}