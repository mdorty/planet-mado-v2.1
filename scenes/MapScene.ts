import * as Phaser from 'phaser';

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
  private powerLevelContainer!: Phaser.GameObjects.Container;
  private powerLevelText!: Phaser.GameObjects.Text;
  private currentPowerLevelText!: Phaser.GameObjects.Text;
  private basePowerLevelText!: Phaser.GameObjects.Text;

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

    // --- Render other players at location (excluding self) ---
    const playersAtLocation = this.registry.get('playersAtLocation') || [];
    const selfId = characterData.id;
    // Arrange other players in a circle around the main player
    const radius = tileSize;
    const otherPlayers = playersAtLocation.filter((p: any) => p.id !== selfId);
    otherPlayers.forEach((p: any, i: number) => {
      const angle = (2 * Math.PI * i) / otherPlayers.length;
      const px = playerX + Math.cos(angle) * radius;
      const py = playerY + Math.sin(angle) * radius;
      const sprite = this.add.sprite(px, py, 'player');
      sprite.setDisplaySize(tileSize * 0.7, tileSize * 0.7);
      sprite.setDepth(1);
      // Tint if sleeping
      if (p.status === 'Sleeping') {
        sprite.setTint(0x888888); // Gray tint for sleeping
      }
      // Show name below
      this.add.text(px, py + tileSize/2 + 10, p.name, {
        fontFamily: 'Anton, cursive',
        fontSize: '16px',
        color: '#404040',
        align: 'center',
      }).setOrigin(0.5).setDepth(2);
      // Show status label if sleeping
      if (p.status === 'Sleeping') {
        this.add.text(px, py + tileSize/2 + 28, 'Sleeping', {
          fontFamily: 'Roboto, sans-serif',
          fontSize: '14px',
          color: '#888',
          fontStyle: 'italic',
          align: 'center',
        }).setOrigin(0.5).setDepth(2);
      }
    });

    // Add power level display to the left of the map
    this.createPowerLevelDisplay();
    
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

  update(time: number, delta: number): void {
    // Keep camera centered on the player
    this.cameras.main.centerOn(this.player.x, this.player.y);
    
    // Keep the player name text below the player
    if (this.playerNameText && this.player) {
      this.playerNameText.setPosition(this.player.x, this.player.y + 60);
    }
    
    // Keep the power level display positioned to the left of the map
    if (this.powerLevelContainer) {
      const leftEdge = this.cameras.main.centerX - (this.cameras.main.width / 2);
      this.powerLevelContainer.setPosition(leftEdge + 60, this.cameras.main.centerY - 100);
    }
    
    // Update cursor based on what's under the mouse
    this.updateCursorStyle();
    
    // Update power level display periodically in case data was set after initialization
    if (this.time.now % 1000 < delta) { // Roughly every second
      this.updatePowerLevelDisplay();
    }
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
    
    // Check if the clicked position is adjacent to the player (can only move 1 tile at a time)
    const isAdjacent = (Math.abs(gridX) === 1 && gridY === 0) || 
                       (Math.abs(gridY) === 1 && gridX === 0);
    
    // Convert to layout array index
    const layoutX = gridX + 1; // Convert -1,0,1 to 0,1,2 for array index
    const layoutY = gridY + 1; // Convert -1,0,1 to 0,1,2 for array index
    
    // Check if the clicked tile is a grass tile (walkable)
    const isGrassTile = layoutX >= 0 && layoutX < 3 && layoutY >= 0 && layoutY < 3 && layout[layoutY][layoutX] === 0;
    
    // Move the player if it's an adjacent grass tile
    if (isAdjacent && isGrassTile && !this.playerMoving) {
      // Calculate the absolute position to move to
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
      
      // Move player to the clicked tile
      this.tweens.add({
        targets: this.player,
        x: newX,
        y: newY,
        duration: 300,
        ease: 'Power1',
        onComplete: () => {
          this.playerMoving = false;
          // Update player coordinates in registry
          const characterData = this.registry.get('characterData') || {};
          characterData.xCoord = (characterData.xCoord || 0) + gridX;
          characterData.yCoord = (characterData.yCoord || 0) + gridY;
          this.registry.set('characterData', characterData);
          console.log(`Updated player position to grid (${characterData.xCoord}, ${characterData.yCoord})`);
          
          // Update the grid tiles around the player's new position
          this.updateGridTiles(characterData.xCoord, characterData.yCoord);
          
          // Update power level display in case it changes with movement
          this.updatePowerLevelDisplay();
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
    
    // Update existing tiles to be positioned relative to the player
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        // Calculate position with spacing relative to player
        const posX = this.player.x + (x - 1) * gridSpacing;
        const posY = this.player.y + (y - 1) * gridSpacing;
        
        // Update tile position
        if (this.tileGrid[y] && this.tileGrid[y][x]) {
          // Determine tile type based on layout
          const tileType = layout[y][x] === 1 ? 'tree' : 'grass';
          
          // Update tile position
          this.tileGrid[y][x].setPosition(posX, posY);
          
          // Make sure grass tiles are interactive with pointer cursor
          if (layout[y][x] === 0) { // If it's a grass tile
            this.tileGrid[y][x].setInteractive({ cursor: 'pointer' });
          } else {
            this.tileGrid[y][x].disableInteractive();
          }
        }
      }
    }
  }
  
  // Creates the power level display on the left side of the map
  private createPowerLevelDisplay() {
    const characterData = this.registry.get('characterData') || {};
    console.log('Character Data in Registry (createPowerLevelDisplay):', characterData);
    const powerLevel = characterData.currentPowerlevel || characterData.powerLevel || 0;
    const basePowerLevel = characterData.basePowerlevel || characterData.basePowerLevel || 0;
    const percentage = basePowerLevel > 0 ? Math.round((powerLevel / basePowerLevel) * 100) : 0;
    
    // Position the display to the left of the map, fixed to camera, adjusted further right
    const containerX = -300; // Adjusted from -350 to -300 to move right
    const containerY = -100; // Relative to camera center
    
    // Create a container for the power level display
    this.powerLevelContainer = this.add.container(containerX, containerY);
    this.powerLevelContainer.setDepth(2);
    this.powerLevelContainer.setScrollFactor(0); // Fix to camera, does not scroll with map
    
    // Create a graphics object for the progress arc (green outline only, no background)
    const progressArc = this.add.graphics();
    progressArc.lineStyle(4, 0x00FF00, 1); // Green stroke, thinner for smaller size
    // Draw an arc for the progress based on percentage
    const angle = (percentage / 100) * 360;
    progressArc.beginPath();
    progressArc.arc(0, 0, 39.375, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(-90 + angle), false); // Radius reduced by another 25% from 52.5 to 39.375
    progressArc.stroke();
    this.powerLevelContainer.add(progressArc);
    
    // Add the percentage text in the center of the circle
    this.powerLevelText = this.add.text(0, 0, `${percentage}%`, {
      fontFamily: 'Anton, cursive',
      fontSize: '14px', // Reduced font size further for smaller circle
      color: '#000000',
      align: 'center'
    }).setOrigin(0.5);
    this.powerLevelContainer.add(this.powerLevelText);
    
    // Add combined power level text below the circle in the format 'current / base'
    this.currentPowerLevelText = this.add.text(0, 60, `${powerLevel.toLocaleString()} / ${basePowerLevel.toLocaleString()}`, {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '14px',
      color: '#000000',
      align: 'center'
    }).setOrigin(0.5);
    this.powerLevelContainer.add(this.currentPowerLevelText);
    
    // Remove the separate base power level text since it's now combined above
    if (this.basePowerLevelText) {
      this.basePowerLevelText.destroy();
      (this.basePowerLevelText as Phaser.GameObjects.Text | undefined) = undefined;
    }
  }

  // Updates the power level display if data was set after initialization
  private updatePowerLevelDisplay() {
    const characterData = this.registry.get('characterData') || {};
    console.log('Character Data in Registry (updatePowerLevelDisplay):', characterData);
    const powerLevel = characterData.currentPowerlevel || characterData.powerLevel || 0;
    const basePowerLevel = characterData.basePowerlevel || characterData.basePowerLevel || 0;
    const percentage = basePowerLevel > 0 ? Math.round((powerLevel / basePowerLevel) * 100) : 0;
    
    if (this.powerLevelText) {
      this.powerLevelText.setText(`${percentage}%`);
    }
    
    if (this.currentPowerLevelText) {
      this.currentPowerLevelText.setText(`${powerLevel.toLocaleString()} / ${basePowerLevel.toLocaleString()}`);
    }
    
    // Remove the separate base power level text if it exists
    if (this.basePowerLevelText) {
      this.basePowerLevelText.destroy();
      (this.basePowerLevelText as Phaser.GameObjects.Text | undefined) = undefined;
    }
    
    // Redraw the progress arc
    if (this.powerLevelContainer) {
      const progressArc = this.powerLevelContainer.list[0] as Phaser.GameObjects.Graphics;
      if (progressArc) {
        progressArc.clear();
        progressArc.lineStyle(4, 0x00FF00, 1); // Green stroke, thinner for smaller size
        const angle = (percentage / 100) * 360;
        progressArc.beginPath();
        progressArc.arc(0, 0, 39.375, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(-90 + angle), false); // Radius reduced by another 25% from 52.5 to 39.375
        progressArc.stroke();
      }
    }
  }
}
