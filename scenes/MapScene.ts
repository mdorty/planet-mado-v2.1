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
    const mapData = this.registry.get('mapData');
    if (mapData && mapData.tileImage) {
      this.load.image('tiles', mapData.tileImage);
    } else {
      this.load.image('tiles', '/assets/tiles.jpg');
    }
    this.load.image('player', '/assets/player.jpg');
  }

  create() {
    // Create the map
    const mapData = this.registry.get('mapData');
    let xCoord = 0;
    let yCoord = 0;
    if (mapData) {
      xCoord = mapData.xCoord || 0;
      yCoord = mapData.yCoord || 0;
    }
    this.map = this.make.tilemap({ width: 20, height: 20, tileWidth: 32, tileHeight: 32 });
    const tilesetImage = this.map.addTilesetImage('tiles');
    if (tilesetImage !== null) {
      this.tileset = tilesetImage;
      const layerResult = this.map.createBlankLayer('layer1', this.tileset, xCoord, yCoord);
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
        this.layer = this.map.createBlankLayer('fallback', this.tileset, xCoord, yCoord) as Phaser.Tilemaps.TilemapLayer;
        // Fill the fallback layer with a default tile index
        for (let y = 0; y < 20; y++) {
          for (let x = 0; x < 20; x++) {
            this.layer.putTileAt(0, x, y);
          }
        }
      }
    } else {
      console.error('Failed to add tileset image');
      // Fallback
      this.tileset = this.map.addTilesetImage('tiles') as Phaser.Tilemaps.Tileset;
      this.layer = this.map.createBlankLayer('fallback', this.tileset, xCoord, yCoord) as Phaser.Tilemaps.TilemapLayer;
      // Fill the fallback layer with a default tile index
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 20; x++) {
          this.layer.putTileAt(0, x, y);
        }
      }
    }

    // Create player sprite at the center of the map
    this.player = this.add.sprite(400, 300, 'player');
    this.player.setScale(0.5);
    this.physics.add.existing(this.player);
    (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

    // Set up camera to follow the player
    this.cameras.main.startFollow(this.player);

    // Set up input for movement
    if (this.input.keyboard !== null && this.input.keyboard !== undefined) {
      this.cursors = this.input.keyboard.createCursorKeys();
    } else {
      console.warn('Keyboard input not available');
      // Initialize cursors with a dummy object to prevent null checks elsewhere
      this.cursors = {
        up: { isDown: false },
        down: { isDown: false },
        left: { isDown: false },
        right: { isDown: false },
        space: { isDown: false },
        shift: { isDown: false }
      } as Phaser.Types.Input.Keyboard.CursorKeys;
    }
    this.input.on('pointerdown', this.handleClick, this);
  }

  update() {
    // Handle keyboard input for movement (for debugging or alternative control)
    if (this.cursors.left.isDown) {
      if (this.player.body) {
        (this.player.body as Phaser.Physics.Arcade.Body).setVelocityX(-100);
      }
    } else if (this.cursors.right.isDown) {
      if (this.player.body) {
        (this.player.body as Phaser.Physics.Arcade.Body).setVelocityX(100);
      }
    } else if (this.cursors.up.isDown) {
      if (this.player.body) {
        (this.player.body as Phaser.Physics.Arcade.Body).setVelocityY(-100);
      }
    } else if (this.cursors.down.isDown) {
      if (this.player.body) {
        (this.player.body as Phaser.Physics.Arcade.Body).setVelocityY(100);
      }
    } else {
      if (this.player.body) {
        (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0);
      }
    }
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
