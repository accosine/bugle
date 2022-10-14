-- CreateEnum
CREATE TYPE "Template" AS ENUM ('fill', 'vertical', 'horizontal', 'thirds');

-- CreateEnum
CREATE TYPE "GridArea" AS ENUM ('middleThird', 'lowerThird', 'upperThird');

-- CreateTable
CREATE TABLE "AmpStoryData" (
    "id" SERIAL NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "slugOriginal" TEXT NOT NULL,
    "slugBase64" TEXT NOT NULL,
    "backgroundAudio" TEXT,
    "dataPollInterval" INTEGER,
    "entity" TEXT,
    "entityLogoSrc" TEXT,
    "entityUrl" TEXT,
    "liveStory" BOOLEAN NOT NULL DEFAULT false,
    "liveStoryDisabled" BOOLEAN NOT NULL DEFAULT false,
    "poster" TEXT NOT NULL,
    "posterLandscapeSrc" TEXT,
    "posterPortraitSrc" TEXT NOT NULL,
    "posterSquareSrc" TEXT,
    "supportsLandscape" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,

    CONSTRAINT "AmpStoryData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmpStoryPageData" (
    "id" SERIAL NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "autoAdvanceAfter" TEXT,
    "backgroundAudio" TEXT,

    CONSTRAINT "AmpStoryPageData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmpStoryGridLayerData" (
    "id" SERIAL NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "gridArea" "GridArea",
    "template" "Template" NOT NULL DEFAULT E'fill',

    CONSTRAINT "AmpStoryGridLayerData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AmpMediaData" (
    "id" SERIAL NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "alt" TEXT,
    "attribution" TEXT,
    "autoplay" BOOLEAN DEFAULT true,
    "height" INTEGER NOT NULL,
    "layout" TEXT NOT NULL,
    "loop" BOOLEAN DEFAULT false,
    "noaudio" BOOLEAN DEFAULT false,
    "poster" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "volume" INTEGER,
    "width" INTEGER NOT NULL,

    CONSTRAINT "AmpMediaData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageData" (
    "id" SERIAL NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "slugOriginal" TEXT NOT NULL,
    "slugBase64" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "PageData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AmpStoryDataToAmpStoryPageData" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AmpStoryGridLayerDataToAmpStoryPageData" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AmpMediaDataToAmpStoryGridLayerData" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AmpStoryData_slugBase64_key" ON "AmpStoryData"("slugBase64");

-- CreateIndex
CREATE UNIQUE INDEX "PageData_slugBase64_key" ON "PageData"("slugBase64");

-- CreateIndex
CREATE UNIQUE INDEX "_AmpStoryDataToAmpStoryPageData_AB_unique" ON "_AmpStoryDataToAmpStoryPageData"("A", "B");

-- CreateIndex
CREATE INDEX "_AmpStoryDataToAmpStoryPageData_B_index" ON "_AmpStoryDataToAmpStoryPageData"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AmpStoryGridLayerDataToAmpStoryPageData_AB_unique" ON "_AmpStoryGridLayerDataToAmpStoryPageData"("A", "B");

-- CreateIndex
CREATE INDEX "_AmpStoryGridLayerDataToAmpStoryPageData_B_index" ON "_AmpStoryGridLayerDataToAmpStoryPageData"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AmpMediaDataToAmpStoryGridLayerData_AB_unique" ON "_AmpMediaDataToAmpStoryGridLayerData"("A", "B");

-- CreateIndex
CREATE INDEX "_AmpMediaDataToAmpStoryGridLayerData_B_index" ON "_AmpMediaDataToAmpStoryGridLayerData"("B");

-- AddForeignKey
ALTER TABLE "_AmpStoryDataToAmpStoryPageData" ADD CONSTRAINT "_AmpStoryDataToAmpStoryPageData_A_fkey" FOREIGN KEY ("A") REFERENCES "AmpStoryData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AmpStoryDataToAmpStoryPageData" ADD CONSTRAINT "_AmpStoryDataToAmpStoryPageData_B_fkey" FOREIGN KEY ("B") REFERENCES "AmpStoryPageData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AmpStoryGridLayerDataToAmpStoryPageData" ADD CONSTRAINT "_AmpStoryGridLayerDataToAmpStoryPageData_A_fkey" FOREIGN KEY ("A") REFERENCES "AmpStoryGridLayerData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AmpStoryGridLayerDataToAmpStoryPageData" ADD CONSTRAINT "_AmpStoryGridLayerDataToAmpStoryPageData_B_fkey" FOREIGN KEY ("B") REFERENCES "AmpStoryPageData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AmpMediaDataToAmpStoryGridLayerData" ADD CONSTRAINT "_AmpMediaDataToAmpStoryGridLayerData_A_fkey" FOREIGN KEY ("A") REFERENCES "AmpMediaData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AmpMediaDataToAmpStoryGridLayerData" ADD CONSTRAINT "_AmpMediaDataToAmpStoryGridLayerData_B_fkey" FOREIGN KEY ("B") REFERENCES "AmpStoryGridLayerData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
