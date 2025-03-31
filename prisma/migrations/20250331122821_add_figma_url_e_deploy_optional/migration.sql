-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "figmaUrl" TEXT,
ALTER COLUMN "deployUrl" DROP NOT NULL;
