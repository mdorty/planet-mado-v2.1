import Phaser from 'phaser';

/**
 * MapScene class for a grid-based map system in the DBZ RPG.
 * Players can move by clicking on adjacent tiles.
 */
export default class MapScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private tileGrid: Phaser.GameObjects.Image[][] = [];
  private map!: Phaser.Tilemaps.Tilemap;
  private tileset!: Phaser.Tilemaps.Tileset;
  private layer!: Phaser.Tilemaps.TilemapLayer;
  private playerNameText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MapScene' });
  }

  preload() {
    // Load player sprite
    this.load.image('player', '/assets/player.jpg');
    
    // Load tile images
    this.load.image('grass', '/assets/tiles.jpg');
    this.load.image('tree', '/assets/tiles.jpg');
    
    const mapData = this.registry.get('mapData');
    if (mapData && mapData.tileImage) {
      console.log('Loading tile image from:', mapData.tileImage);
      this.load.image('tiles', mapData.tileImage);
    } else {
      console.log('No tile image found in mapData, using default tiles');
      this.load.image('tiles', '/assets/tiles.jpg');
    }
  }

  create() {
    // Set background color to white
    this.cameras.main.setBackgroundColor('#ffffff');
    
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const tileSize = 80; // Size of each tile
    const gridSpacing = 160; // Space between tiles (creates gaps)
    
    // Get character data
    const characterData = this.registry.get('characterData') || { name: 'Mado', xCoord: 1, yCoord: 1 };
    const mapData = this.registry.get('mapData');
    console.log('MapScene create, mapData:', mapData);
    
    // Define the 3x3 grid layout
    // 0 = grass, 1 = tree/bush
    const layout = [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1]
    ];
    
    // Create the tile grid (spread out in a 5x5 pattern)
    this.tileGrid = [];
    for (let y = 0; y < 3; y++) {
      const row = [];
      for (let x = 0; x < 3; x++) {
        // Calculate position with spacing (creates a more spread out grid)
        // Multiply by 2 to create the gap effect (like a 5x5 grid with empty spaces)
        const posX = centerX + (x - 1) * gridSpacing;
        const posY = centerY + (y - 1) * gridSpacing;
        
        // Determine tile type based on layout
        const tileType = layout[y][x] === 1 ? 'tree' : 'grass';
        
        // Create tile
        const tile = this.add.image(posX, posY, 'tiles');
        tile.setDisplaySize(tileSize, tileSize);
        tile.setDepth(0);
        
        // Add to grid
        row.push(tile);
      }
      this.tileGrid.push(row);
    }
    
    // Add player in the center
    const playerX = centerX;
    const playerY = centerY;
    this.player = this.add.sprite(playerX, playerY, 'player');
    this.player.setDisplaySize(tileSize * 0.8, tileSize * 0.8);
    this.player.setDepth(1);
    
    // Add player name text
    this.playerNameText = this.add.text(
      playerX, 
      playerY + tileSize/2 + 10, 
      characterData.name || 'Mado', 
      { 
        fontFamily: 'Anton, cursive',
        fontSize: '16px',
        color: '#000000',
        align: 'center'
      }
    );
    this.playerNameText.setOrigin(0.5);
    this.playerNameText.setDepth(2);
    
    // Set up input handling
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.handleClick(pointer));
  }

  update() {
    // Keep camera centered on the player
    this.cameras.main.centerOn(this.player.x, this.player.y);
    
    // Keep the player name text below the player
    if (this.playerNameText && this.player) {
      this.playerNameText.setPosition(this.player.x, this.player.y + 60);
    }
  }

  private handleClick(pointer: Phaser.Input.Pointer) {
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const tileSize = 80;
    const gridSpacing = 160;
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    // Calculate grid coordinates (0-2) with the wider spacing
    const gridX = Math.round((worldPoint.x - centerX) / gridSpacing + 1);
    const gridY = Math.round((worldPoint.y - centerY) / gridSpacing + 1);
    
    // Calculate player's current grid position
    const playerGridX = Math.round((this.player.x - centerX) / gridSpacing + 1);
    const playerGridY = Math.round((this.player.y - centerY) / gridSpacing + 1);
    
    console.log(`Clicked grid: (${gridX}, ${gridY}), Player at: (${playerGridX}, ${playerGridY})`);
    
    // Check if the clicked position is within the 3x3 grid
    if (gridX >= 0 && gridX < 3 && gridY >= 0 && gridY < 3) {
      // Check if the clicked tile is adjacent to the player
      const isAdjacent = (Math.abs(gridX - playerGridX) === 1 && gridY === playerGridY) || 
                         (Math.abs(gridY - playerGridY) === 1 && gridX === playerGridX);
      
      // Check if the clicked tile is a grass tile (not a tree)
      const layout = [
        [1, 0, 1],
        [0, 0, 0],
        [1, 0, 1]
      ];
      const isGrass = layout[gridY][gridX] === 0;
      
      if (isAdjacent && isGrass) {
        // Calculate the new position with the wider spacing
        const newX = centerX + (gridX - 1) * gridSpacing;
        const newY = centerY + (gridY - 1) * gridSpacing;
        
        // Move player to the clicked tile
        this.tweens.add({
          targets: this.player,
          x: newX,
          y: newY,
          duration: 300,
          ease: 'Power1',
          onComplete: () => {
            // Update character data with new coordinates
            const characterData = this.registry.get('characterData') || {};
            characterData.xCoord = gridX;
            characterData.yCoord = gridY;
            this.registry.set('characterData', characterData);
            console.log(`Updated player position to grid (${gridX}, ${gridY})`);
            
            // Update the grid tiles around the player's new position
            this.updateGridTiles(gridX, gridY);
          }
        });
        
        // Also move the player name text
        this.tweens.add({
          targets: this.playerNameText,
          x: newX,
          y: newY + 60,
          duration: 300,
          ease: 'Power1'
        });
      }
    }
  }

  // Updates the grid tiles based on player's new position
  private updateGridTiles(playerGridX: number, playerGridY: number) {
    const tileSize = 80;
    const gridSpacing = 160;
    
    // Define the 3x3 grid layout
    // This would typically come from a map data source based on player position
    // For now, we're using a simple pattern
    const layout = [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1]
    ];
    
    // Update existing tiles
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        // Calculate position with spacing
        const posX = this.player.x + (x - 1) * gridSpacing;
        const posY = this.player.y + (y - 1) * gridSpacing;
        
        // Update tile position
        if (this.tileGrid[y] && this.tileGrid[y][x]) {
          this.tileGrid[y][x].setPosition(posX, posY);
        }
      }
    }
  }
}
