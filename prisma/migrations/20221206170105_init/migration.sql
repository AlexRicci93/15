-- CreateTable
CREATE TABLE "Meals" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Meals_pkey" PRIMARY KEY ("id")
);
