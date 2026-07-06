"use client";

interface Props{

    titulo: string;
    valor: number|string;
    color?: keyof typeof colors;
}

const colors = {
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    red: "text-red-600",
};

export default function EstadisticaCard({
    titulo,
    valor,
    color
}:Props){
    return(
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{titulo}</p>

            <h2 className={`text-3xl font-black mt-2 ${colors[color ?? "blue"]}`}>{valor}</h2>
        </div>
    )
}