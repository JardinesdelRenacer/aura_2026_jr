// Determina si un obituario ya superá su fecha y hora configurada de ocultamiento

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

    const expirationDate = new Date(now);

    // Si existe fecha de ocultamiento, se utiliza
    if (endDate) {
        const [year, month, day] = endDate
            .split("-")
            .map(Number);
        
        if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
            expirationDate.setFullYear(year, month - 1, day);
        }
    }

    expirationDate.setHours(hours, minutes, 0, 0);

    return now >= expirationDate;
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
