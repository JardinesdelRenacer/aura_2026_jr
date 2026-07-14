export default function Header() {
    return (
        <header className="flex flex-col items-center justify-center py-10">
            
            {/* Logo*/}
            <div className="mb-6">
                <img src="/260e7f84e69d90b3f08d857ce52cf175.png" alt="Jardines del Renacer" className="h-20 object-contain"/>
            </div>


            <h1 className="text-5xl font-bold tracking-tight text-slate-800">
                Jardines del Renacer
            </h1>

            <h2 className="mt-2 text-2xl font-light traking-wide text-blue-700">
                Condolencias Digitales
            </h2>

            <p className="mt-4 max-w-3xl text-center text-lg text-slate-500 leading-relaxed">
                Acompaña a la familia con un mensaje de apoyo y solidaridad que permacenerá como un recuerdo especial.
            </p>


            <div className="mt-6 mb-8 h-px bg-gradient-to-r from-blue-200 via-slate-200 to-transparent"/>
        </header>

    );
}