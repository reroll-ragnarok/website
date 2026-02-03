const express = require('express');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Cache for database data
let monstersCache = null;
let itemsCache = null;
let mapsCache = null;
let spawnsCache = null;

// Load YAML database files
function loadYAMLFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        // Try to parse with strict mode off to handle duplicate keys
        const data = yaml.parse(fileContent, { 
            strict: false,
            uniqueKeys: false 
        });
        return data.Body || [];
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error.message);
        // Try loading just the base db without re/ folder
        return [];
    }
}

// Load monsters from public/db/*.yml files
function loadMonsters() {
    if (monstersCache) return monstersCache;
    
    const rerollDir = path.join(__dirname, 'public', 'db');
    let allMonsters = [];
    
    try {
        const files = fs.readdirSync(rerollDir).filter(file => file.endsWith('.yml'));
        
        files.forEach(file => {
            const filePath = path.join(rerollDir, file);
            const monsters = loadYAMLFile(filePath);
            allMonsters.push(...monsters);
        });
        
        console.log(`Loaded ${allMonsters.length} monsters from ${files.length} files in public/db/`);
    } catch (error) {
        console.error('Error loading monsters from public/db/:', error.message);
    }
    
    monstersCache = allMonsters;
    return allMonsters;
}

// Load spawn information from public/db/mobs.txt
function loadSpawns() {
    if (spawnsCache) return spawnsCache;
    
    const mobsFilePath = path.join(__dirname, 'public', 'db', 'mobs.txt');
    const spawns = [];
    
    try {
        const fileContent = fs.readFileSync(mobsFilePath, 'utf8');
        const lines = fileContent.split('\n');
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            
            // Skip comments and empty lines
            if (!trimmedLine || trimmedLine.startsWith('//')) {
                return;
            }
            
            // Parse monster spawn format: mapname,x,y[,xs,ys] monster name mobid,amount,respawntime[,respawntime2]
            // Example: prt_fild08,0,0	monster	Poring	1002,150,5000
            const spawnMatch = trimmedLine.match(/^([a-z0-9_]+),(\d+),(\d+)(?:,(\d+),(\d+))?\s+(?:monster|boss_monster)\s+([^\t]+)\t(\d+),(\d+)(?:,(\d+))?/);
            
            if (spawnMatch) {
                const [, mapName, x, y, xs, ys, mobName, mobId, amount, respawnTime] = spawnMatch;
                
                spawns.push({
                    map: mapName,
                    x: parseInt(x),
                    y: parseInt(y),
                    xs: xs ? parseInt(xs) : 0,
                    ys: ys ? parseInt(ys) : 0,
                    mobId: parseInt(mobId),
                    mobName: mobName.trim(),
                    amount: parseInt(amount),
                    respawnTime: respawnTime ? parseInt(respawnTime) : 0
                });
            }
        });
        
        spawnsCache = spawns;
        console.log(`Loaded ${spawns.length} monster spawns from public/db/mobs.txt`);
        return spawns;
    } catch (error) {
        console.error('Error loading spawns:', error.message);
        return [];
    }
}

// Load items from item_db.yml
function loadItems() {
    if (itemsCache) return itemsCache;
    
    const itemDbDir = path.join(__dirname, 'public', 'db');
    let allItems = [];
    
    try {
        // Load from multiple item database files
        const itemFiles = ['item_db_equip.yml', 'item_db_usable.yml', 'item_db_etc.yml'];
        
        itemFiles.forEach(file => {
            const filePath = path.join(itemDbDir, file);
            if (fs.existsSync(filePath)) {
                const items = loadYAMLFile(filePath);
                allItems.push(...items);
            }
        });
        
        console.log(`Loaded ${allItems.length} items from ${itemFiles.length} files in public/db/`);
    } catch (error) {
        console.error('Error loading items from public/db/:', error.message);
    }
    
    itemsCache = allItems;
    return allItems;
}

