// Aura opera en Colombia. Las fechas y horas del formulario no incluyen zona
// horaria, por lo que se interpretan siempre como America/Bogota (UTC-5).
export const AURA_TIME_ZONE = "America/Bogota";

type DateParts = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
};

function getColombiaDateParts(now: Date): DateParts {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: AURA_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(now);

    const value = (type: Intl.DateTimeFormatPartTypes) =>
        Number(parts.find((part) => part.type === type)?.value);

    return {
        year: value("year"),
        month: value("month"),
        day: value("day"),
        hour: value("hour"),
        minute: value("minute"),
    };
}

function isAfterOrEqual(left: DateParts, right: DateParts) {
    const comparable = (date: DateParts) =>
        date.year * 100_000_000 +
        date.month * 1_000_000 +
        date.day * 10_000 +
        date.hour * 100 +
        date.minute;

    return comparable(left) >= comparable(right);
}

// Determina si un obituario ya superó su fecha y hora configurada de ocultamiento.

export function isObituaryExpired(
    endTime?: string | null,
    endDate?: string | null,
    now: Date = new Date()
): boolean {

    // Si el obituario no tiene fecha de ocultamiento, el obituario permanecera en pantalla
    if (!endTime) {
        return false;
    }

    const [hours, minutes] = endTime
        .split(":")
        .map(Number);
    
    // Validación de horas inválidas
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return false;
    }

    const colombiaNow = getColombiaDateParts(now);
    let year = colombiaNow.year;
    let month = colombiaNow.month;
    let day = colombiaNow.day;

    // Si existe fecha de ocultamiento, se utiliza
    if (endDate) {
        const [dateYear, dateMonth, dateDay] = endDate
            .split("-")
            .map(Number);
        
        if (!Number.isNaN(dateYear) && !Number.isNaN(dateMonth) && !Number.isNaN(dateDay)) {
            year = dateYear;
            month = dateMonth;
            day = dateDay;
        }
    }

    return isAfterOrEqual(colombiaNow, {
        year,
        month,
        day,
        hour: hours,
        minute: minutes,
    });
}

// Determina si un obituario puede mostrarse a recibir condolencia
export function isObituaryAvailable(
    obituary: {
        name?: string | null;
        surname?: string | null;
        endTime?: string | null;
        endDate?: string | null;
    },
    now: Date = new Date()
): boolean {

    const hasPerson = Boolean(obituary.name?.trim() || obituary.surname?.trim());
    
    if (!hasPerson) {
        return false;
    }

    return !isObituaryExpired(obituary.endTime, obituary.endDate, now);
}
