export const MIN_SALAS = 1;
export const MAX_SALAS = 10;

export type RoomKey = string;

export function getRooms(numeroSalas: number, salaVip = false): RoomKey[] {
    const total = Math.min(Math.max(Number(numeroSalas) || 0, 0), MAX_SALAS);
    const rooms = Array.from({ length: total }, (_, index) => `SALA_${index + 1}`);

    return salaVip ? ["VIP", ...rooms] : rooms;
}

export function isRoomEnabled(
    room: unknown,
    numeroSalas: number,
    salaVip = false
): room is RoomKey {
    return typeof room === "string" && getRooms(numeroSalas, salaVip).includes(room);
}

export function roomLabel(room: string): string {
    return room === "VIP" ? "Sala VIP" : room.replace("_", " ");
}
