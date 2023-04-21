/*
  Warnings:

  - Added the required column `subject_author_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_user_id_fkey`;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `subject_author_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_subject_author_id_fkey` FOREIGN KEY (`subject_author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
