/*
  Warnings:

  - You are about to drop the `contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `contact`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `usuario` (
    `usuario_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `contraseña` VARCHAR(191) NOT NULL,
    `publicado` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `usuario_email_key`(`email`),
    PRIMARY KEY (`usuario_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresa` (
    `empresa_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `contraseña` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `direccion` VARCHAR(191) NULL,
    `contacto` VARCHAR(191) NULL,
    `horario` VARCHAR(191) NULL,
    `publicado` BOOLEAN NOT NULL DEFAULT false,
    `accesibilidad` VARCHAR(191) NULL,

    UNIQUE INDEX `empresa_email_key`(`email`),
    PRIMARY KEY (`empresa_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accesibilidad` (
    `accesibilidad_id` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `pasillos_min_90cm` BOOLEAN NOT NULL DEFAULT false,
    `rampa` BOOLEAN NOT NULL DEFAULT false,
    `puerta_80cm` BOOLEAN NOT NULL DEFAULT false,
    `pisos_antideslizantes` BOOLEAN NOT NULL DEFAULT false,
    `bano_accesible` BOOLEAN NOT NULL DEFAULT false,
    `mesas_sillas_adaptadas` BOOLEAN NOT NULL DEFAULT false,
    `ascensor` BOOLEAN NOT NULL DEFAULT false,
    `senalizacion_braille` BOOLEAN NOT NULL DEFAULT false,
    `contraste_colores` BOOLEAN NOT NULL DEFAULT false,
    `guias_podotactiles` BOOLEAN NOT NULL DEFAULT false,
    `alarmas_emergencia` BOOLEAN NOT NULL DEFAULT false,
    `sistema_audifonos` BOOLEAN NOT NULL DEFAULT false,
    `bano_adaptado_cantidad` VARCHAR(191) NULL,
    `bano_adaptado_detalles` VARCHAR(191) NULL,
    `atencion_prioritaria_tipo` VARCHAR(191) NULL,
    `atencion_prioritaria_horario` VARCHAR(191) NULL,
    `otros_servicios` VARCHAR(191) NULL,

    PRIMARY KEY (`accesibilidad_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accesibilidad` ADD CONSTRAINT `accesibilidad_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`empresa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