// Load maps from public/db/runemidgard.txt
function loadMaps() {
    if (mapsCache) return mapsCache;
    
    const warpFilePath = path.join(__dirname, 'public', 'db', 'runemidgard.txt');
    const maps = new Map(); // Use Map to track unique map names
    
    try {
        const fileContent = fs.readFileSync(warpFilePath, 'utf8');
        const lines = fileContent.split('\n');
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            
            // Skip comments and empty lines
            if (!trimmedLine || trimmedLine.startsWith('//')) {
                return;
            }
            
            // Parse warp format: mapname,x,y,size warp warpname size,size,destmap,destx,desty
            const warpMatch = trimmedLine.match(/^([a-z0-9_]+),\d+,\d+/);
            if (warpMatch) {
                const mapName = warpMatch[1];
                
                if (!maps.has(mapName)) {
                    // Determine map type based on name patterns
                    let mapType = 'Field';
                    if (mapName.includes('dun') || mapName.includes('_in')) mapType = 'Dungeon';
                    else if (mapName.includes('pvp')) mapType = 'PVP';
                    else if (mapName.includes('gvg')) mapType = 'GVG';
                    else if (mapName.match(/^(prontera|geffen|morocc|alberta|payon|payon_mem|izlude|aldebaran|lutie|comodo|yuno|amatsu|gonryun|umbala|niflheim|louyang|ayothaya|einbroch|einbech|lighthalzen|hugel|rachel|veins|moscovia|brasilis|dewata|malangdo|malaya|eclage|lasagna)$/)) {
                        mapType = 'City';
                    }
                    
                    maps.set(mapName, {
                        id: maps.size + 1,
                        name: mapName,
                        type: mapType
                    });
                }
            }
        });
        
        const mapArray = Array.from(maps.values());
        mapsCache = mapArray;
        console.log(`Loaded ${mapArray.length} maps from public/db/runemidgard.txt`);
        return mapArray;
    } catch (error) {
        console.error('Error loading maps:', error.message);
        return [];
    }
}

// API Routes
app.get('/api/monsters', (req, res) => {
    try {
        const monsters = loadMonsters();
        res.json(monsters);
    } catch (error) {
        console.error('Error fetching monsters:', error);
        res.status(500).json({ error: 'Failed to load monsters' });
    }
});

app.get('/api/monsters/:id', (req, res) => {
    try {
        const monsters = loadMonsters();
        const spawns = loadSpawns();
        const monster = monsters.find(m => m.Id === parseInt(req.params.id));
        
        if (monster) {
            // Add spawn information to the monster data
            const monsterSpawns = spawns.filter(s => s.mobId === monster.Id);
            const enrichedMonster = {
                ...monster,
                spawns: monsterSpawns
            };
            res.json(enrichedMonster);
        } else {
            res.status(404).json({ error: 'Monster not found' });
        }
    } catch (error) {
        console.error('Error fetching monster:', error);
        res.status(500).json({ error: 'Failed to load monster' });
    }
});

app.get('/api/items', (req, res) => {
    try {
        const items = loadItems();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Failed to load items' });
    }
});

app.get('/api/items/:id', (req, res) => {
    try {
        const items = loadItems();
        const item = items.find(i => i.Id === parseInt(req.params.id));
        
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Failed to load item' });
    }
});

app.get('/api/maps', (req, res) => {
    try {
        const maps = loadMaps();
        res.json(maps);
    } catch (error) {
        console.error('Error fetching maps:', error);
        res.status(500).json({ error: 'Failed to load maps' });
    }
});

app.get('/api/spawns', (req, res) => {
    try {
        const spawns = loadSpawns();
        res.json(spawns);
    } catch (error) {
        console.error('Error fetching spawns:', error);
        res.status(500).json({ error: 'Failed to load spawns' });
    }
});

app.get('/api/spawns/map/:mapName', (req, res) => {
    try {
        const spawns = loadSpawns();
        const mapSpawns = spawns.filter(s => s.map === req.params.mapName);
        res.json(mapSpawns);
    } catch (error) {
        console.error('Error fetching spawns for map:', error);
        res.status(500).json({ error: 'Failed to load spawns' });
    }
});

