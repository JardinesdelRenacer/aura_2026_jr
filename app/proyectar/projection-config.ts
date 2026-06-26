// Solo hay dos sedes habilitadas. Las entradas de Parque son alias del mismo lugar.
// Para habilitar otra sede en el futuro, agrega aquí el nombre guardado en la base de datos.
const VERTICAL_PROJECTION_SEDE_NAMES = [
    "Zaragoza",
    "Cartago",
    "Parque Conmemorativo",
    "Parque Conmemorativo Cartago",
    "Parque Conmemorativo de Cartago",
] as const;

function normalizeSedeName(name: string) {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, " ")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
}

const VERTICAL_PROJECTION_SEDES = new Set(
    VERTICAL_PROJECTION_SEDE_NAMES.map(normalizeSedeName),
);

export function isVerticalProjectionSede(name?: string | null) {
    return Boolean(name && VERTICAL_PROJECTION_SEDES.has(normalizeSedeName(name)));
}
