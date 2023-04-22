-- AlterTable
ALTER TABLE `notifications` MODIFY `action` ENUM('MAKE_A_BID_ON_POST', 'POST_HAS_FINISHED') NOT NULL;
