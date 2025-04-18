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
  private playerMoving = false;

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
        
        // Make grass tiles interactive with pointer cursor
        if (layout[y][x] === 0) { // If it's a grass tile
          tile.setInteractive({ cursor: 'pointer' });
        }
        
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
    
    // Update cursor based on what's under the mouse
    this.updateCursorStyle();
  }
  
  // Updates the cursor style based on what's under the mouse
  private updateCursorStyle() {
    const pointer = this.input.activePointer;
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const gridSpacing = 160;
    
    // Calculate relative grid coordinates
    const relativeX = worldPoint.x - this.player.x;
    const relativeY = worldPoint.y - this.player.y;
    
    // Convert to grid coordinates (-1, 0, 1)
    const gridX = Math.round(relativeX / gridSpacing);
    const gridY = Math.round(relativeY / gridSpacing);
    
    // Convert to layout array indices
    const layoutX = gridX + 1; // -1,0,1 -> 0,1,2
    const layoutY = gridY + 1; // -1,0,1 -> 0,1,2
    
    // Check if it's a valid position and an adjacent grass tile
    const layout = [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1]
    ];
    
    // Only change cursor if it's within the grid
    if (layoutX >= 0 && layoutX < 3 && layoutY >= 0 && layoutY < 3) {
      // Check if it's adjacent to the player
      const isAdjacent = (Math.abs(gridX) === 1 && gridY === 0) || 
                         (Math.abs(gridY) === 1 && gridX === 0);
      
      // Check if it's a grass tile
      const isGrass = layout[layoutY][layoutX] === 0;
      
      // Set cursor style based on whether the tile is clickable
      if (isAdjacent && isGrass) {
        this.input.setDefaultCursor('pointer');
      } else {
        this.input.setDefaultCursor('default');
      }
    } else {
      this.input.setDefaultCursor('default');
    }
  }

  private animateTiles(direction: string) {
    const duration = 500; // Animation duration in milliseconds
    const gridSpacing = 160; // Space between tiles
    let offsetX = 0;
    let offsetY = 0;

    // Determine the offset based on direction to simulate scrolling
    switch (direction) {
      case 'up':
        offsetY = -gridSpacing; // Tiles slide down from above (camera moving up)
        break;
      case 'down':
        offsetY = gridSpacing; // Tiles slide up from below (camera moving down)
        break;
      case 'left':
        offsetX = -gridSpacing; // Tiles slide right from left (camera moving left)
        break;
      case 'right':
        offsetX = gridSpacing; // Tiles slide left from right (camera moving right)
        break;
    }

    // Animate each tile
    for (let y = 0; y < this.tileGrid.length; y++) {
      for (let x = 0; x < this.tileGrid[y].length; x++) {
        const tile = this.tileGrid[y][x];
        // Set initial position (offset from final position)
        tile.setPosition(tile.x + offsetX, tile.y + offsetY);
        // Animate to final position
        this.tweens.add({
          targets: tile,
          x: tile.x - offsetX,
          y: tile.y - offsetY,
          duration: duration,
          ease: 'Power2'
        });
      }
    }
  }

  private updateMap(direction: string) {
    console.log('Updating map for direction:', direction);
    // Animate the tiles sliding in from the direction opposite to movement to simulate scrolling
    this.animateTiles(direction);
  }

  private updateGridTiles(playerX: number, playerY: number) {
    // Define the 3x3 grid layout around the player's absolute coordinates
    // This could be based on a larger map data structure, for now we'll simulate it
    // 0 = grass, 1 = tree/bush
    const layout = [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1]
    ];

    // Update each tile based on the player's new position
    for (let y = 0; y < this.tileGrid.length; y++) {
      for (let x = 0; x < this.tileGrid[y].length; x++) {
        const tile = this.tileGrid[y][x];
        const tileType = layout[y][x] === 1 ? 'tree' : 'grass';
        // For now, we're just reusing the same image, but in a real game, you'd update based on map data
        tile.setTexture('tiles');
        tile.setDisplaySize(80, 80);
        tile.setDepth(0);

        // Make grass tiles interactive with pointer cursor
        if (layout[y][x] === 0) {
          tile.setInteractive({ cursor: 'pointer' });
        } else {
          tile.disableInteractive();
        }
      }
    }
  }

  private handleClick(pointer: Phaser.Input.Pointer) {
    // Get the world point where the player clicked
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const tileSize = 80;
    const gridSpacing = 160;
    
    // Calculate grid coordinates relative to the player's current position
    // This is important because the camera follows the player
    const relativeX = worldPoint.x - this.player.x;
    const relativeY = worldPoint.y - this.player.y;
    
    // Convert to grid coordinates (-1, 0, 1) for the 3x3 grid around player
    const gridX = Math.round(relativeX / gridSpacing);
    const gridY = Math.round(relativeY / gridSpacing);
    
    // Get the player's current grid coordinates (always 0,0 in relative terms)
    const playerGridX = 0;
    const playerGridY = 0;
    
    // For debugging
    console.log(`Clicked grid: (${gridX}, ${gridY}), Player at: (${playerGridX}, ${playerGridY})`);
    
    // Define the 3x3 grid layout (0 = grass/walkable, 1 = tree/obstacle)
    const layout = [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1]
    ];
    
    // Convert relative grid coordinates to layout array indices
    const layoutX = gridX + 1; // -1,0,1 -> 0,1,2
    const layoutY = gridY + 1; // -1,0,1 -> 0,1,2
    
    // Check if the clicked position is within the 3x3 grid
    if (layoutX >= 0 && layoutX < 3 && layoutY >= 0 && layoutY < 3) {
      // Check if the clicked tile is adjacent to the player (which is at 0,0 in relative terms)
      const isAdjacent = (Math.abs(gridX) === 1 && gridY === 0) || 
                         (Math.abs(gridY) === 1 && gridX === 0);
      
      // Check if the clicked tile is a grass tile (not a tree)
      const isGrass = layout[layoutY][layoutX] === 0;
      
      // For debugging
      console.log(`Layout position: (${layoutX}, ${layoutY}), isAdjacent: ${isAdjacent}, isGrass: ${isGrass}`);
      
      if (isAdjacent && isGrass) {
        // Calculate the new position with the wider spacing
        const newX = this.player.x + gridX * gridSpacing;
        const newY = this.player.y + gridY * gridSpacing;
        
        // Determine the direction of movement
        let direction = '';
        if (gridX === -1) direction = 'left';
        else if (gridX === 1) direction = 'right';
        else if (gridY === -1) direction = 'up';
        else if (gridY === 1) direction = 'down';

        // Move player and update map
        console.log(`Moving player ${direction}`);
        this.playerMoving = true;
        
        // Update the map tiles with animation
        this.updateMap(direction);
        
        // Move player sprite without additional animation
        this.player.setPosition(newX, newY);
        // Update player coordinates in registry
        const characterData = this.registry.get('characterData') || {};
        this.registry.set('characterData', {
          ...characterData,
          xCoord: (characterData.xCoord || 0) + gridX,
          yCoord: (characterData.yCoord || 0) + gridY
        });
        console.log(`Player moved to (${newX}, ${newY})`);
        
        // Update the grid tiles around the player's new position
        this.updateGridTiles((characterData.xCoord || 0) + gridX, (characterData.yCoord || 0) + gridY);
        
        this.playerMoving = false;
      }
    }
  }
}
