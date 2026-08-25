-- MySQL creó estos índices al registrar las llaves foráneas base.
-- Se renombran para que coincidan con el esquema Prisma actual.
ALTER TABLE `CodigoRegistro`
    RENAME INDEX `CodigoRegistro_sedeId_fkey` TO `CodigoRegistro_sedeId_idx`;

ALTER TABLE `Media`
    RENAME INDEX `Media_sedeId_fkey` TO `Media_sedeId_idx`;

ALTER TABLE `PantallaCliente`
    RENAME INDEX `PantallaCliente_presentacionId_fkey` TO `PantallaCliente_presentacionId_idx`;

ALTER TABLE `Presentacion`
    RENAME INDEX `Presentacion_sedeId_fkey` TO `Presentacion_sedeId_idx`;
