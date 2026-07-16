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
        <div className="flex flex-col items-center gap-3">
            <button type="button" onClick={onClick} disabled={isDisabled} className={` group flex items-center justify-center gap-3 px-20 py-6 rounded-3xl text-2xl font-bold transition-all duration-300 transform ${isDisabled ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-xk shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:translate-y-1 active:scale-95 cursor-pointer"}`} >
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
                    <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-l" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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