app.get('/api/maps/:mapName/warps', (req, res) => {
    try {
        const warpFilePath = path.join(__dirname, 'public', 'db', 'runemidgard.txt');
        const warps = [];
        const mapName = req.params.mapName;
        
        const fileContent = fs.readFileSync(warpFilePath, 'utf8');
        const lines = fileContent.split('\n');
        
        // Function to determine direction based on coordinates (simplified to 4 cardinal directions)
        const getDirection = (x, y) => {
            // Calculate distance from center (175, 175)
            const centerX = 175;
            const centerY = 175;
            
            const deltaX = x - centerX;
            const deltaY = y - centerY;
            
            // Determine primary direction based on which delta is larger
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                // Y axis is dominant
                return deltaY > 0 ? 'North' : 'South';
            } else {
                // X axis is dominant
                return deltaX > 0 ? 'East' : 'West';
            }
        };
        
        let currentScriptMap = null;
        let inScriptBlock = false;
        const scriptDestinations = new Set();
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('//')) return;
            
            // Check for script warp start
            const scriptMatch = trimmedLine.match(/^([a-z0-9_]+),(\d+),(\d+),\d+\s+script\s+([^\s]+)/);
            if (scriptMatch && scriptMatch[1] === mapName) {
                currentScriptMap = scriptMatch[1];
                inScriptBlock = true;
                scriptDestinations.clear();
                return;
            }
            
            // If in script block, look for warp destinations
            if (inScriptBlock) {
                const warpDestMatch = trimmedLine.match(/warp\s+"([a-z0-9_]+)"/);
                if (warpDestMatch) {
                    scriptDestinations.add(warpDestMatch[1]);
                }
                
                // End of script block
                if (trimmedLine.includes('}')) {
                    inScriptBlock = false;
                    // Add all unique destinations from script
                    scriptDestinations.forEach(destMap => {
                        warps.push({
                            sourceMap: currentScriptMap,
                            sourceX: 175, // Center for script warps
                            sourceY: 175,
                            direction: 'North', // Default for script warps
                            warpName: 'script_warp',
                            destMap: destMap,
                            destX: 0,
                            destY: 0
                        });
                    });
                    currentScriptMap = null;
                }
                return;
            }
            
            // Parse regular warp format: mapname,x,y,0\twarp\twarpname\tsize,size,destmap,destx,desty
            const warpRegex = /^([a-z0-9_]+),(\d+),(\d+),\d+\s+warp\s+([^\s]+)\s+\d+,\d+,([a-z0-9_]+),(\d+),(\d+)/;
            const match = trimmedLine.match(warpRegex);
            
            if (match && match[1] === mapName) {
                const sourceX = parseInt(match[2]);
                const sourceY = parseInt(match[3]);
                
                warps.push({
                    sourceMap: match[1],
                    sourceX: sourceX,
                    sourceY: sourceY,
                    direction: getDirection(sourceX, sourceY),
                    warpName: match[4],
                    destMap: match[5],
                    destX: parseInt(match[6]),
                    destY: parseInt(match[7])
                });
            }
        });
        
        res.json(warps);
    } catch (error) {
        console.error('Error fetching warps for map:', error);
        res.status(500).json({ error: 'Failed to load warps' });
    }
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`reROll website running on http://localhost:${PORT}`);
    console.log('Loading database files...');
    
    // Preload data
    const monsters = loadMonsters();
    const items = loadItems();
    const maps = loadMaps();
    const spawns = loadSpawns();
    
    console.log(`Loaded ${monsters.length} monsters`);
    console.log(`Loaded ${items.length} items`);
    console.log(`Loaded ${maps.length} maps`);
    console.log(`Loaded ${spawns.length} spawns`);
    console.log('Server ready!');
});

// Patcher
const serveIndex = require('serve-index');

// Patcher
app.use('/patch/data', serveIndex(path.join(process.cwd(), '/patch/data'), { icons: true }));
app.use('/patch/', serveIndex(path.join(process.cwd(), '/patch'), { icons: true }));

app.use('/patch/data', express.static(path.join(process.cwd(), 'patch/data')));
app.use('/patch/', express.static(path.join(process.cwd(), 'patch/')));