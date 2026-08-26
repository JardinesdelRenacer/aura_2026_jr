-- Fecha independiente de la Eucaristía. Es texto ISO (YYYY-MM-DD), igual a
-- las demás fechas operativas del obituario para no introducir conversiones de
-- zona horaria al proyectar en Colombia.
ALTER TABLE `Obituario`
  ADD COLUMN `massDate` VARCHAR(191) NULL;
