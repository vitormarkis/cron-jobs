-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_pic" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
