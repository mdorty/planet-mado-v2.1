import Phaser from 'phaser';

/**
 * MapScene class for a grid-based map system in the DBZ RPG.
 * Players can move by clicking on adjacent tiles.
 */
export default class MapScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private tileGrid: Phaser.GameObjects.TileSprite[][] = [];
  private map!: Phaser.Tilemaps.Tilemap;
  private tileset!: Phaser.Tilemaps.Tileset;
  private layer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super({ key: 'MapScene' });
  }

  preload() {
    this.load.spritesheet('player', '/assets/vegeta.png', { frameWidth: 32, frameHeight: 32 });
    const mapData = this.registry.get('mapData');
    if (mapData && mapData.tileImage) {
      console.log('Loading tile image from:', mapData.tileImage);
      this.load.image('tiles', mapData.tileImage);
    } else {
      console.log('No tile image found in mapData, using default placeholder');
      this.load.image('tiles', '/assets/placeholder.png');
    }
  }

  create() {
    let xCoord = 1;
    let yCoord = 1;
    const mapData = this.registry.get('mapData');
    console.log('MapScene create, mapData:', mapData);
    if (mapData) {
      xCoord = mapData.xCoord || 0;
      yCoord = mapData.yCoord || 0;
    }

    // Create a small map centered on the player
    this.tileGrid = [];
    for (let y = yCoord - 1; y <= yCoord + 1; y++) {
      const row = [];
      for (let x = xCoord - 1; x <= xCoord + 1; x++) {
        // Use a default tile index or fetch from mapData if available
        let tileIndex = 0;
        if (mapData && mapData.tiles && mapData.tiles[y] && mapData.tiles[y][x]) {
          tileIndex = mapData.tiles[y][x];
        }
        const tile = this.add.tileSprite(x * 32 + 16, y * 32 + 16, 32, 32, 'tiles', tileIndex);
        tile.setDepth(0);
        row.push(tile);
        console.log(`Created tile at (${x}, ${y}) with index ${tileIndex}`);
      }
      this.tileGrid.push(row);
    }

    const characterData = this.registry.get('characterData');
    let playerX = (characterData.xCoord || 1) * 32 + 16; // Center of 3x3 grid
    let playerY = (characterData.yCoord || 1) * 32 + 16; // Center of 3x3 grid
    console.log('Player position:', { x: playerX, y: playerY, xCoord: characterData.xCoord, yCoord: characterData.yCoord });

    this.player = this.add.sprite(playerX, playerY, 'player', 0);
    this.player.setDepth(1);

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.handleClick(pointer));
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
        ease: 'Power1',
        onComplete: () => {
          // Update character data with new coordinates - this would need to be saved to DB via API call
          const characterData = this.registry.get('characterData');
          if (characterData) {
            characterData.xCoord = tileX;
            characterData.yCoord = tileY;
            this.registry.set('characterData', characterData);
            // Note: An API call or event should be triggered here to save to database
            console.log(`Updated player position to (${tileX}, ${tileY})`);
          }
        }
      });
      // Camera will follow player in update method
    }
  }
}
