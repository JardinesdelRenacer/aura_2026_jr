interface SubmitButtonProps{
    disabled: boolean;
    loading?: boolean;
    onClick?: () => void;
}

export default function SubmitButton({
    disabled,
    loading = false,
    onClick,
}: SubmitButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <div className="flex w-full max-w-xl flex-col items-center gap-3">
            <button type="button" onClick={onClick} disabled={isDisabled} className={`group flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-center text-lg font-bold transition-all duration-300 sm:rounded-3xl sm:px-10 sm:py-5 sm:text-xl ${isDisabled ? "cursor-not-allowed bg-slate-300 text-slate-500 shadow-none" : "cursor-pointer bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-xl shadow-blue-500/25 hover:-translate-y-1 hover:shadow-blue-500/40 active:scale-[0.98]"}`} >
                {/* Spinner */}
                {loading && (
                    <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                        <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                )}

                {/* text */}
                <span>
                    {loading ? "Enviado mensaje..." : disabled ? "Complete la información requerida" : "Enviar Condolencia"} 
                </span>

                {/* Flecha */}
                {!loading && !disabled && (
                    <svg className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-5-5 5 5-5 5" />
                    </svg>
                )}
            </button>

            {/* Mensaje inferior */}
            <p className="text-sm text-slate-400">
                {loading ? "Estamos registrando su mensaje..." : "Su mensaje será enviado de forma segura."}
            </p>
        </div>        
       
    );
}
