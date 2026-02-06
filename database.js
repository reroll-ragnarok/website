// Database functionality
let currentTab = 'monsters';
let monstersData = [];
let itemsData = [];
let mapsData = [];
let mapGraph = {};
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
        filterSection.innerHTML = `
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
        `;
        document.querySelectorAll('#filterOptions select').forEach(select => {
            select.addEventListener('change', applyFilters);
        });
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
        
        // Load maps
        const mapTextResponse = await fetch('/db/map.txt');
        const mapText = await mapTextResponse.text();
        const parsedMaps = parseMapNavigatorText(mapText);
        mapsData = parsedMaps.maps;
        mapGraph = parsedMaps.graph;
        
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
    
    tbody.innerHTML = paginatedMonsters.map(monster => `
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
            <td>${formatNumber(monster.BaseExp || 0)}</td>
            <td>${formatNumber(monster.JobExp || 0)}</td>
        </tr>
    `).join('');
    
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
            <h3>${formatMapName(map.name)}</h3>
            <p class="map-id">${map.name}</p>
            <div class="map-card-footer">
                <span class="explore-btn">🧭 Explore</span>
            </div>
        </div>
    `).join('');
}

// Format map name for display
function formatMapName(mapName) {
    // Convert map names to readable format
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
        return 'City';
    }
    if (/(?:^|_)(dun|tower|prison|maze|sewb|cas|chyard|knt|anthell|orcsdun)/i.test(mapName)) {
        return 'Dungeon';
    }
    return 'Field';
}

function getReverseDirection(direction) {
    const lower = direction.toLowerCase();
    if (lower === 'center') {
        return 'center';
    }
    if (lower === 'next') {
        return 'previous';
    }
    if (lower === 'previous') {
        return 'next';
    }

    const parts = lower.split(/\s+/);
    const base = parts[0];
    const suffix = parts.slice(1).join(' ');
    const opposites = {
        north: 'south',
        south: 'north',
        east: 'west',
        west: 'east',
        northeast: 'southwest',
        northwest: 'southeast',
        southeast: 'northwest',
        southwest: 'northeast'
    };

    if (!opposites[base]) {
        return null;
    }

    return suffix ? `${opposites[base]} ${suffix}` : opposites[base];
}

function formatDirectionLabel(direction) {
    const lower = direction.toLowerCase();
    if (lower === 'next') {
        return 'Next floor';
    }
    if (lower === 'previous') {
        return 'Previous floor';
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
    const headerLinks = new Set();
    let currentHeader = null;

    const ensureMap = (name, isHeader = false) => {
        if (!name) {
            return;
        }
        mapSet.add(name);
        if (!mapTypes[name]) {
            mapTypes[name] = inferMapType(name, isHeader);
        }
    };

    const addEdge = (from, to, direction) => {
        if (!from || !to) {
            return;
        }
        if (!graph[from]) {
            graph[from] = [];
        }
        if (graph[from].some(edge => edge.map === to && edge.direction === direction)) {
            return;
        }
        graph[from].push({ map: to, direction });
    };

    const addBidirectionalEdge = (from, to, direction) => {
        addEdge(from, to, direction);
        const reverseDirection = getReverseDirection(direction);
        if (reverseDirection) {
            addEdge(to, from, reverseDirection);
        }
    };

    const isHeaderLine = line => !line.includes(':') && !line.includes('->') && /^[A-Za-z0-9_-]+$/.test(line);

    const parsePath = path => path
        .split('->')
        .map(part => part.trim())
        .filter(Boolean);

    text.split(/\r?\n/).forEach(rawLine => {
        const line = rawLine.trim();
        if (!line || line.startsWith('//')) {
            return;
        }

        if (isHeaderLine(line)) {
            currentHeader = line;
            ensureMap(line, true);
            return;
        }

        let directionLabel = null;
        let pathText = line;
        if (line.includes(':')) {
            const parts = line.split(':');
            directionLabel = parts.shift().trim();
            pathText = parts.join(':').trim();
        }

        const nodes = parsePath(pathText);
        if (nodes.length === 0) {
            return;
        }

        nodes.forEach(node => ensureMap(node));

        if (currentHeader) {
            let headerDirection = directionLabel;
            const headerKey = `${currentHeader}|${nodes[0]}`;
            if (!headerDirection && !headerLinks.has(headerKey)) {
                headerDirection = 'center';
            }
            if (headerDirection) {
                addBidirectionalEdge(currentHeader, nodes[0], headerDirection);
                headerLinks.add(headerKey);
            }
        }

        for (let i = 0; i < nodes.length - 1; i += 1) {
            addEdge(nodes[i], nodes[i + 1], 'next');
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
    
    currentMapName.textContent = formatMapName(mapName);
    currentMapTitle.textContent = formatMapName(mapName);
    currentMapImage.src = `https://www.divine-pride.net/img/map/original/${mapName}`;
    currentMapImage.style.display = 'block';
    warpsList.innerHTML = '<div class="loading">Loading warps...</div>';
    
    modal.style.display = 'block';
    
    const connections = mapGraph[mapName] || [];
    if (connections.length === 0) {
        warpsList.innerHTML = '<div class="no-warps">No adjacent maps from this location</div>';
        return;
    }

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
                    <h4>${formatMapName(destMap)}</h4>
                    <p class="warp-dest-id">${destMap}</p>
                    <p class="warp-direction">${directionsWithIcons}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Get direction icon (cardinal + dungeon directions)
function getDirectionIcon(direction) {
    const base = direction.toLowerCase().split(/\s+/)[0];
    const icons = {
        north: '⬆️',
        south: '⬇️',
        east: '➡️',
        west: '⬅️',
        northeast: '↗️',
        northwest: '↖️',
        southeast: '↘️',
        southwest: '↙️',
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
                                <td>${spawn.map}</td>
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


