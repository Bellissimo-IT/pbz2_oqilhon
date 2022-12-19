-- CreateTable
CREATE TABLE "Corresponds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name_of_department" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "executorId" TEXT NOT NULL,
    CONSTRAINT "Corresponds_executorId_fkey" FOREIGN KEY ("executorId") REFERENCES "Executor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Executor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "must_be_finished_at" DATETIME NOT NULL,
    "finished_at" DATETIME,
    "correspond_id" TEXT NOT NULL,
    CONSTRAINT "Document_correspond_id_fkey" FOREIGN KEY ("correspond_id") REFERENCES "Corresponds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
