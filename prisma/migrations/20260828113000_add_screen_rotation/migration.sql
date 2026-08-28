-- Configuración por dispositivo. No altera la presentación ni las vistas
-- previas: únicamente la pantalla física registrada consume este valor.
ALTER TABLE `PantallaCliente`
  ADD COLUMN `screenRotation` VARCHAR(191) NOT NULL DEFAULT '0';
