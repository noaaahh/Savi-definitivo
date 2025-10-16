-- CreateTable
CREATE TABLE `calificacion` (
    `calificacion_id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `puntuacion` DOUBLE NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `calificacion_usuario_id_empresa_id_key`(`usuario_id`, `empresa_id`),
    PRIMARY KEY (`calificacion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `calificacion` ADD CONSTRAINT `calificacion_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calificacion` ADD CONSTRAINT `calificacion_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`empresa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
