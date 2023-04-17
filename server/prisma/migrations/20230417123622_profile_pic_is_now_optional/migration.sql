-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_pic" TEXT
);
INSERT INTO "new_users" ("id", "name", "password", "profile_pic", "username") SELECT "id", "name", "password", "profile_pic", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
