import * as Phaser from 'phaser';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  imageKey: string;
  quantity: number;
}

/**
 * InventoryScene overlays on top of MapScene to display the player's inventory.
 * Inventory data is passed in via scene data ({ inventory: InventoryItem[] }).
 */
export default class InventoryScene extends Phaser.Scene {
  public playerInventory: InventoryItem[] = [];
  private tooltip?: Phaser.GameObjects.Container;
  private readonly placeholderKey = 'item-placeholder';

  constructor() {
    super({ key: 'InventoryScene' });
  }

  init(data: { inventory: InventoryItem[] }) {
    this.playerInventory = data.inventory || [];
  }

  preload() {
    // Load a default placeholder image (ensure this exists in public/assets/)
    this.load.image(this.placeholderKey, '/assets/no_image_placeholder.png');
    // Dynamically load all item images
    this.playerInventory.forEach((item) => {
      if (item.imageKey && typeof item.imageKey === 'string' && item.imageKey.trim() !== '') {
        // Use the imageKey as the key, and treat it as the URL
        this.load.image(item.imageKey, item.imageKey);
      }
    });
  }

  create() {
    // Semi-transparent background overlay
    this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.6
    ).setDepth(0);

    // Title
    this.add.text(
      this.cameras.main.centerX,
      60,
      'Inventory',
      {
        fontFamily: 'Anton, cursive',
        fontSize: '48px',
        color: '#fff',
        align: 'center',
      }
    ).setOrigin(0.5, 0).setDepth(1);

    // Inventory grid
    const cols = 5;
    const itemSize = 96;
    const spacing = 24;
    const startX = this.cameras.main.centerX - ((cols - 1) * (itemSize + spacing)) / 2;
    const startY = 140;

    this.playerInventory.forEach((item, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = startX + col * (itemSize + spacing);
      const y = startY + row * (itemSize + spacing);
      // Use the loaded image if available, otherwise fallback to placeholder
      const keyToUse = this.textures.exists(item.imageKey) ? item.imageKey : this.placeholderKey;
      const icon = this.add.image(x, y, keyToUse).setDisplaySize(itemSize, itemSize).setDepth(1).setInteractive();

      // Quantity badge
      if (item.quantity > 1) {
        this.add.text(x + itemSize / 2 - 18, y + itemSize / 2 - 18, String(item.quantity), {
          fontFamily: 'Roboto, sans-serif',
          fontSize: '20px',
          color: '#ffe082',
          fontStyle: 'bold',
        }).setDepth(2);
      }

      // Tooltip on hover
      icon.on('pointerover', () => this.showTooltip(item, x, y));
      icon.on('pointerout', () => this.hideTooltip());
    });

    // Close button
    const closeBtn = this.add.text(
      this.cameras.main.width - 40,
      20,
      '✕',
      { fontFamily: 'Roboto, sans-serif', fontSize: '36px', color: '#fff', fontStyle: 'bold' }
    ).setInteractive().setDepth(2);
    closeBtn.on('pointerdown', () => {
      this.scene.stop();
    });
  }

  showTooltip(item: InventoryItem, x: number, y: number) {
    this.hideTooltip();
    const container = this.add.container(x + 60, y - 20);
    const bg = this.add.rectangle(0, 0, 220, 90, 0x222222, 0.95).setOrigin(0, 0).setDepth(10);
    const name = this.add.text(10, 8, item.name, {
      fontFamily: 'Anton, cursive',
      fontSize: '20px',
      color: '#ffe082',
    }).setDepth(11);
    const desc = this.add.text(10, 34, item.description, {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '16px',
      color: '#fff',
      wordWrap: { width: 200 },
    }).setDepth(11);
    container.add([bg, name, desc]);
    container.setDepth(10);
    this.tooltip = container;
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = undefined;
    }
  }
}
