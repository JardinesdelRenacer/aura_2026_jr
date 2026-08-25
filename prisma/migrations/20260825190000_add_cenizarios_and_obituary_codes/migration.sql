-- Agrega código público opcional a los obituarios existentes.
-- MySQL permite múltiples valores NULL en un índice UNIQUE, por lo que
-- los registros históricos quedan intactos hasta que reciban un código.
ALTER TABLE `Obituario` ADD COLUMN `codigo` VARCHAR(191) NULL;
CREATE UNIQUE INDEX `Obituario_codigo_key` ON `Obituario`(`codigo`);

-- Registro de cenizarios por sede.
CREATE TABLE `Cenizario` (
    `id` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `nombreCompleto` VARCHAR(191) NOT NULL,
    `documento` VARCHAR(191) NOT NULL,
    `fechaNacimiento` VARCHAR(191) NULL,
    `fechaFallecimiento` VARCHAR(191) NULL,
    `mensajeFamiliar` TEXT NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'ACTIVO',
    `sedeId` VARCHAR(191) NOT NULL,
    `creadoPorId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Cenizario_publicId_key`(`publicId`),
    INDEX `Cenizario_sedeId_idx`(`sedeId`),
    INDEX `Cenizario_documento_idx`(`documento`),
    INDEX `Cenizario_estado_idx`(`estado`),
    INDEX `Cenizario_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Galería ordenable de fotos por cenizario.
CREATE TABLE `CenizarioFoto` (
    `id` VARCHAR(191) NOT NULL,
    `cenizarioId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CenizarioFoto_cenizarioId_idx`(`cenizarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Cenizario`
    ADD CONSTRAINT `Cenizario_sedeId_fkey`
    FOREIGN KEY (`sedeId`) REFERENCES `Sede`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Cenizario`
    ADD CONSTRAINT `Cenizario_creadoPorId_fkey`
    FOREIGN KEY (`creadoPorId`) REFERENCES `User`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `CenizarioFoto`
    ADD CONSTRAINT `CenizarioFoto_cenizarioId_fkey`
    FOREIGN KEY (`cenizarioId`) REFERENCES `Cenizario`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;
