/*
  Warnings:

  - Added the required column `coverImage` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "preface" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isPublish" BOOLEAN NOT NULL,
    "slug" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("body", "createdAt", "id", "isPublish", "preface", "slug", "title", "updatedAt", "userId") SELECT "body", "createdAt", "id", "isPublish", "preface", "slug", "title", "updatedAt", "userId" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
