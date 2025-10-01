/*
  Warnings:

  - You are about to drop the column `contrasenia` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `contrasena` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "puntos" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Usuario" ("correo", "id_usuario", "nombre", "puntos") SELECT "correo", "id_usuario", "nombre", "puntos" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
