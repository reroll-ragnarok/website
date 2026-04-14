const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

console.log('🚀 Building site...\n');

// Create api directory
const apiDir = path.join(__dirname, 'api');
if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
}

// Load YAML files
function loadYAMLFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = yaml.parse(fileContent, { strict: false, uniqueKeys: false });
        return data.Body || [];
    } catch (error) {
        console.error(`❌ Error loading ${filePath}:`, error.message);
        return [];
    }
}

// Load monsters
function loadMonsters() {
    const dbDir = path.join(__dirname, 'db');
    let allMonsters = [];
    
    try {
        const files = fs.readdirSync(dbDir).filter(file => file.endsWith('_mob_db.yml'));
        files.forEach(file => {
            const monsters = loadYAMLFile(path.join(dbDir, file));
            console.log(`  📄 ${file}: ${monsters.length} monsters`);
            allMonsters.push(...monsters);
        });
        console.log(`✅ Loaded ${allMonsters.length} total monsters from ${files.length} files`);
    } catch (error) {
        console.error('❌ Error loading monsters:', error.message);
    }
    
    return allMonsters;
}

// Load spawns
function loadSpawns() {
    const mobsFilePath = path.join(__dirname, 'db', 'mobs.txt');
    const spawns = [];
    
    try {
        const fileContent = fs.readFileSync(mobsFilePath, 'utf8');
        const lines = fileContent.split('\n');
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('//')) return;
            
            const match = trimmed.match(/^([a-z0-9_]+),(\d+),(\d+)(?:,(\d+),(\d+))?\s+(?:monster|boss_monster)\s+([^\t]+)\t(\d+),(\d+)(?:,(\d+))?/);
            if (match) {
                const [, mapName, x, y, xs, ys, mobName, mobId, amount, respawnTime] = match;
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
        
        console.log(`✅ Loaded ${spawns.length} spawns`);
    } catch (error) {
        console.error('❌ Error loading spawns:', error.message);
    }
    
    return spawns;
}

// Load items
function loadItems() {
    const dbDir = path.join(__dirname, 'db');
    let allItems = [];
    
    try {
        const itemFiles = ['item_db_equip.yml', 'item_db_usable.yml', 'item_db_etc.yml', 'item_db_card.yml', 'item_db_costumes.yml'];
        
        itemFiles.forEach(file => {
            const filePath = path.join(dbDir, file);
            if (fs.existsSync(filePath)) {
                const items = loadYAMLFile(filePath);
                console.log(`  📄 ${file}: ${items.length} items`);
                allItems.push(...items);
            } else {
                console.log(`  ⚠️  ${file}: not found, skipping`);
            }
        });
        console.log(`✅ Loaded ${allItems.length} total items`);
    } catch (error) {
        console.error('❌ Error loading items:', error.message);
    }
    
    return allItems;
}

// Load maps
function loadMaps() {
    const warpFilePath = path.join(__dirname, 'db', 'runemidgard.txt');
    const maps = new Map();
    
    try {
        const fileContent = fs.readFileSync(warpFilePath, 'utf8');
        const lines = fileContent.split('\n');
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('//')) return;
            
            const match = trimmed.match(/^([a-z0-9_]+),\d+,\d+/);
            if (match) {
                const mapName = match[1];
                if (!maps.has(mapName)) {
                    let mapType = 'Field';
                    if (mapName.includes('dun') || mapName.includes('_in')) mapType = 'Dungeon';
                    else if (mapName.includes('pvp')) mapType = 'PVP';
                    else if (mapName.includes('gvg')) mapType = 'GVG';
                    else if (mapName.match(/^(prontera|geffen|morocc|alberta|payon|izlude|aldebaran|lutie|comodo|yuno|amatsu|gonryun|umbala|niflheim|louyang|ayothaya|einbroch|einbech|lighthalzen|hugel|rachel|veins|moscovia|brasilis|dewata|malangdo|malaya|eclage|lasagna)$/)) {
                        mapType = 'City';
                    }
                    maps.set(mapName, { id: maps.size + 1, name: mapName, type: mapType });
                }
            }
        });
        
        const mapArray = Array.from(maps.values());
        console.log(`✅ Loaded ${mapArray.length} maps`);
        return mapArray;
    } catch (error) {
        console.error('❌ Error loading maps:', error.message);
        return [];
    }
}

