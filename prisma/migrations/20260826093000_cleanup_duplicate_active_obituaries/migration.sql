-- Versiones anteriores podían dejar varios servicios activos en una misma sala
-- mientras se escribía el nombre. Conservamos sólo el último actualizado.
UPDATE `Obituario` AS `objetivo`
JOIN (
    SELECT `id`
    FROM (
        SELECT
            `id`,
            ROW_NUMBER() OVER (
                PARTITION BY `sedeId`, `sala`
                ORDER BY `updatedAt` DESC, `createdAt` DESC, `id` DESC
            ) AS `posicion`
        FROM `Obituario`
        WHERE `estado` = 'ACTIVO'
          AND (`name` <> '' OR `surname` <> '')
    ) AS `clasificados`
    WHERE `posicion` > 1
) AS `duplicados`
    ON `duplicados`.`id` = `objetivo`.`id`
SET `objetivo`.`estado` = 'FINALIZADO';
