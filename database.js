// Database functionality
let currentTab = 'monsters';
let monstersData = [];
let itemsData = [];
let mapsData = [];
let spawnsData = [];
let mapGraph = {};
let mapDisplayNames = {};
let monsterTypeTags = {
    scarce: new Set(),
    champion: new Set(),
    mini: new Set(),
    boss: new Set()
};
let monsterTypeTagsReady = false;
let levelPenaltyData = [];
let currentPage = 1;
const itemsPerPage = 50;

// Server rates configuration
const serverRates = {
    baseExp: 6,
    jobExp: 6
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeSearch();
    loadAllData();
});

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    currentTab = tab;
    currentPage = 1;

    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tab) {
            btn.classList.add('active');
        }
    });

    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-tab`).classList.add('active');

    // Update filter options based on tab
    updateFilterOptions(tab);

    // Display data for current tab
    displayCurrentTabData();
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    currentPage = 1;

    if (currentTab === 'monsters') {
        const filtered = monstersData.filter(monster => 
            monster.Name.toLowerCase().includes(searchTerm) ||
            monster.Id.toString().includes(searchTerm)
        );
        displayMonsters(filtered);
    } else if (currentTab === 'items') {
        const filtered = itemsData.filter(item =>
            item.Name.toLowerCase().includes(searchTerm) ||
            item.Id.toString().includes(searchTerm)
        );
        displayItems(filtered);
    } else if (currentTab === 'maps') {
        const filtered = mapsData.filter(map =>
            map.name.toLowerCase().includes(searchTerm)
        );
        displayMaps(filtered);
    }
}

// Update filter options based on current tab
function updateFilterOptions(tab) {
    const filterSection = document.getElementById('filterOptions');
    
    if (tab === 'monsters') {
        if (!monsterTypeTagsReady) {
            filterSection.innerHTML = `
                <div class="filter-loading">
                    <span class="spinner"></span>
                    <span>Loading monster filters...</span>
                </div>
            `;
            return;
        }
        const { minLevel, maxLevel } = getMonsterLevelBounds();
        filterSection.innerHTML = `
            <div class="monster-filters-container">
                <div class="filter-column filter-column-selects">
                    <div class="filter-group">
                        <label>Element</label>
                        <select id="elementFilter">
                            <option value="">All Elements</option>
                            <option value="Neutral">Neutral</option>
                            <option value="Water">Water</option>
                            <option value="Earth">Earth</option>
                            <option value="Fire">Fire</option>
                            <option value="Wind">Wind</option>
                            <option value="Poison">Poison</option>
                            <option value="Holy">Holy</option>
                            <option value="Dark">Dark</option>
                            <option value="Ghost">Ghost</option>
                            <option value="Undead">Undead</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Race</label>
                        <select id="raceFilter">
                            <option value="">All Races</option>
                            <option value="Formless">Formless</option>
                            <option value="Undead">Undead</option>
                            <option value="Brute">Brute</option>
                            <option value="Plant">Plant</option>
                            <option value="Insect">Insect</option>
                            <option value="Fish">Fish</option>
                            <option value="Demon">Demon</option>
                            <option value="DemiHuman">Demi-Human</option>
                            <option value="Angel">Angel</option>
                            <option value="Dragon">Dragon</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Size</label>
                        <select id="sizeFilter">
                            <option value="">All Sizes</option>
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                        </select>
                    </div>
                </div>
                <div class="filter-column filter-column-range">
                    <div class="filter-group level-range-filter">
                        <label>Level Range</label>
                        <div class="level-range-group">
                            <div class="range-row">
                                <span class="range-label">Min</span>
                                <input type="range" id="minLevelRange" min="${minLevel}" max="${maxLevel}" value="${minLevel}" step="1" class="level-range-input">
                                <span id="minLevelValue" class="range-value">${minLevel}</span>
                            </div>
                            <div class="range-row">
                                <span class="range-label">Max</span>
                                <input type="range" id="maxLevelRange" min="${minLevel}" max="${maxLevel}" value="${maxLevel}" step="1" class="level-range-input">
                                <span id="maxLevelValue" class="range-value">${maxLevel}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="filter-column filter-column-types">
                    <div class="filter-group monster-type-filter">
                        <label>Monster Type</label>
                        <div class="monster-type-checkboxes">
                            <label class="checkbox-label">
                                <input type="checkbox" class="monsterTypeFilter" value="scarce">
                                <span>Scarce</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" class="monsterTypeFilter" value="champion">
                                <span>Champion</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" class="monsterTypeFilter" value="mini">
                                <span>Mini Boss</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" class="monsterTypeFilter" value="boss">
                                <span>Boss</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="filter-column filter-column-player-level">
                    <div class="filter-group player-level-filter">
                        <label>Player Level</label>
                        <input type="number" id="playerLevelFilter" placeholder="Enter level" min="1" max="255" class="player-level-input">
                    </div>
                </div>
            </div>
        `;
        document.querySelectorAll('#filterOptions select').forEach(select => {
            select.addEventListener('change', applyFilters);
        });
        document.querySelectorAll('.monsterTypeFilter').forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
        document.getElementById('playerLevelFilter')?.addEventListener('input', applyFilters);
        initializeMonsterLevelRange();
    } else if (tab === 'items') {
        filterSection.innerHTML = `
            <div class="filter-group">
                <label>Type</label>
                <select id="typeFilter">
                    <option value="">All Types</option>
                    <option value="Weapon">Weapon</option>
                    <option value="Armor">Armor</option>
                    <option value="Usable">Usable</option>
                    <option value="Etc">Etc</option>
                    <option value="Card">Card</option>
                    <option value="Ammo">Ammo</option>
                </select>
            </div>
        `;
        document.querySelectorAll('#filterOptions select').forEach(select => {
            select.addEventListener('change', applyFilters);
        });
    } else {
        filterSection.innerHTML = '';
    }
}

function getMonsterLevelBounds() {
    const levels = monstersData.map(monster => monster.Level || 1);
    if (levels.length === 0) {
        return { minLevel: 1, maxLevel: 99 };
    }
    return {
        minLevel: Math.min(...levels),
        maxLevel: Math.max(...levels)
    };
}

function initializeMonsterLevelRange() {
    const minRange = document.getElementById('minLevelRange');
    const maxRange = document.getElementById('maxLevelRange');
    const minValue = document.getElementById('minLevelValue');
    const maxValue = document.getElementById('maxLevelValue');

    if (!minRange || !maxRange || !minValue || !maxValue) {
        return;
    }

    const syncValues = (source) => {
        let minLevel = parseInt(minRange.value, 10);
        let maxLevel = parseInt(maxRange.value, 10);

        if (minLevel > maxLevel) {
            if (source === 'min') {
                maxLevel = minLevel;
                maxRange.value = minLevel;
            } else {
                minLevel = maxLevel;
                minRange.value = maxLevel;
            }
        }

        minValue.textContent = minLevel;
        maxValue.textContent = maxLevel;
    };

    syncValues();

    minRange.addEventListener('input', () => {
        syncValues('min');
        applyFilters();
    });

    maxRange.addEventListener('input', () => {
        syncValues('max');
        applyFilters();
    });
}

async function loadMonsterTypeTags() {
    monsterTypeTagsReady = false;
    const mobDbFiles = [
        '1_mob_db.yml',
        '10_mob_db.yml',
        '20_mob_db.yml',
        '30_mob_db.yml',
        '40_mob_db.yml',
        '50_mob_db.yml',
        '60_mob_db.yml',
        '70_mob_db.yml',
        '80_mob_db.yml',
        '90_mob_db.yml',
        '99_mob_db.yml'
    ];

    const [mobDbTexts, bossText, miniText] = await Promise.all([
        Promise.all(mobDbFiles.map(file => fetch(`/db/${file}`).then(response => response.text()).catch(() => ''))),
        fetch('/db/boss_mob_db.yml').then(response => response.text()).catch(() => ''),
        fetch('/db/mini_mob_db.yml').then(response => response.text()).catch(() => '')
    ]);

    mobDbTexts.forEach(text => parseChampionScarceTags(text));
    parseTagFileIds(bossText, monsterTypeTags.boss);
    parseTagFileIds(miniText, monsterTypeTags.mini);

    monsterTypeTagsReady = true;
    if (currentTab === 'monsters') {
        updateFilterOptions('monsters');
    }
}

function parseChampionScarceTags(text) {
    if (!text) return;

    const lines = text.split(/\r?\n/);
    let nextMonsterTag = null;

    lines.forEach(rawLine => {
        const line = rawLine.trim();

        // Check if this line is a tag marker
        if (line.startsWith('###')) {
            if (/CHAMPION/i.test(line)) {
                nextMonsterTag = 'champion';
            } else if (/SCARCE/i.test(line)) {
                nextMonsterTag = 'scarce';
            }
            return;
        }

        // If we have a pending tag and find a monster ID, apply the tag
        if (nextMonsterTag) {
            const idMatch = line.match(/^-\s*Id:\s*(\d+)/i);
            if (idMatch) {
                monsterTypeTags[nextMonsterTag].add(parseInt(idMatch[1], 10));
                nextMonsterTag = null; // Reset after capturing one ID
            }
        }
    });
}

function parseTagFileIds(text, targetSet) {
    if (!text) return;
    const lines = text.split(/\r?\n/);
    lines.forEach(rawLine => {
        const line = rawLine.trim();
        const idMatch = line.match(/^-\s*Id:\s*(\d+)/i);
        if (idMatch) {
            targetSet.add(parseInt(idMatch[1], 10));
        }
    });
}

async function loadLevelPenalty() {
    try {
        const response = await fetch('/db/level_penalty.yml');
        const text = await response.text();
        parseLevelPenalty(text);
    } catch (error) {
        console.error('Error loading level penalty data:', error);
    }
}

function parseLevelPenalty(text) {
    if (!text) return;
    
    const lines = text.split(/\r?\n/);
    let inExpSection = false;
    
    lines.forEach(rawLine => {
        const line = rawLine.trim();
        
        // Check if we're in the Exp section
        if (line.includes('Type: Exp')) {
            inExpSection = true;
            return;
        }
        
        // Exit Exp section if we hit another Type
        if (inExpSection && line.startsWith('- Type:') && !line.includes('Exp')) {
            inExpSection = false;
            return;
        }
        
        // Parse difference and rate
        if (inExpSection) {
            const diffMatch = line.match(/^-?\s*Difference:\s*(-?\d+)/);
            if (diffMatch) {
                const difference = parseInt(diffMatch[1], 10);
                // Look ahead for Rate on next line or same section
                levelPenaltyData.push({ difference, rate: null, tempIndex: levelPenaltyData.length });
            }
            
            const rateMatch = line.match(/Rate:\s*(\d+)/);
            if (rateMatch && levelPenaltyData.length > 0) {
                const lastEntry = levelPenaltyData[levelPenaltyData.length - 1];
                if (lastEntry.rate === null) {
                    lastEntry.rate = parseInt(rateMatch[1], 10);
                }
            }
        }
    });
    
    // Sort by difference (descending) for easier lookup
    levelPenaltyData.sort((a, b) => b.difference - a.difference);
}

function getExpModifier(monsterLevel, playerLevel) {
    if (!playerLevel || levelPenaltyData.length === 0) {
        return 1.0; // No modifier
    }
    
    const levelDiff = monsterLevel - playerLevel;
    
    // Find the appropriate penalty entry
    for (let i = 0; i < levelPenaltyData.length; i++) {
        if (levelDiff >= levelPenaltyData[i].difference) {
            return levelPenaltyData[i].rate / 100; // Convert percentage to multiplier
        }
    }
    
    // Default to lowest penalty if not found
    if (levelPenaltyData.length > 0) {
        return levelPenaltyData[levelPenaltyData.length - 1].rate / 100;
    }
    
    return 1.0;
}

function applyFilters() {
    currentPage = 1;
    
    if (currentTab === 'monsters') {
        let filtered = [...monstersData];
        
        const elementFilter = document.getElementById('elementFilter')?.value;
        const raceFilter = document.getElementById('raceFilter')?.value;
        const sizeFilter = document.getElementById('sizeFilter')?.value;
        
        if (elementFilter) {
            filtered = filtered.filter(m => m.Element === elementFilter);
        }
        if (raceFilter) {
            filtered = filtered.filter(m => m.Race === raceFilter);
        }
        if (sizeFilter) {
            filtered = filtered.filter(m => m.Size === sizeFilter);
        }

        const minLevel = parseInt(document.getElementById('minLevelRange')?.value, 10);
        const maxLevel = parseInt(document.getElementById('maxLevelRange')?.value, 10);

        if (!Number.isNaN(minLevel) && !Number.isNaN(maxLevel)) {
            filtered = filtered.filter(m => {
                const level = m.Level || 1;
                return level >= minLevel && level <= maxLevel;
            });
        }

        const selectedMonsterTypes = Array.from(document.querySelectorAll('.monsterTypeFilter:checked'))
            .map(cb => cb.value);

        if (selectedMonsterTypes.length > 0) {
            filtered = filtered.filter(monster =>
                selectedMonsterTypes.some(type => monsterTypeTags[type]?.has(monster.Id))
            );
        }
        
        displayMonsters(filtered);
    } else if (currentTab === 'items') {
        let filtered = [...itemsData];
        
        const typeFilter = document.getElementById('typeFilter')?.value;
        
        if (typeFilter) {
            filtered = filtered.filter(i => i.Type === typeFilter);
        }
        
        displayItems(filtered);
    }
}

// Load data from server
async function loadAllData() {
    try {
        // Load monsters
        const monstersResponse = await fetch('/api/monsters');
        monstersData = await monstersResponse.json();
        displayMonsters(monstersData);
        
        // Load items
        const itemsResponse = await fetch('/api/items');
        itemsData = await itemsResponse.json();
        
        // Load spawns
        const spawnsResponse = await fetch('/api/spawns.json');
        spawnsData = await spawnsResponse.json();
        
        // Load map info
        const mapInfoResponse = await fetch('/db/mapinfo.txt');
        const mapInfoText = await mapInfoResponse.text();
        mapDisplayNames = parseMapInfo(mapInfoText);
        
        // Load maps
        const mapTextResponse = await fetch('/db/map.txt');
        const mapText = await mapTextResponse.text();
        const parsedMaps = parseMapNavigatorText(mapText);
        mapsData = parsedMaps.maps;
        mapGraph = parsedMaps.graph;

        await loadMonsterTypeTags();
        await loadLevelPenalty();
        
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load database. Please try again later.');
    }
}

function displayCurrentTabData() {
    if (currentTab === 'monsters') {
        displayMonsters(monstersData);
    } else if (currentTab === 'items') {
        displayItems(itemsData);
    } else if (currentTab === 'maps') {
        displayMaps(mapsData);
    }
}

// Display monsters
function displayMonsters(monsters) {
    const tbody = document.getElementById('monsters-tbody');
    const countEl = document.getElementById('monster-count');
    
    countEl.textContent = `${monsters.length} monsters found`;
    
    if (monsters.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="loading">No monsters found</td></tr>';
        return;
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedMonsters = monsters.slice(start, end);
    
    // Get player level for exp modifier
    const playerLevel = parseInt(document.getElementById('playerLevelFilter')?.value, 10) || null;
    
    tbody.innerHTML = paginatedMonsters.map(monster => {
        const expModifier = playerLevel ? getExpModifier(monster.Level || 1, playerLevel) : 1.0;
        const baseExp = Math.floor((monster.BaseExp || 0) * serverRates.baseExp * expModifier);
        const jobExp = Math.floor((monster.JobExp || 0) * serverRates.jobExp * expModifier);
        
        return `
        <tr onclick="showMonsterDetails(${monster.Id})">
            <td>${monster.Id}</td>
            <td class="monster-name" data-monster-id="${monster.Id}">
                <img src="https://static.divine-pride.net/images/mobs/png/${monster.Id}.png" 
                     alt="${monster.Name}" 
                     class="monster-sprite-small"
                     onerror="this.style.display='none'">
                <span>${monster.Name}</span>
            </td>
            <td>${monster.Level || 1}</td>
            <td>${formatNumber(monster.Hp || 1)}</td>
            <td>${monster.Element || 'Neutral'}${monster.ElementLevel || 1}</td>
            <td>${monster.Race || 'Formless'}</td>
            <td>${monster.Size || 'Small'}</td>
            <td>${formatNumber(baseExp)}</td>
            <td>${formatNumber(jobExp)}</td>
        </tr>
    `;
    }).join('');
    
    createPagination('monsters', monsters.length);
}

// Display items
function displayItems(items) {
    const tbody = document.getElementById('items-tbody');
    const countEl = document.getElementById('item-count');
    
    countEl.textContent = `${items.length} items found`;
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="loading">No items found</td></tr>';
        return;
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = items.slice(start, end);
    
    tbody.innerHTML = paginatedItems.map(item => `
        <tr onclick="showItemDetails(${item.Id})">
            <td>${item.Id}</td>
            <td>${item.Name}</td>
            <td>${item.Type || 'Etc'}</td>
            <td>${item.Weight || 0}</td>
            <td>${formatNumber(item.Buy || 0)}z</td>
            <td>${formatNumber(item.Sell || 0)}z</td>
            <td>${item.Slots || 0}</td>
            <td>${item.Defense || '-'}</td>
            <td>${item.Attack || '-'}</td>
        </tr>
    `).join('');
    
    createPagination('items', items.length);
}

// Display maps
function displayMaps(maps) {
    const grid = document.getElementById('maps-grid');
    const countEl = document.getElementById('map-count');
    
    countEl.textContent = `${maps.length} maps found`;
    
    if (maps.length === 0) {
        grid.innerHTML = '<div class="loading">No maps found</div>';
        return;
    }
    
    grid.innerHTML = maps.map(map => `
        <div class="map-card" onclick="exploreMap('${map.name}')">
            <div class="map-type-badge ${map.type.toLowerCase()}">${map.type}</div>
            <h3>${map.name}</h3>
            <p class="map-id">${formatMapName(map.name)}</p>
            <div class="map-card-footer">
                <span class="explore-btn">🧭 Explore</span>
            </div>
        </div>
    `).join('');
}

// Parse mapinfo.txt to extract display names
function parseMapInfo(text) {
    const displayNames = {};
    const lines = text.split(/\r?\n/);
    let currentMap = null;
    let mainTitle = null;
    let subTitle = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check for map entry like ["mapname.rsw"]
        const mapMatch = line.match(/\["([^"]+\.rsw)"\]/);
        if (mapMatch) {
            // Save previous entry if exists
            if (currentMap && mainTitle) {
                const mapKey = currentMap.replace('.rsw', '');
                displayNames[mapKey] = { mainTitle, subTitle };
            }
            currentMap = mapMatch[1];
            mainTitle = null;
            subTitle = null;
        }
        
        // Extract mainTitle
        const mainTitleMatch = line.match(/mainTitle\s*=\s*"([^"]+)"/);
        if (mainTitleMatch) {
            mainTitle = mainTitleMatch[1];
        }
        
        // Extract subTitle
        const subTitleMatch = line.match(/subTitle\s*=\s*"([^"]+)"/);
        if (subTitleMatch) {
            subTitle = subTitleMatch[1];
        }
    }
    
    // Save last entry if exists
    if (currentMap && mainTitle) {
        const mapKey = currentMap.replace('.rsw', '');
        displayNames[mapKey] = { mainTitle, subTitle };
    }
    
    return displayNames;
}

// Format map name for display
function formatMapName(mapName, includeSubtitle = true, forceSubtitle = false) {
    // Use parsed map info if available
    if (mapDisplayNames[mapName]) {
        const { mainTitle, subTitle } = mapDisplayNames[mapName];
        
        // Check if this is a city - if so, only show mainTitle (unless forceSubtitle is true)
        const mapData = mapsData.find(m => m.name === mapName);
        const isCity = mapData && mapData.type === 'City';
        
        if ((isCity && !forceSubtitle) || !includeSubtitle) {
            return mainTitle;
        }
        
        return subTitle ? `${mainTitle} ${subTitle}` : mainTitle;
    }
    
    // Fallback to manual mapping for common cities
    const cityNames = {
        'prontera': 'Prontera',
        'geffen': 'Geffen',
        'morocc': 'Morroc',
        'alberta': 'Alberta',
        'payon': 'Payon',
        'payo_mem': 'Payon',
        'izlude': 'Izlude',
        'aldebaran': 'Al De Baran',
        'lutie': 'Lutie',
        'comodo': 'Comodo',
        'yuno': 'Juno',
        'amatsu': 'Amatsu',
        'gonryun': 'Kunlun',
        'umbala': 'Umbala',
        'niflheim': 'Niflheim',
        'louyang': 'Louyang',
        'ayothaya': 'Ayothaya',
        'einbroch': 'Einbroch',
        'einbech': 'Einbech',
        'lighthalzen': 'Lighthalzen',
        'hugel': 'Hugel',
        'rachel': 'Rachel',
        'veins': 'Veins',
        'moscovia': 'Moscovia',
        'brasilis': 'Brasilis',
        'dewata': 'Dewata',
        'malangdo': 'Malangdo',
        'malaya': 'Malaya',
        'eclage': 'Eclage',
        'lasagna': 'Lasagna'
    };
    
    return cityNames[mapName] || mapName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function inferMapType(mapName, isHeader) {
    if (isHeader) {
        // Parse tag from map name like "alberta (city)" or "prt_fild08 (field)"
        const tagMatch = mapName.match(/\((\w+)\)$/);
        if (tagMatch) {
            const tag = tagMatch[1].toLowerCase();
            return tag.charAt(0).toUpperCase() + tag.slice(1);
        }
        // No tag means dungeon
        return 'Dungeon';
    }
    if (/(?:^|_)(dun|tower|prison|maze|sewb|cas|chyard|knt|anthell|orcsdun)/i.test(mapName)) {
        return 'Dungeon';
    }
    return 'Field';
}

function formatDirectionLabel(direction) {
    const lower = direction.toLowerCase();
    if (lower === 'next') {
        return 'Next';
    }
    if (lower === 'previous') {
        return 'Previous';
    }
    if (lower === 'center') {
        return 'Center';
    }

    return direction
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function parseMapNavigatorText(text) {
    const graph = {};
    const mapSet = new Set();
    const mapTypes = {};
    let currentMap = null;

    const ensureMap = (name) => {
        if (!name) {
            return;
        }
        mapSet.add(name);
        if (!mapTypes[name]) {
            mapTypes[name] = inferMapType(name, false);
        }
    };

    const addEdge = (from, to, direction) => {
        if (!from || !to) {
            return;
        }
        ensureMap(to);
        if (!graph[from]) {
            graph[from] = [];
        }
        // Avoid duplicates
        if (graph[from].some(edge => edge.map === to && edge.direction === direction)) {
            return;
        }
        graph[from].push({ map: to, direction });
    };

    const parseDestinations = (value) => {
        if (!value) {
            return [];
        }
        return value.split(',').map(v => v.trim()).filter(Boolean);
    };

    const isMapHeader = (line) => {
        // Map headers can be like "alberta (city)" or "prt_fild08 (field)" or just "anthell02"
        return line && !line.includes(':') && /^[a-z0-9_-]+(\s*\([a-z]+\))?$/i.test(line);
    };

    text.split(/\r?\n/).forEach(rawLine => {
        const line = rawLine.trim();
        if (!line || line.startsWith('//')) {
            return;
        }

        // Check if this is a map header
        if (isMapHeader(line)) {
            // Extract map name without tag (e.g., "alberta (city)" -> "alberta")
            currentMap = line.split(/\s*\(/)[0];
            ensureMap(currentMap);
            mapTypes[currentMap] = inferMapType(line, true);
            return;
        }

        // Parse direction entries
        if (line.includes(':') && currentMap) {
            const colonIndex = line.indexOf(':');
            const direction = line.substring(0, colonIndex).trim().toLowerCase();
            const value = line.substring(colonIndex + 1).trim();
            
            if (!value) {
                return; // Empty direction
            }

            const destinations = parseDestinations(value);
            destinations.forEach(dest => {
                addEdge(currentMap, dest, direction);
            });
        }
    });

    const maps = Array.from(mapSet)
        .sort((a, b) => a.localeCompare(b))
        .map(name => ({
            name,
            type: mapTypes[name] || 'Field'
        }));

    return { maps, graph };
}

// Explore map function
function exploreMap(mapName) {
    const modal = document.getElementById('mapModal');
    const currentMapName = document.getElementById('currentMapName');
    const currentMapTitle = document.getElementById('currentMapTitle');
    const currentMapImage = document.getElementById('currentMapImage');
    const warpsList = document.getElementById('warpsList');
    const spawnsContainer = document.getElementById('spawnsContainer');
    
    // Show full display name at the top (mainTitle + subTitle)
    currentMapName.textContent = formatMapName(mapName, true, true);
    // Show map ID below the image
    currentMapTitle.textContent = mapName;
    currentMapImage.src = `https://www.divine-pride.net/img/map/original/${mapName}`;
    currentMapImage.style.display = 'block';
    warpsList.innerHTML = '<div class="loading">Loading warps...</div>';
    spawnsContainer.innerHTML = '';
    
    modal.style.display = 'block';
    
    // Get map type
    const mapData = mapsData.find(m => m.name === mapName);
    const mapType = mapData ? mapData.type : 'Field';
    
    const connections = mapGraph[mapName] || [];
    if (connections.length === 0) {
        warpsList.innerHTML = '<div class="no-warps">No adjacent maps from this location</div>';
    } else {
        const connectionsByDest = {};
        connections.forEach(connection => {
            if (!connectionsByDest[connection.map]) {
                connectionsByDest[connection.map] = [];
            }
            connectionsByDest[connection.map].push(connection.direction);
        });

        warpsList.innerHTML = Object.entries(connectionsByDest).map(([destMap, directions]) => {
            const uniqueDirections = [...new Set(directions)];
            const directionsWithIcons = uniqueDirections.map(direction =>
                `${formatDirectionLabel(direction)} ${getDirectionIcon(direction)}`
            ).join(', ');

            return `
                <div class="warp-card" onclick="exploreMap('${destMap}')">
                    <div class="warp-map-preview">
                        <img src="https://www.divine-pride.net/img/map/original/${destMap}" 
                             alt="${formatMapName(destMap)}" 
                             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22%23ddd%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>🗺️</text></svg>'">
                    </div>
                    <div class="warp-card-info">
                        <h4>${destMap}</h4>
                        <p class="warp-dest-id">${formatMapName(destMap)}</p>
                        <p class="warp-direction">${directionsWithIcons}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Show monster spawns for fields and dungeons
    if (mapType === 'Field' || mapType === 'Dungeon') {
        const mapSpawns = spawnsData.filter(spawn => spawn.map === mapName);
        
        if (mapSpawns.length > 0) {
            // Group spawns by monster
            const spawnsByMonster = {};
            mapSpawns.forEach(spawn => {
                if (!spawnsByMonster[spawn.mobId]) {
                    spawnsByMonster[spawn.mobId] = {
                        mobId: spawn.mobId,
                        mobName: spawn.mobName,
                        amount: 0,
                        respawnTime: spawn.respawnTime
                    };
                }
                spawnsByMonster[spawn.mobId].amount += spawn.amount;
            });
            
            const spawnsHtml = Object.values(spawnsByMonster).map(spawn => {
                const monster = monstersData.find(m => m.Id === spawn.mobId);
                const level = monster ? monster.Level : '?';
                const respawnMinutes = Math.floor(spawn.respawnTime / 60000);
                const respawnSeconds = Math.floor((spawn.respawnTime % 60000) / 1000);
                const respawnDisplay = respawnMinutes > 0 
                    ? `${respawnMinutes}m ${respawnSeconds}s`
                    : `${respawnSeconds}s`;
                
                return `
                    <div class="spawn-item" onclick="closeMapModalAndShowMonster(${spawn.mobId})">
                        <img src="https://static.divine-pride.net/images/mobs/png/${spawn.mobId}.png" 
                             alt="${spawn.mobName}"
                             class="spawn-sprite"
                             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23f0f0f0%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>?</text></svg>'">
                        <div class="spawn-info">
                            <div class="spawn-name">${spawn.mobName}</div>
                            <div class="spawn-details">
                                <span class="spawn-level">Lv ${level}</span>
                                <span class="spawn-amount">×${spawn.amount}</span>
                                <span class="spawn-timer">⏱️ ${respawnDisplay}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            spawnsContainer.innerHTML = `
                <div class="spawns-section">
                    <h3>Monster Spawns</h3>
                    <div class="spawns-list">
                        ${spawnsHtml}
                    </div>
                </div>
            `;
        }
    }
}

