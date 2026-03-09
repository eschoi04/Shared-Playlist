-- CreateTable
CREATE TABLE `Room` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `expiresAt` DATETIME(6) NULL,

    UNIQUE INDEX `Room_publicId_key`(`publicId`),
    INDEX `Room_publicId_idx`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `roomId` BIGINT NOT NULL,

    INDEX `User_roomId_name_idx`(`roomId`, `name`),
    UNIQUE INDEX `User_roomId_name_key`(`roomId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Track` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(150) NOT NULL,
    `author` VARCHAR(150) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `dislike` INTEGER NOT NULL DEFAULT 0,
    `addedBy` BIGINT NOT NULL,
    `roomId` BIGINT NOT NULL,

    INDEX `Track_roomId_addedBy_idx`(`roomId`, `addedBy`),
    INDEX `Track_roomId_title_idx`(`roomId`, `title`),
    UNIQUE INDEX `Track_roomId_title_key`(`roomId`, `title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Track` ADD CONSTRAINT `Track_addedBy_fkey` FOREIGN KEY (`addedBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Track` ADD CONSTRAINT `Track_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
