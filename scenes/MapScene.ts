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
    const characterData = this.registry.get('characterData');
    if (characterData && characterData.playerImage) {
      this.load.image('player', characterData.playerImage);
    } else {
      this.load.image('player', '/assets/player.jpg');
    }
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
    // Create a smaller map view focused on player - 3x3 grid (player + 8 adjacent tiles)
    this.map = this.make.tilemap({ width: 3, height: 3, tileWidth: 32, tileHeight: 32 });
    const tilesetImage = this.map.addTilesetImage('tiles');
    if (tilesetImage !== null) {
      this.tileset = tilesetImage;
      const layerResult = this.map.createBlankLayer('layer1', this.tileset, xCoord, yCoord);
      if (layerResult !== null) {
        this.layer = layerResult as Phaser.Tilemaps.TilemapLayer;
        // Fill the 3x3 grid with tiles
        for (let y = 0; y < 3; y++) {
          for (let x = 0; x < 3; x++) {
            this.layer.putTileAt(1, x, y);
          }
        }
      } else {
        console.error('Failed to create tilemap layer');
      }
    } else {
      console.error('Tileset image not found');
    }

    // Create player sprite
    const characterData = this.registry.get('characterData');
    let playerX = 1 * 32 + 16; // Center of 3x3 grid
    let playerY = 1 * 32 + 16; // Center of 3x3 grid
    if (characterData) {
      playerX = characterData.x || playerX;
      playerY = characterData.y || playerY;
    }
    this.player = this.add.sprite(playerX, playerY, 'player');
    this.player.setScale(0.5);
    this.physics.add.existing(this.player);

    // Set up camera to focus tightly on the 3x3 grid
    this.cameras.main.setSize(96, 96); // 3 tiles x 32 pixels
    this.cameras.main.centerOn(playerX, playerY);
    this.cameras.main.setBounds(0, 0, 96, 96);

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
    // Camera follows player
    const playerTileX = Math.floor(this.player.x / 32);
    const playerTileY = Math.floor(this.player.y / 32);
    // Update camera to center on player
    this.cameras.main.centerOn(this.player.x, this.player.y);
    // Optionally update map tiles if needed based on player position
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
      // Update the map view to shift with player movement
      // This is a simple approach - in a real game you'd load new map data
      this.map.shiftTiles(0, 0);
    }
  }
}
