-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nombres` VARCHAR(191) NULL,
    `apellidos` VARCHAR(191) NULL,
    `cedula` VARCHAR(191) NULL,
    `telefono` VARCHAR(191) NULL,
    `departamento` VARCHAR(191) NULL,
    `ciudad` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NULL DEFAULT 'ACTIVO',
    `lastSeen` DATETIME(3) NULL,
    `role` ENUM('SUPER_MASTER', 'MASTER', 'ADMIN') NOT NULL DEFAULT 'ADMIN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sede` (
    `id` VARCHAR(191) NOT NULL,
    `departamento` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `estado` ENUM('ACTIVA', 'INACTIVA') NOT NULL DEFAULT 'INACTIVA',
    `numeroSalas` INTEGER NOT NULL DEFAULT 1,
    `salaVip` BOOLEAN NOT NULL DEFAULT false,
    `adminId` VARCHAR(191) NULL,
    `lastSeen` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Sede_adminId_key`(`adminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Obituario` (
    `id` VARCHAR(191) NOT NULL,
    `sedeId` VARCHAR(191) NOT NULL,
    `sala` VARCHAR(191) NOT NULL,
    `estado` ENUM('ACTIVO', 'FINALIZADO', 'ARCHIVADO') NOT NULL DEFAULT 'ACTIVO',
    `name` VARCHAR(191) NOT NULL,
    `surname` VARCHAR(191) NOT NULL,
    `dob` VARCHAR(191) NULL,
    `dod` VARCHAR(191) NULL,
    `timeStart` VARCHAR(191) NULL,
    `timeEnd` VARCHAR(191) NULL,
    `cemetery` VARCHAR(191) NULL,
    `endTime` VARCHAR(191) NULL,
    `endDate` VARCHAR(191) NULL,
    `massTime` VARCHAR(191) NULL,
    `massChurch` VARCHAR(191) NULL,
    `massChurchType` VARCHAR(191) NULL DEFAULT 'Parroquia',
    `massAddress` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Obituario_sedeId_sala_key`(`sedeId`, `sala`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Condolencia` (
    `id` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(191) NULL,
    `obituarioId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `documentType` VARCHAR(191) NOT NULL,
    `documentNumber` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `estado` ENUM('PENDIENTE', 'ENTREGADA', 'ARCHIVADA') NOT NULL DEFAULT 'PENDIENTE',
    `pdfGenerado` BOOLEAN NOT NULL DEFAULT false,
    `enviadoAt` DATETIME(3) NULL,
    `observaciones` TEXT NULL,
    `acceptedPrivacyPolicy` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Condolencia_codigo_key`(`codigo`),
    INDEX `Condolencia_obituarioId_idx`(`obituarioId`),
    INDEX `Condolencia_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConfiguracionPantalla` (
    `id` VARCHAR(191) NOT NULL,
    `sedeId` VARCHAR(191) NOT NULL,
    `autoPlay` BOOLEAN NOT NULL DEFAULT true,
    `seconds` INTEGER NOT NULL DEFAULT 10,
    `transitionEffect` VARCHAR(191) NOT NULL DEFAULT 'fade',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ConfiguracionPantalla_sedeId_key`(`sedeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Media` (
    `id` VARCHAR(191) NOT NULL,
    `sedeId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `orden` INTEGER NOT NULL,
    `room` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Presentacion` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `projectionMode` VARCHAR(191) NOT NULL DEFAULT 'classic',
    `selectedImage` INTEGER NOT NULL DEFAULT 0,
    `roomsToShow` JSON NULL,
    `obituaries` JSON NULL,
    `sedeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PantallaCliente` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `verticalRoom` VARCHAR(191) NULL,
    `online` BOOLEAN NOT NULL DEFAULT false,
    `estado` ENUM('OFFLINE', 'ONLINE', 'MANTENIMIENTO', 'ERROR') NOT NULL DEFAULT 'OFFLINE',
    `reiniciar` BOOLEAN NOT NULL DEFAULT false,
    `lastSeen` DATETIME(3) NULL,
    `sedeId` VARCHAR(191) NOT NULL,
    `presentacionId` VARCHAR(191) NULL,
    `screenWidth` INTEGER NULL,
    `screenHeight` INTEGER NULL,
    `viewportWidth` INTEGER NULL,
    `viewportHeight` INTEGER NULL,
    `ip` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `language` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PantallaCliente_token_key`(`token`),
    INDEX `PantallaCliente_sedeId_idx`(`sedeId`),
    INDEX `PantallaCliente_estado_idx`(`estado`),
    INDEX `PantallaCliente_online_idx`(`online`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuraTouch` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `lastSeen` DATETIME(3) NULL,
    `sedeId` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AuraTouch_token_key`(`token`),
    INDEX `AuraTouch_sedeId_idx`(`sedeId`),
    INDEX `AuraTouch_activo_idx`(`activo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CodigoRegistro` (
    `id` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `pantallaNombre` VARCHAR(191) NULL,
    `sedeId` VARCHAR(191) NOT NULL,
    `tipoDispositivo` ENUM('PANTALLA', 'AURA_TOUCH') NOT NULL DEFAULT 'PANTALLA',
    `usado` BOOLEAN NOT NULL DEFAULT false,
    `expiresAt` DATETIME(3) NOT NULL,
    `utilizadoAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CodigoRegistro_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrasladoObituario` (
    `id` VARCHAR(191) NOT NULL,
    `sedeId` VARCHAR(191) NOT NULL,
    `obituarioNombre` VARCHAR(191) NOT NULL,
    `salaOrigen` VARCHAR(191) NOT NULL,
    `salaDestino` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NULL,
    `usuarioEmail` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'COMPLETADO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TrasladoObituario_sedeId_idx`(`sedeId`),
    INDEX `TrasladoObituario_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConfiguracionGlobal` (
    `id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `companyPhone` VARCHAR(191) NULL,
    `companyEmail` VARCHAR(191) NULL,
    `companyWebsite` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,
    `primaryColor` VARCHAR(191) NOT NULL DEFAULT '#2563EB',
    `secondaryColor` VARCHAR(191) NOT NULL DEFAULT '#0F172A',
    `autoplay` BOOLEAN NOT NULL DEFAULT true,
    `seconds` INTEGER NOT NULL DEFAULT 10,
    `transitionEffect` VARCHAR(191) NOT NULL DEFAULT 'fade',
    `auraTouchTimeout` INTEGER NOT NULL DEFAULT 90,
    `keyboardEnabled` BOOLEAN NOT NULL DEFAULT true,
    `refreshInterval` INTEGER NOT NULL DEFAULT 5,
    `maintenanceMode` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sede` ADD CONSTRAINT `Sede_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Obituario` ADD CONSTRAINT `Obituario_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `Sede`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Condolencia` ADD CONSTRAINT `Condolencia_obituarioId_fkey` FOREIGN KEY (`obituarioId`) REFERENCES `Obituario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfiguracionPantalla` ADD CONSTRAINT `ConfiguracionPantalla_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `Sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `Sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presentacion` ADD CONSTRAINT `Presentacion_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `Sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PantallaCliente` ADD CONSTRAINT `PantallaCliente_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `Sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PantallaCliente` ADD CONSTRAINT `PantallaCliente_presentacionId_fkey` FOREIGN KEY (`presentacionId`) REFERENCES `Presentacion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuraTouch` ADD CONSTRAINT `AuraTouch_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `Sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CodigoRegistro` ADD CONSTRAINT `CodigoRegistro_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `Sede`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrasladoObituario` ADD CONSTRAINT `TrasladoObituario_sedeId_fkey` FOREIGN KEY (`sedeId`) REFERENCES `Sede`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
