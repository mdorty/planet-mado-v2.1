-- CreateTable
CREATE TABLE "ItemTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "effect" TEXT,
    "value" INTEGER NOT NULL DEFAULT 0,
    "durability" INTEGER NOT NULL DEFAULT 100,
    "stackable" BOOLEAN NOT NULL DEFAULT false,
    "maxStackSize" INTEGER NOT NULL DEFAULT 1,
    "usableInBattle" BOOLEAN NOT NULL DEFAULT false,
    "equipmentSlot" TEXT,
    "lootChance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "ItemTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" SERIAL NOT NULL,
    "characterId" TEXT,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "equipped" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "item_type_idx" ON "ItemTemplate"("type");

-- CreateIndex
CREATE INDEX "item_name_idx" ON "ItemTemplate"("name");

-- CreateIndex
CREATE INDEX "inventory_characterId_idx" ON "InventoryItem"("characterId");

-- CreateIndex
CREATE INDEX "inventory_itemId_idx" ON "InventoryItem"("itemId");

-- CreateIndex
CREATE INDEX "inventory_equipped_idx" ON "InventoryItem"("equipped");

-- CreateIndex
CREATE INDEX "character_userId_idx" ON "Character"("userId");

-- CreateIndex
CREATE INDEX "character_powerlevel_idx" ON "Character"("currentPowerlevel");

-- CreateIndex
CREATE INDEX "character_race_idx" ON "Character"("race");

-- CreateIndex
CREATE INDEX "move_characterId_idx" ON "Move"("characterId");

-- CreateIndex
CREATE INDEX "move_category_idx" ON "Move"("category");

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
