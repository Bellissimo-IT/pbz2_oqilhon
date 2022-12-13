-- CreateTable
CREATE TABLE "Executor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name_of_department" TEXT NOT NULL,
    "name_of_executor" TEXT NOT NULL,
    "position" TEXT NOT NULL,
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
    "executor_id" TEXT NOT NULL,
    CONSTRAINT "Document_executor_id_fkey" FOREIGN KEY ("executor_id") REFERENCES "Executor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
