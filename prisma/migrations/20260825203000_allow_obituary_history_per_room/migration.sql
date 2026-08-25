-- Un mismo espacio puede albergar varios servicios a lo largo del tiempo.
-- Conservamos el historial y sólo consultamos el servicio ACTIVO más reciente.
CREATE INDEX `Obituario_sedeId_sala_idx` ON `Obituario`(`sedeId`, `sala`);
DROP INDEX `Obituario_sedeId_sala_key` ON `Obituario`;
CREATE INDEX `Obituario_estado_idx` ON `Obituario`(`estado`);