// Load warps
function loadWarps() {
    const warpFilePath = path.join(__dirname, 'db', 'runemidgard.txt');
    const warpsByMap = {};
    
    try {
        const fileContent = fs.readFileSync(warpFilePath, 'utf8');
        const lines = fileContent.split('\n');
        
        const getDirection = (x, y) => {
            const deltaX = x - 175;
            const deltaY = y - 175;
            return Math.abs(deltaY) > Math.abs(deltaX) 
                ? (deltaY > 0 ? 'North' : 'South')
                : (deltaX > 0 ? 'East' : 'West');
        };
        
        let currentScriptMap = null;
        let inScriptBlock = false;
        let scriptDestinations = new Set();
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('//')) return;
            
            // Script warps
            const scriptMatch = trimmed.match(/^([a-z0-9_]+),(\d+),(\d+),\d+\s+script\s+([^\s]+)/);
            if (scriptMatch) {
                currentScriptMap = scriptMatch[1];
                inScriptBlock = true;
                scriptDestinations.clear();
                return;
            }
            
            if (inScriptBlock) {
                const warpDestMatch = trimmed.match(/warp\s+"([a-z0-9_]+)"/);
                if (warpDestMatch) scriptDestinations.add(warpDestMatch[1]);
                
                if (trimmed.includes('}')) {
                    inScriptBlock = false;
                    if (!warpsByMap[currentScriptMap]) warpsByMap[currentScriptMap] = [];
                    scriptDestinations.forEach(destMap => {
                        warpsByMap[currentScriptMap].push({
                            sourceMap: currentScriptMap,
                            sourceX: 175,
                            sourceY: 175,
                            direction: 'North',
                            warpName: 'script_warp',
                            destMap: destMap,
                            destX: 0,
                            destY: 0
                        });
                    });
                }
                return;
            }
            
            // Regular warps
            const warpMatch = trimmed.match(/^([a-z0-9_]+),(\d+),(\d+),\d+\s+warp\s+([^\s]+)\s+\d+,\d+,([a-z0-9_]+),(\d+),(\d+)/);
            if (warpMatch) {
                const [, sourceMap, x, y, warpName, destMap, destX, destY] = warpMatch;
                if (!warpsByMap[sourceMap]) warpsByMap[sourceMap] = [];
                warpsByMap[sourceMap].push({
                    sourceMap,
                    sourceX: parseInt(x),
                    sourceY: parseInt(y),
                    direction: getDirection(parseInt(x), parseInt(y)),
                    warpName,
                    destMap,
                    destX: parseInt(destX),
                    destY: parseInt(destY)
                });
            }
        });
        
        console.log(`✅ Loaded warps for ${Object.keys(warpsByMap).length} maps`);
        return warpsByMap;
    } catch (error) {
        console.error('❌ Error loading warps:', error.message);
        return {};
    }
}

// Load lootboxes
function loadLootboxes() {
    const filePath = path.join(__dirname, 'db', 'item_db_group.yml');
    const LOOTBOX_GROUPS = {
        GIFTBOX:          { displayName: 'Gift Box',        boxAegisName: 'Gift_Box'        },
        BLUEBOX:          { displayName: 'Old Blue Box',    boxAegisName: 'Old_Blue_Box'    },
        VIOLETBOX:        { displayName: 'Old Purple Box',  boxAegisName: 'Old_Violet_Box'  },
        CARDALBUM:        { displayName: 'Old Card Album',  boxAegisName: 'Old_Card_Album'  },
    };

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = yaml.parse(fileContent, { strict: false, uniqueKeys: false });
        const body = data.Body || [];

        const result = [];

        body.forEach(entry => {
            const groupName = entry.Group;
            if (!LOOTBOX_GROUPS[groupName]) return;

            const meta = LOOTBOX_GROUPS[groupName];
            const subGroup = entry.SubGroups && entry.SubGroups[0];
            if (!subGroup || !subGroup.List) return;

            const items = subGroup.List.map(i => ({ aegisName: i.Item, rate: i.Rate || 0 }));
            const totalRate = items.reduce((sum, i) => sum + i.rate, 0);

            result.push({
                group: groupName,
                displayName: meta.displayName,
                boxAegisName: meta.boxAegisName,
                totalRate,
                items,
            });
        });

        console.log(`✅ Loaded ${result.length} lootbox groups`);
        return result;
    } catch (error) {
        console.error('❌ Error loading lootboxes:', error.message);
        return [];
    }
}

// Build everything
console.log('📦 Processing database files...\n');

const monsters = loadMonsters();
const spawns = loadSpawns();
const items = loadItems();
const maps = loadMaps();
const warps = loadWarps();
const lootboxes = loadLootboxes();

// Write main JSON files
fs.writeFileSync(path.join(apiDir, 'monsters.json'), JSON.stringify(monsters, null, 2));
fs.writeFileSync(path.join(apiDir, 'spawns.json'), JSON.stringify(spawns, null, 2));
fs.writeFileSync(path.join(apiDir, 'items.json'), JSON.stringify(items, null, 2));
fs.writeFileSync(path.join(apiDir, 'maps.json'), JSON.stringify(maps, null, 2));
fs.writeFileSync(path.join(apiDir, 'warps.json'), JSON.stringify(warps, null, 2));
fs.writeFileSync(path.join(apiDir, 'lootboxes.json'), JSON.stringify(lootboxes, null, 2));

console.log('\n📝 Writing JSON files...');
console.log(`✅ monsters.json`);
console.log(`✅ spawns.json`);
console.log(`✅ items.json`);
console.log(`✅ maps.json`);
console.log(`✅ warps.json`);
console.log(`✅ lootboxes.json`);

// Write individual monster files
const monstersDir = path.join(apiDir, 'monsters');
if (!fs.existsSync(monstersDir)) fs.mkdirSync(monstersDir, { recursive: true });

monsters.forEach(monster => {
    const monsterSpawns = spawns.filter(s => s.mobId === monster.Id);
    fs.writeFileSync(
        path.join(monstersDir, `${monster.Id}.json`),
        JSON.stringify({ ...monster, spawns: monsterSpawns }, null, 2)
    );
});
console.log(`✅ ${monsters.length} individual monster files`);

// Write individual map warp files
const mapsDir = path.join(apiDir, 'maps');
if (!fs.existsSync(mapsDir)) fs.mkdirSync(mapsDir, { recursive: true });

Object.entries(warps).forEach(([mapName, mapWarps]) => {
    fs.writeFileSync(
        path.join(mapsDir, `${mapName}.json`),
        JSON.stringify(mapWarps, null, 2)
    );
});
console.log(`✅ ${Object.keys(warps).length} individual map files`);

console.log('\n✨ Build complete! Your site is ready!\n');
console.log('📁 Generated files in: api/');
console.log('🌐 Deploy the repository root to your hosting provider.');