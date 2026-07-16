import Image from "next/image";

export default function Header() {
    return (
        <header className="flex flex-col items-center justify-center py-8">
            
            {/* Logo*/}
            <div className="mb-8">
                <Image src="/imagenes/logo_jr.png" alt="Jardines del Renacer" width={120} height={120} className="object-contain"/>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-slate-800">
                Jardines del Renacer
            </h1>

            <h2 className="mt-3 text-xl uppercase tracking-[0.25em] font-semibold text-blue-700">
                Condolencias Digitales
            </h2>

            <p className="mt-4 max-w-2xl text-center text-lg leading-relaxed text-slate-500">
                Acompaña a la familia con un mensaje de apoyo y solidaridad que permanecerá como un recuerdo especial.
            </p>

            <div className="mt-8 w-80 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />

        </header>

    );
}