// Get direction icon (cardinal + dungeon directions)
function getDirectionIcon(direction) {
    const base = direction.toLowerCase().split(/\s+/)[0];
    const icons = {
        north: '⬆️',
        south: '⬇️',
        east: '➡️',
        west: '⬅️',
        center: '🎯',
        next: '⬇️',
        previous: '⬆️'
    };
    return icons[base] || '🧭';
}

// Pagination
function createPagination(type, totalItems) {
    const paginationEl = document.getElementById(`${type}-pagination`);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">Previous</button>`;
    
    // Page numbers
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    
    // Next button
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next</button>`;
    
    paginationEl.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    displayCurrentTabData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show monster details in modal
function showMonsterDetails(monsterId) {
    const monster = monstersData.find(m => m.Id === monsterId);
    if (!monster) return;
    
    // Fetch detailed monster info including spawns from the API
    fetch(`/api/monsters/${monsterId}`)
        .then(response => response.json())
        .then(detailedMonster => {
            displayMonsterModal(detailedMonster);
        })
        .catch(error => {
            console.error('Error fetching monster details:', error);
            displayMonsterModal(monster);
        });
}

function displayMonsterModal(monster) {
    const modal = document.getElementById('monsterModal');
    const details = document.getElementById('monsterDetails');
    
    let dropsHtml = '';
    if (monster.Drops && monster.Drops.length > 0) {
        dropsHtml = `
            <div class="detail-section">
                <h3>Drops</h3>
                <table class="drops-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${monster.Drops.map(drop => `
                            <tr>
                                <td>${drop.Item}</td>
                                <td>${((drop.Rate / 10000) * 100).toFixed(2)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    let spawnsHtml = '';
    if (monster.spawns && monster.spawns.length > 0) {
        spawnsHtml = `
            <div class="detail-section">
                <h3>Spawn Locations</h3>
                <table class="drops-table">
                    <thead>
                        <tr>
                            <th>Map</th>
                            <th>Amount</th>
                            <th>Respawn Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${monster.spawns.map(spawn => `
                            <tr>
                                    <td><span class="spawn-map-link" onclick="closeMonsterModalAndShowMap('${spawn.map}')">${spawn.map}</span></td>
                                <td>${spawn.amount}</td>
                                <td>${formatRespawnTime(spawn.respawnTime)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    details.innerHTML = `
        <div class="monster-header">
            <img src="https://static.divine-pride.net/images/mobs/png/${monster.Id}.png" 
                 alt="${monster.Name}" 
                 class="monster-sprite"
                 onerror="this.style.display='none'">
            <div class="monster-title-section">
                <h2>${monster.Name}</h2>
            </div>
        </div>
        
        <div class="detail-columns">
            <div class="detail-column-left">
                <div class="detail-section">
                    <h3>Basic Information</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <div class="detail-label">ID</div>
                            <div class="detail-value">${monster.Id}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Level</div>
                            <div class="detail-value">${monster.Level || 1}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">HP</div>
                            <div class="detail-value">${formatNumber(monster.Hp || 1)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Element</div>
                            <div class="detail-value">${monster.Element || 'Neutral'} ${monster.ElementLevel || 1}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Race</div>
                            <div class="detail-value">${monster.Race || 'Formless'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Size</div>
                            <div class="detail-value">${monster.Size || 'Small'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Stats</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <div class="detail-label">STR</div>
                            <div class="detail-value">${monster.Str || 1}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">ATK</div>
                            <div class="detail-value">${monster.Attack || 0} ~ ${monster.Attack2 || 0}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">DEF</div>
                            <div class="detail-value">${monster.Defense || 0}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">AGI</div>
                            <div class="detail-value">${monster.Agi || 1}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">MATK</div>
                            <div class="detail-value">${Math.floor((monster.Int || 1) + (monster.Int || 1) / 5)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">MDEF</div>
                            <div class="detail-value">${monster.MagicDefense || 0}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">VIT</div>
                            <div class="detail-value">${monster.Vit || 1}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">HIT</div>
                            <div class="detail-value">${200 + (monster.Level || 1) + (monster.Agi || 1)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Flee</div>
                            <div class="detail-value">${100 + (monster.Level || 1) + (monster.Agi || 1)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">INT</div>
                            <div class="detail-value">${monster.Int || 1}</div>
                        </div>
                        <div class="detail-item"></div>
                        <div class="detail-item"></div>
                        <div class="detail-item">
                            <div class="detail-label">DEX</div>
                            <div class="detail-value">${monster.Dex || 1}</div>
                        </div>
                        <div class="detail-item"></div>
                        <div class="detail-item"></div>
                        <div class="detail-item">
                            <div class="detail-label">LUK</div>
                            <div class="detail-value">${monster.Luk || 1}</div>
                        </div>
                        <div class="detail-item"></div>
                        <div class="detail-item"></div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Experience</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <div class="detail-label">Base EXP</div>
                            <div class="detail-value">${formatNumber((monster.BaseExp || 0) * serverRates.baseExp)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Job EXP</div>
                            <div class="detail-value">${formatNumber((monster.JobExp || 0) * serverRates.jobExp)}</div>
                        </div>
                        ${monster.MvpExp ? `
                            <div class="detail-item">
                                <div class="detail-label">MVP EXP</div>
                                <div class="detail-value">${formatNumber(monster.MvpExp * serverRates.baseExp)}</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div class="detail-column-right">
                ${spawnsHtml}
                ${dropsHtml}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Show item details in modal
function showItemDetails(itemId) {
    const item = itemsData.find(i => i.Id === itemId);
    if (!item) return;
    
    const modal = document.getElementById('itemModal');
    const details = document.getElementById('itemDetails');
    
    details.innerHTML = `
        <h2>${item.Name}</h2>
        <div class="detail-section">
            <h3>Basic Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">ID</div>
                    <div class="detail-value">${item.Id}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Type</div>
                    <div class="detail-value">${item.Type || 'Etc'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Weight</div>
                    <div class="detail-value">${item.Weight || 0}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Buy Price</div>
                    <div class="detail-value">${formatNumber(item.Buy || 0)}z</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Sell Price</div>
                    <div class="detail-value">${formatNumber(item.Sell || 0)}z</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Slots</div>
                    <div class="detail-value">${item.Slots || 0}</div>
                </div>
                ${item.Attack ? `
                    <div class="detail-item">
                        <div class="detail-label">Attack</div>
                        <div class="detail-value">${item.Attack}</div>
                    </div>
                ` : ''}
                ${item.Defense ? `
                    <div class="detail-item">
                        <div class="detail-label">Defense</div>
                        <div class="detail-value">${item.Defense}</div>
                    </div>
                ` : ''}
                ${item.Range ? `
                    <div class="detail-item">
                        <div class="detail-label">Range</div>
                        <div class="detail-value">${item.Range}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Helper function to close map modal and show monster details
function closeMapModalAndShowMonster(monsterId) {
    const mapModal = document.getElementById('mapModal');
    mapModal.style.display = 'none';
    showMonsterDetails(monsterId);
}

// Close modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// Utility functions
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatRespawnTime(ms) {
    if (ms === 0) return 'Instant';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function showError(message) {
    // Simple error display - can be enhanced with better UI
    alert(message);
}



// Helper function to close monster modal and show map details
function closeMonsterModalAndShowMap(mapName) {
    const monsterModal = document.getElementById('monsterModal');
    monsterModal.style.display = 'none';
    exploreMap(mapName);
}


