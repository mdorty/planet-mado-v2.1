import Phaser from 'phaser';

/**
 * MapScene class for a grid-based map system in the DBZ RPG.
 * Players can move by clicking on adjacent tiles.
 */
export default class MapScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private map!: Phaser.Tilemaps.Tilemap;
  private tileset!: Phaser.Tilemaps.Tileset;
  private layer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super({ key: 'MapScene' });
  }

  preload() {
    // Load assets if necessary
    this.load.image('tiles', '/assets/tiles.jpg');
    this.load.image('player', '/assets/player.jpg');
  }

  create() {
    // Create the map
    this.map = this.make.tilemap({ width: 20, height: 20, tileWidth: 32, tileHeight: 32 });
    const tilesetImage = this.map.addTilesetImage('tiles');
    if (tilesetImage !== null) {
      this.tileset = tilesetImage;
      const layerResult = this.map.createBlankLayer('layer1', this.tileset, 0, 0);
      if (layerResult !== null) {
        this.layer = layerResult as Phaser.Tilemaps.TilemapLayer;
        // Fill the layer with a default tile index to ensure tiles are displayed
        for (let y = 0; y < 20; y++) {
          for (let x = 0; x < 20; x++) {
            this.layer.putTileAt(0, x, y);
          }
        }
      } else {
        console.error('Failed to create layer');
        // Use a type assertion to ensure TypeScript knows this will be non-null
        this.layer = this.map.createBlankLayer('fallback', this.tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;
        // Fill the fallback layer with a default tile index
        for (let y = 0; y < 20; y++) {
          for (let x = 0; x < 20; x++) {
            this.layer.putTileAt(0, x, y);
          }
        }
      }
    } else {
      console.error('Failed to add tileset image');
      // Fallback to a blank layer if tileset fails
      this.layer = this.map.createBlankLayer('fallback', this.tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;
      // Fill the fallback layer with a default tile index
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
          this.layer.putTileAt(0, x, y);
        }
      }
    }

    // Set up the player
    this.player = this.add.sprite(100, 100, 'player');
    this.player.setScale(0.5);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Set up input for clicking
    this.input.on('pointerdown', this.handleClick, this);

    // Optionally set up keyboard input for debugging or alternative control
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    } else {
      console.warn('Keyboard input not available');
    }
  }

  update() {
    // Handle keyboard input if needed for debugging
    if (this.cursors && this.cursors.left.isDown) {
      this.player.x -= 5;
    } else if (this.cursors && this.cursors.right.isDown) {
      this.player.x += 5;
    }

    if (this.cursors && this.cursors.up.isDown) {
      this.player.y -= 5;
    } else if (this.cursors && this.cursors.down.isDown) {
      this.player.y += 5;
    }

    // No need to check for null since we've used definite assignment
    // Add any layer-specific updates here if needed
  }

  private handleClick(pointer: Phaser.Input.Pointer) {
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const tileX = Math.floor(worldPoint.x / 32);
    const tileY = Math.floor(worldPoint.y / 32);
    const playerTileX = Math.floor(this.player.x / 32);
    const playerTileY = Math.floor(this.player.y / 32);

    // Check if the clicked tile is adjacent
    const isAdjacent = (Math.abs(tileX - playerTileX) === 1 && tileY === playerTileY) || 
                       (Math.abs(tileY - playerTileY) === 1 && tileX === playerTileX);

    if (isAdjacent) {
      // Move player to the clicked tile
      this.tweens.add({
        targets: this.player,
        x: tileX * 32 + 16,
        y: tileY * 32 + 16,
        duration: 200,
        ease: 'Power1'
      });
    }
  }
}
