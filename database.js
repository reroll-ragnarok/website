// Dark Mode Toggle
const initDarkMode = () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const toggleCircle = darkModeToggle.querySelector('.toggle-circle svg');
    
    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateToggleIcon(true);
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isNowDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isNowDarkMode);
        updateToggleIcon(isNowDarkMode);
    });
    
    function updateToggleIcon(isDark) {
        if (isDark) {
            // Moon icon
            toggleCircle.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
        } else {
            // Sun icon
            toggleCircle.innerHTML = '<path d="M12 17.5C14.7614 17.5 17 15.2614 17 12.5C17 9.73858 14.7614 7.5 12 7.5C9.23858 7.5 7 9.73858 7 12.5C7 15.2614 9.23858 17.5 12 17.5Z"/><path d="M12 1.5V3.5M12 21.5V23.5M4.22 4.72L5.64 6.14M18.36 18.86L19.78 20.28M1.5 12.5H3.5M20.5 12.5H22.5M4.22 20.28L5.64 18.86M18.36 6.14L19.78 4.72"/>';
        }
    }
};

// Initialize dark mode immediately
initDarkMode();

// Database functionality
let currentTab = 'monsters';
let monstersData = [];
let itemsData = [];
let mapsData = [];
let spawnsData = [];
let mapGraph = {};
let mapDisplayNames = {};
let cardsData = [];

// Hardcoded effect descriptions for cards whose scripts are too complex to parse generically
const cardEffectOverrides = {
    4144: 'When equipped, grants a Token of Siegfried allowing resurrection upon death (unlimited uses)',
    4147: 'Basic attacks splash in a 9x9 area around the player',
    4137: 'Nullifies weapon size penalty. <br>ATK + 25. <br>MATK + 25',
    4123: 'Removes staggering when hit (Endure effect)',
    4128: '100% immunity to magic damage',
    4198: 'Enables seeing hidden enemies',
};

// Hardcoded effect descriptions for quest reward items whose scripts are complex to parse
const itemEffectOverrides = {
    5110: 'Healing from items +25%',
};

// Headgear quest crafting data
const questsData = [
    { id: 1,  resultId: 18919, resultName: "Jakk Castle Bat",        locations: ["Head_Low"],  requirements: [{ qty: 300, name: "Tooth of Bat", id: 913 }, { qty: 200, name: "Wing of Red Bat", id: 7006 }, { qty: 100, name: "Pumpkin Head", id: 1062 }, { qty: 20, name: "Bat Cage", id: 7214 }, { qty: 1, name: "Familiar Card", id: 4020 }, { qty: 5, name: "Sapphire", id: 726 }, { qty: 1, name: "Amethyst", id: 719 }] },
    { id: 2,  resultId: 5110,  resultName: "Baby Pacifier",           locations: ["Head_Low"],  requirements: [{ qty: 50, name: "Nursing Bottle", id: 7270 }, { qty: 50, name: "Pinafore", id: 7269 }, { qty: 50, name: "Puppet", id: 740 }, { qty: 50, name: "Candy Cane", id: 530 }, { qty: 1, name: "Orc Baby Card", id: 4375 }, { qty: 5, name: "Pearl", id: 722 }, { qty: 1, name: "Aquamarine", id: 720 }] },
    { id: 3,  resultId: 5361,  resultName: "Gangster Scarf",          locations: ["Head_Low"],  requirements: [{ qty: 150, name: "Manacles", id: 1098 }, { qty: 100, name: "Worn-out Prison Uniform", id: 1099 }, { qty: 20, name: "Animal Gore", id: 702 }, { qty: 10, name: "Fabric", id: 1059 }, { qty: 1, name: "Pirate Skel Card", id: 4073 }, { qty: 5, name: "Ruby", id: 723 }, { qty: 1, name: "Garnet", id: 718 }] },
    { id: 4,  resultId: 18666, resultName: "CD In Mouth",             locations: ["Head_Low"],  requirements: [{ qty: 25, name: "Great Nature", id: 997 }, { qty: 25, name: "Rough Wind", id: 996 }, { qty: 25, name: "Flame Heart", id: 994 }, { qty: 25, name: "Mystic Frozen", id: 995 }, { qty: 1, name: "Joker Card", id: 4139 }, { qty: 5, name: "Opal", id: 727 }, { qty: 1, name: "Turquoise", id: 7294 }] },
    { id: 5,  resultId: 5596,  resultName: "Four Leaf Clover",        locations: ["Head_Low"],  requirements: [{ qty: 300, name: "Clover", id: 705 }, { qty: 200, name: "Stem", id: 905 }, { qty: 7, name: "Smoke Powder", id: 6214 }, { qty: 7, name: "Four Leaf Clover", id: 706 }, { qty: 1, name: "Yoyo Card", id: 4051 }, { qty: 5, name: "Emerald", id: 721 }, { qty: 1, name: "Zircon", id: 729 }] },
    { id: 6,  resultId: 5403,  resultName: "Fish In Mouth",           locations: ["Head_Low"],  requirements: [{ qty: 200, name: "Sharp Scale", id: 963 }, { qty: 150, name: "Fish Tail", id: 1023 }, { qty: 100, name: "Squid Ink", id: 1024 }, { qty: 20, name: "Crystal Blue", id: 991 }, { qty: 1, name: "Swordfish Card", id: 4089 }, { qty: 5, name: "Aquamarine", id: 720 }, { qty: 1, name: "Sapphire", id: 726 }] },
    { id: 7,  resultId: 420030,resultName: "Feather In Mouth",        locations: ["Head_Low"],  requirements: [{ qty: 200, name: "Feather of Birds", id: 916 }, { qty: 150, name: "Harpy Feather", id: 7115 }, { qty: 100, name: "Antelope Horn", id: 7106 }, { qty: 20, name: "Wind of Verdure", id: 992 }, { qty: 1, name: "Harpy Card", id: 4325 }, { qty: 5, name: "Topaz", id: 728 }, { qty: 1, name: "Sardonyx", id: 725 }] },
    { id: 8,  resultId: 5358,  resultName: "Peco Ears",               locations: ["Head_Mid"],  requirements: [{ qty: 150, name: "Peco Peco Feather", id: 7101 }, { qty: 100, name: "Sharp Leaf", id: 7100 }, { qty: 20, name: "Antelope Skin", id: 7107 }, { qty: 10, name: "Scale Shell", id: 936 }, { qty: 1, name: "Whisper Card", id: 4102 }, { qty: 5, name: "Sardonyx", id: 725 }, { qty: 1, name: "Topaz", id: 728 }] },
    { id: 9,  resultId: 5090,  resultName: "Goblin Leader Mask",      locations: ["Head_Low", "Head_Mid"], requirements: [{ qty: 150, name: "Cyfar", id: 7053 }, { qty: 100, name: "Moth Dust", id: 1057 }, { qty: 20, name: "Mud Lump", id: 7004 }, { qty: 10, name: "Ogre Tooth", id: 7002 }, { qty: 1, name: "Mummy Card", id: 4106 }, { qty: 5, name: "Garnet", id: 718 }, { qty: 1, name: "Opal", id: 727 }] },
    { id: 10, resultId: 5421,  resultName: "Ears Of Ifrit",           locations: ["Head_Mid"],  requirements: [{ qty: 200, name: "Burning Hair", id: 7122 }, { qty: 150, name: "Alcohol", id: 970 }, { qty: 100, name: "Live Coal", id: 7098 }, { qty: 20, name: "Red Blood", id: 990 }, { qty: 1, name: "Jakk Card", id: 4109 }, { qty: 5, name: "Ruby", id: 723 }, { qty: 1, name: "Garnet", id: 718 }] },
    { id: 11, resultId: 2281,  resultName: "Opera Masque",            locations: ["Head_Mid"],  requirements: [{ qty: 200, name: "Mud Lump", id: 7004 }, { qty: 150, name: "Maneater Root", id: 1033 }, { qty: 100, name: "Tree Root", id: 902 }, { qty: 20, name: "Green Live", id: 993 }, { qty: 1, name: "Giearth Card", id: 4087 }, { qty: 5, name: "Opal", id: 727 }, { qty: 1, name: "Pearl", id: 722 }] },
    { id: 12, resultId: 5286,  resultName: "Pecopeco Hairband",       locations: ["Head_Top"],  requirements: [{ qty: 200, name: "Soft Feather", id: 7063 }, { qty: 100, name: "Harpy Talon", id: 7116 }, { qty: 50, name: "Talon", id: 917 }, { qty: 20, name: "Talon of Griffon", id: 7048 }, { qty: 1, name: "Grand Peco Card", id: 4161 }, { qty: 5, name: "Amethyst", id: 719 }, { qty: 1, name: "Ruby", id: 723 }] },
    { id: 13, resultId: 5388,  resultName: "Snake Head Hat",          locations: ["Head_Top"],  requirements: [{ qty: 200, name: "Venom Canine", id: 937 }, { qty: 100, name: "Shining Scale", id: 954 }, { qty: 50, name: "Poison Spore", id: 7033 }, { qty: 20, name: "Snake Scale", id: 926 }, { qty: 1, name: "Side Winder Card", id: 4117 }, { qty: 5, name: "Zircon", id: 729 }, { qty: 1, name: "Ruby", id: 723 }] },
    { id: 14, resultId: 5531,  resultName: "Baby Dragon Hat",         locations: ["Head_Top"],  requirements: [{ qty: 200, name: "Dragon Skin", id: 7123 }, { qty: 100, name: "Dragon Tail", id: 1037 }, { qty: 50, name: "Wing of Dragonfly", id: 7064 }, { qty: 20, name: "Fang", id: 1063 }, { qty: 1, name: "Penomena Card", id: 4314 }, { qty: 5, name: "Zircon", id: 729 }, { qty: 1, name: "Emerald", id: 721 }] },
    { id: 15, resultId: 5304,  resultName: "Cap Of Blindness",        locations: ["Head_Top"],  requirements: [{ qty: 200, name: "Piece of Black Cloth", id: 7205 }, { qty: 100, name: "Amulet", id: 609 }, { qty: 50, name: "Tattered Clothes", id: 7071 }, { qty: 20, name: "Executioner's Mitten", id: 7017 }, { qty: 1, name: "Injustice Card", id: 4268 }, { qty: 5, name: "Turquoise", id: 7294 }, { qty: 1, name: "Garnet", id: 718 }] },
    { id: 16, resultId: 5380,  resultName: "Fish Head Hat",           locations: ["Head_Top"],  requirements: [{ qty: 200, name: "Fin", id: 951 }, { qty: 100, name: "Heart of Mermaid", id: 950 }, { qty: 50, name: "Gill", id: 956 }, { qty: 20, name: "Tentacle", id: 962 }, { qty: 1, name: "Sea Otter Card", id: 4326 }, { qty: 5, name: "Aquamarine", id: 720 }, { qty: 1, name: "Sapphire", id: 726 }] },
    { id: 17, resultId: 2268,  resultName: "Pipe",                    locations: ["Head_Low"],  requirements: [{ qty: 100, name: "Trunk", id: 1019 }, { qty: 50, name: "Hinalle Leaflet", id: 520 }, { qty: 50, name: "Aloe Leaflet", id: 521 }, { qty: 50, name: "Raccoon Leaf", id: 945 }, { qty: 1, name: "Raydric Card", id: 4133 }, { qty: 10, name: "Tiger Footskin", id: 1030 }, { qty: 5, name: "Royal Jelly", id: 526 }] },
    { id: 18, resultId: 5272,  resultName: "Long Tongue",             locations: ["Head_Low"],  requirements: [{ qty: 100, name: "Tongue", id: 1015 }, { qty: 50, name: "Reptile Tongue", id: 903 }, { qty: 50, name: "Sticky Mucus", id: 938 }, { qty: 50, name: "Ancient Lips", id: 1054 }, { qty: 1, name: "Matyr Card", id: 4097 }, { qty: 10, name: "Jaws of Ant", id: 1014 }, { qty: 5, name: "Emperium", id: 714 }] },
    { id: 19, resultId: 5878,  resultName: "Miracle Blue Rose",       locations: ["Head_Low"],  requirements: [{ qty: 100, name: "Ice Cubic", id: 7066 }, { qty: 50, name: "Ice Cream", id: 536 }, { qty: 50, name: "Maneater Blossom", id: 1032 }, { qty: 50, name: "Young Twig", id: 7018 }, { qty: 1, name: "Clock Card", id: 4299 }, { qty: 10, name: "Fang of Garm", id: 7036 }, { qty: 5, name: "Armlet of Obedience", id: 639 }] },
    { id: 20, resultId: 2267,  resultName: "Cigarette",               locations: ["Head_Low"],  requirements: [{ qty: 100, name: "Coal", id: 1003 }, { qty: 50, name: "Burnt Tree", id: 7068 }, { qty: 50, name: "Grasshopper's Leg", id: 940 }, { qty: 50, name: "Horrendous Mouth", id: 958 }, { qty: 1, name: "Archer Skeleton Card", id: 4094 }, { qty: 10, name: "Tooth", id: 1044 }, { qty: 5, name: "Mother's Nightmare", id: 7020 }] },
    { id: 21, resultId: 5204,  resultName: "Rudolph's Nose",          locations: ["Head_Low"],  requirements: [{ qty: 200, name: "Round Shell", id: 1096 }, { qty: 100, name: "Elder Pixie's Moustache", id: 1040 }, { qty: 100, name: "Mole Whiskers", id: 1017 }, { qty: 20, name: "Rose Quartz", id: 7293 }, { qty: 1, name: "Soldier Skeleton Card", id: 4086 }, { qty: 10, name: "Ice Scale", id: 7562 }, { qty: 5, name: "Fang of Garm", id: 7036 }] },
    { id: 22, resultId: 19083, resultName: "Mask of Hero",            locations: ["Head_Mid"],  requirements: [{ qty: 200, name: "Cultish Masque", id: 1045 }, { qty: 100, name: "China", id: 736 }, { qty: 100, name: "Solid Shell", id: 943 }, { qty: 20, name: "Armor Piece of Dullahan", id: 7210 }, { qty: 1, name: "High Orc Card", id: 4322 }, { qty: 10, name: "Tutankhamen's Mask", id: 7114 }, { qty: 5, name: "Union of Tribe", id: 658 }] },
    { id: 23, resultId: 2296,  resultName: "Binoculars",              locations: ["Head_Mid"],  requirements: [{ qty: 200, name: "Steel", id: 999 }, { qty: 100, name: "Glass Bead", id: 746 }, { qty: 100, name: "Spool", id: 7217 }, { qty: 20, name: "Broken Shield Piece", id: 7108 }, { qty: 1, name: "Dragon Tail Card", id: 4178 }, { qty: 10, name: "Gemstone", id: 7300 }, { qty: 5, name: "Shine Spear Blade", id: 7109 }] },
    { id: 24, resultId: 5972,  resultName: "Chatty Parrot",           locations: ["Head_Mid"],  requirements: [{ qty: 200, name: "Torn Magic Book", id: 7117 }, { qty: 100, name: "Bill of Birds", id: 925 }, { qty: 100, name: "Feather", id: 949 }, { qty: 20, name: "Rouge", id: 739 }, { qty: 1, name: "Elder Willow Card", id: 4052 }, { qty: 10, name: "Treasure Box", id: 7444 }, { qty: 5, name: "Round Feather", id: 6393 }] },
    { id: 25, resultId: 5081,  resultName: "Crown of Mistress",       locations: ["Head_Top"],  requirements: [{ qty: 300, name: "Moth Wings", id: 1058 }, { qty: 200, name: "Bee Sting", id: 939 }, { qty: 200, name: "Powder of Butterfly", id: 924 }, { qty: 20, name: "Pearl", id: 722 }, { qty: 1, name: "Carat Card", id: 4288 }, { qty: 10, name: "Royal Jelly", id: 526 }, { qty: 5, name: "Gold", id: 969 }] },
    { id: 26, resultId: 18570, resultName: "Ancient Gold Ornament",   locations: ["Head_Top"],  requirements: [{ qty: 60, name: "Old Portrait", id: 7014 }, { qty: 60, name: "Old Shuriken", id: 7072 }, { qty: 40, name: "Old Manteau", id: 7207 }, { qty: 20, name: "Turquoise", id: 7294 }, { qty: 1, name: "Anubis Card", id: 4138 }, { qty: 10, name: "Ora Ora", id: 701 }, { qty: 5, name: "Emperium", id: 714 }] },
    { id: 27, resultId: 5564,  resultName: "Crown of Deceit",         locations: ["Head_Top", "Head_Mid"], requirements: [{ qty: 300, name: "Coral Reef", id: 7013 }, { qty: 200, name: "Insect Feeler", id: 928 }, { qty: 100, name: "Tough Vines", id: 7197 }, { qty: 20, name: "Ruby", id: 723 }, { qty: 1, name: "Clock Tower Manager Card", id: 4229 }, { qty: 10, name: "Mother's Nightmare", id: 7020 }, { qty: 5, name: "Ora Ora", id: 701 }] },
    { id: 28, resultId: 5214,  resultName: "Moonlight Flower Hat",    locations: ["Head_Top"],  requirements: [{ qty: 200, name: "Star Dust", id: 1001 }, { qty: 200, name: "Nine Tails", id: 1022 }, { qty: 200, name: "Animal Skin", id: 919 }, { qty: 20, name: "Topaz", id: 728 }, { qty: 1, name: "Bapho Jr. Card", id: 4129 }, { qty: 10, name: "Zero Merchant Bell", id: 23647 }, { qty: 5, name: "Tiger's Skin", id: 1029 }] },
    { id: 29, resultId: 19469, resultName: "Sacred Crown",            locations: ["Head_Top"],  requirements: [{ qty: 300, name: "Memento", id: 934 }, { qty: 200, name: "Rotten Bandage", id: 930 }, { qty: 200, name: "Lantern", id: 1041 }, { qty: 20, name: "Aquamarine", id: 720 }, { qty: 1, name: "Loli Ruri Card", id: 4191 }, { qty: 10, name: "Sacred Marks", id: 1009 }, { qty: 5, name: "Armlet of Obedience", id: 639 }] },
    { id: 30, resultId: 5224,  resultName: "Evolved Orc Hero Helm",   locations: ["Head_Top"],  requirements: [{ qty: 300, name: "Orcish Voucher", id: 931 }, { qty: 200, name: "Blue Hair", id: 1034 }, { qty: 200, name: "Fluff", id: 914 }, { qty: 20, name: "Emerald", id: 721 }, { qty: 1, name: "Khalitzburg Card", id: 4136 }, { qty: 10, name: "Round Feather", id: 6393 }, { qty: 5, name: "Gold", id: 969 }] },
    { id: 31, resultId: 18539, resultName: "Skull Cap",               locations: ["Head_Top"],  requirements: [{ qty: 300, name: "Skull", id: 7005 }, { qty: 200, name: "Ectoplasm", id: 7220 }, { qty: 100, name: "Clattering Skull", id: 7752 }, { qty: 20, name: "Sapphire", id: 726 }, { qty: 1, name: "Dark Illusion Card", id: 4169 }, { qty: 10, name: "Skull Ring", id: 2609 }, { qty: 5, name: "Cardinal Jewel", id: 724 }] },
    { id: 32, resultId: 5518,  resultName: "Gigantic Majestic Goat",  locations: ["Head_Top"],  requirements: [{ qty: 300, name: "Evil Horn", id: 923 }, { qty: 200, name: "Little Evil Horn", id: 1038 }, { qty: 200, name: "Antelope Horn", id: 7106 }, { qty: 20, name: "Zircon", id: 729 }, { qty: 1, name: "Andre Card", id: 4043 }, { qty: 10, name: "Wild Boar's Mane", id: 1028 }, { qty: 5, name: "Cardinal Jewel", id: 724 }] },
    { id: 33, resultId: 5685,  resultName: "Army Cap",                locations: ["Head_Top"],  requirements: [{ qty: 300, name: "Reins", id: 1064 }, { qty: 200, name: "Burning Horseshoe", id: 7120 }, { qty: 200, name: "Conch", id: 961 }, { qty: 20, name: "Sardonyx", id: 725 }, { qty: 1, name: "Peco Peco Card", id: 4031 }, { qty: 10, name: "Cardinal Jewel", id: 724 }, { qty: 5, name: "Rojerta Piece", id: 7211 }] },
    { id: 34, resultId: 18555, resultName: "General Helmet",          locations: ["Head_Top"],  requirements: [{ qty: 60, name: "Red Frame", id: 734 }, { qty: 200, name: "Turtle Shell", id: 967 }, { qty: 200, name: "Dragon Scale", id: 1036 }, { qty: 20, name: "Garnet", id: 718 }, { qty: 1, name: "Raydric Archer Card", id: 4187 }, { qty: 10, name: "Union of Tribe", id: 658 }, { qty: 5, name: "Royal Jelly", id: 526 }] },
    { id: 35, resultId: 18574, resultName: "Lord of Death",           locations: ["Head_Top"],  requirements: [{ qty: 300, name: "Horseshoe", id: 944 }, { qty: 200, name: "Helm of Dullahan", id: 7209 }, { qty: 200, name: "Needle of Alarm", id: 1095 }, { qty: 20, name: "Opal", id: 727 }, { qty: 1, name: "Bloody Murderer Card", id: 4214 }, { qty: 10, name: "Shine Spear Blade", id: 7109 }, { qty: 5, name: "Skull Ring", id: 2609 }] },
    { id: 36, resultId: 5166,  resultName: "Sphinx Hat",              locations: ["Head_Top"],  requirements: [{ qty: 300, name: "Broken Shell", id: 7070 }, { qty: 200, name: "Armor Piece of Dullahan", id: 7210 }, { qty: 40, name: "Crystal Mirror", id: 747 }, { qty: 20, name: "Amethyst", id: 719 }, { qty: 1, name: "Soldier Card", id: 4220 }, { qty: 10, name: "Rojerta Piece", id: 7211 }, { qty: 5, name: "Broken Pharaoh Symbol", id: 7113 }] },
];

let monsterTypeTags = {
    scarce: new Set(),
    champion: new Set(),
    mini: new Set(),
    boss: new Set()
};
let monsterTypeTagsReady = false;
let currentPage = 1;
let currentFilteredData = null; // Track currently filtered/searched data (null means no filter active)
let itemSortField = null; // Current sort field for items (e.g., 'Sell')
let itemSortDirection = 'asc'; // 'asc' or 'desc'
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
    currentFilteredData = null; // Reset filtered data when switching tabs
    itemSortField = null; // Reset sort field when switching tabs
    itemSortDirection = 'asc'; // Reset sort direction
    
    // Clear search input and update placeholder
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    if (tab === 'cards') {
        searchInput.placeholder = 'Search by name, ID or effect...';
    } else if (tab === 'quests') {
        searchInput.placeholder = 'Search by name or ingredient...';
    } else {
        searchInput.placeholder = 'Search by name or ID...';
    }

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
        currentFilteredData = filtered;
        displayMonsters(filtered);
    } else if (currentTab === 'items') {
        const filtered = itemsData.filter(item =>
            item.Name.toLowerCase().includes(searchTerm) ||
            item.Id.toString().includes(searchTerm)
        );
        // Reset sort when searching
        itemSortField = null;
        itemSortDirection = 'asc';
        currentFilteredData = filtered;
        displayItems(filtered);
    } else if (currentTab === 'maps') {
        const filtered = mapsData.filter(map =>
            map.name.toLowerCase().includes(searchTerm)
        );
        currentFilteredData = filtered;
        displayMaps(filtered);
    } else if (currentTab === 'cards') {
        const filtered = cardsData.filter(card => {
            if (card.Name.toLowerCase().includes(searchTerm) || card.Id.toString().includes(searchTerm)) return true;
            const effect = (cardEffectOverrides[card.Id] || parseItemScript(card.Script, card.EquipScript)).toLowerCase();
            return effect.replace(/<br>/g, ' ').includes(searchTerm);
        });
        currentFilteredData = filtered;
        displayCards(filtered);
    } else if (currentTab === 'quests') {
        const filtered = questsData.filter(q =>
            q.resultName.toLowerCase().includes(searchTerm) ||
            q.requirements.some(r => r.name.toLowerCase().includes(searchTerm))
        );
        currentFilteredData = filtered;
        displayQuests(filtered);
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
                    <option value="Healing">Healing</option>
                    <option value="Usable">Usable</option>
                    <option value="Etc">Etc</option>
                    <option value="Card">Card</option>
                </select>
            </div>
        `;
        document.querySelectorAll('#filterOptions select').forEach(select => {
            select.addEventListener('change', applyFilters);
        });
    } else if (tab === 'maps') {
        filterSection.innerHTML = `
            <div class="map-filters-container">
                <div class="filter-group">
                    <label>Map Type</label>
                    <div class="map-type-checkboxes">
                        <label class="checkbox-label">
                            <input type="checkbox" class="mapTypeFilter" value="City" checked>
                            <span>City</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="mapTypeFilter" value="Field" checked>
                            <span>Field</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="mapTypeFilter" value="Dungeon" checked>
                            <span>Dungeon</span>
                        </label>
                    </div>
                </div>
                <div class="filter-group">
                    <label>
                        Player Level
                        <span class="help-icon">
                            ?
                            <span class="help-overlay">Shows maps with monsters that won't have negative experience penalty</span>
                        </span>
                    </label>
                    <input type="number" id="mapPlayerLevelFilter" placeholder="Enter level" min="1" max="255" class="player-level-input">
                </div>
            </div>
        `;
        document.querySelectorAll('.mapTypeFilter').forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
        document.getElementById('mapPlayerLevelFilter')?.addEventListener('input', applyFilters);
    } else if (tab === 'cards') {
        filterSection.innerHTML = `
            <div class="filter-group">
                <label>Compound Slot</label>
                <select id="cardSlotFilter">
                    <option value="">All Slots</option>
                    <option value="Weapon">Weapon</option>
                    <option value="Shield">Shield</option>
                    <option value="Armor">Armor</option>
                    <option value="Headgear">Headgear</option>
                    <option value="Footgear">Footgear</option>
                    <option value="Garment">Garment</option>
                    <option value="Accessory">Accessory</option>
                </select>
            </div>
        `;
        document.getElementById('cardSlotFilter')?.addEventListener('change', applyFilters);
    } else if (tab === 'quests') {
        filterSection.innerHTML = `
            <div class="filter-group">
                <label>Headgear Slot</label>
                <select id="questLocationFilter">
                    <option value="">All Slots</option>
                    <option value="Head_Top">Top Headgear</option>
                    <option value="Head_Mid">Mid Headgear</option>
                    <option value="Head_Low">Low Headgear</option>
                </select>
            </div>
        `;
        document.getElementById('questLocationFilter')?.addEventListener('change', applyFilters);
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
    // Level penalty rules are now hardcoded based on level_penalty.txt
    // No need to load external file
}

function getExpModifier(monsterLevel, playerLevel) {
    if (!playerLevel) {
        return 1.0; // No modifier
    }
    
    const levelDiff = monsterLevel - playerLevel;
    
    // Apply level penalty rules based on level_penalty.txt
    if (levelDiff >= 20) return 0.10;
    if (levelDiff >= 11) return 0.40;
    if (levelDiff === 10) return 1.50;
    if (levelDiff === 9) return 1.45;
    if (levelDiff === 8) return 1.40;
    if (levelDiff === 7) return 1.35;
    if (levelDiff === 6) return 1.30;
    if (levelDiff === 5) return 1.25;
    if (levelDiff === 4) return 1.20;
    if (levelDiff === 3) return 1.15;
    if (levelDiff === 2) return 1.10;
    if (levelDiff === 1) return 1.05;
    if (levelDiff === 0) return 1.00;
    if (levelDiff >= -10) return 1.00;
    if (levelDiff >= -19) return 0.40;
    return 0.10;
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
        
        currentFilteredData = filtered;
        displayMonsters(filtered);
    } else if (currentTab === 'items') {
        let filtered = [...itemsData];
        
        const typeFilter = document.getElementById('typeFilter')?.value;
        
        if (typeFilter) {
            // Merge DelayConsume into Usable category
            if (typeFilter === 'Usable') {
                filtered = filtered.filter(i => i.Type === 'Usable' || i.Type === 'DelayConsume');
            } else {
                filtered = filtered.filter(i => i.Type === typeFilter);
            }
        }
        
        // Reset sort when filter is applied
        itemSortField = null;
        itemSortDirection = 'asc';
        currentFilteredData = filtered;
        displayItems(filtered);
    } else if (currentTab === 'maps') {
        let filtered = [...mapsData];
        
        // Filter by map type (multi-select)
        const selectedMapTypes = Array.from(document.querySelectorAll('.mapTypeFilter:checked'))
            .map(cb => cb.value);
        
        if (selectedMapTypes.length > 0 && selectedMapTypes.length < 3) {
            filtered = filtered.filter(m => selectedMapTypes.includes(m.type));
        }
        
        // Filter by player level (maps with monsters ±10 levels)
        const playerLevel = parseInt(document.getElementById('mapPlayerLevelFilter')?.value, 10) || null;
        
        if (playerLevel) {
            filtered = filtered.filter(map => {
                // Get spawns for this map
                const mapSpawns = spawnsData.filter(spawn => spawn.map === map.name);
                
                // Check if any monster in this map is within ±10 levels of player
                return mapSpawns.some(spawn => {
                    const monster = monstersData.find(m => m.Id === spawn.mobId);
                    if (!monster) return false;
                    
                    const monsterLevel = monster.Level || 1;
                    const levelDiff = Math.abs(monsterLevel - playerLevel);
                    return levelDiff <= 10;
                });
            });
        }
        
        currentFilteredData = filtered;
        displayMaps(filtered);
    } else if (currentTab === 'cards') {
        let filtered = [...cardsData];

        const slotFilter = document.getElementById('cardSlotFilter')?.value;
        if (slotFilter) {
            filtered = filtered.filter(card => getCardCompoundSlot(card) === slotFilter);
        }

        currentFilteredData = filtered;
        displayCards(filtered);
    } else if (currentTab === 'quests') {
        let filtered = [...questsData];

        const locFilter = document.getElementById('questLocationFilter')?.value;
        if (locFilter) {
            filtered = filtered.filter(q => q.locations.includes(locFilter));
        }

        currentFilteredData = filtered;
        displayQuests(filtered);
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
        
        // Extract cards from items
        cardsData = itemsData.filter(item => item.Type === 'Card');
        
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
        
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load database. Please try again later.');
    }
}

function displayCurrentTabData() {
    // If we have filtered data (even if empty), use it; otherwise use full dataset
    if (currentFilteredData !== null) {
        if (currentTab === 'monsters') {
            displayMonsters(currentFilteredData);
        } else if (currentTab === 'items') {
            displayItems(currentFilteredData);
        } else if (currentTab === 'maps') {
            displayMaps(currentFilteredData);
        } else if (currentTab === 'cards') {
            displayCards(currentFilteredData);
        } else if (currentTab === 'quests') {
            displayQuests(currentFilteredData);
        }
    } else {
        // No filters/search active, show all data
        if (currentTab === 'monsters') {
            displayMonsters(monstersData);
        } else if (currentTab === 'items') {
            displayItems(itemsData);
        } else if (currentTab === 'maps') {
            displayMaps(mapsData);
        } else if (currentTab === 'cards') {
            displayCards(cardsData);
        } else if (currentTab === 'quests') {
            displayQuests(questsData);
        }
    }
}

// Display monsters
function displayMonsters(monsters) {
    const tbody = document.getElementById('monsters-tbody');
    const countEl = document.getElementById('monster-count');
    
    // Filter out invalid monsters (those without names)
    const validMonsters = monsters.filter(m => m.Name && m.Id);
    
    countEl.textContent = `${validMonsters.length} monsters found`;
    
    if (validMonsters.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="loading">No monsters found</td></tr>';
        return;
    }
    
    // Sort monsters by level (ascending), then by ID
    const sortedMonsters = [...validMonsters].sort((a, b) => {
        const levelA = a.Level || 1;
        const levelB = b.Level || 1;
        if (levelA !== levelB) {
            return levelA - levelB;
        }
        return a.Id - b.Id;
    });
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedMonsters = sortedMonsters.slice(start, end);
    
    // Get player level for exp modifier
    const playerLevel = parseInt(document.getElementById('playerLevelFilter')?.value, 10) || null;
    
    tbody.innerHTML = paginatedMonsters.map(monster => {
        const expModifier = playerLevel ? getExpModifier(monster.Level || 1, playerLevel) : 1.0;
        const baseExp = Math.floor((monster.BaseExp || 0) * serverRates.baseExp * expModifier);
        const jobExp = Math.floor((monster.JobExp || 0) * serverRates.jobExp * expModifier);
        
        // Determine exp color class based on modifier
        let expClass = '';
        if (playerLevel) {
            if (expModifier > 1.0) {
                expClass = 'exp-bonus';
            } else if (expModifier < 1.0) {
                expClass = 'exp-penalty';
            }
        }
        
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
            <td class="${expClass}">${formatNumber(baseExp)}</td>
            <td class="${expClass}">${formatNumber(jobExp)}</td>
        </tr>
    `;
    }).join('');
    
    createPagination('monsters', validMonsters.length);
}

// Display items
function displayItems(items) {
    const tbody = document.getElementById('items-tbody');
    const countEl = document.getElementById('item-count');
    
    countEl.textContent = `${items.length} items found`;
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="loading">No items found</td></tr>';
        return;
    }
    
    // Determine which item types are in the list
    const itemTypes = new Set(items.map(i => i.Type));
    const isAllTypes = itemTypes.size > 1; // Multiple types = All Types filter
    const displayType = isAllTypes ? 'AllTypes' : getDisplayType(itemTypes);
    
    // Sort items if a sort field is set
    let sortedItems = items;
    if (itemSortField) {
        sortedItems = [...items].sort((a, b) => {
            let aValue, bValue;
            
            if (itemSortField === 'Sell') {
                aValue = a.Sell || Math.floor((a.Buy || 0) / 2);
                bValue = b.Sell || Math.floor((b.Buy || 0) / 2);
            } else {
                aValue = a[itemSortField] || 0;
                bValue = b[itemSortField] || 0;
            }
            
            // Handle numeric comparison
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return itemSortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
            
            // Handle string comparison
            return itemSortDirection === 'asc' 
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });
    }
    
    // Update table headers
    updateItemTableHeaders(displayType, itemTypes);
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = sortedItems.slice(start, end);
    
    const colSpan = isAllTypes ? 5 : 6; // Adjust colspan for no items message
    tbody.innerHTML = paginatedItems.map(item => {
        const sell = item.Sell || Math.floor((item.Buy || 0) / 2);
        return `
        <tr onclick="showItemDetails(${item.Id})">
            <td class="col-id">${item.Id}</td>
            <td class="col-icon">
                <img src="https://www.divine-pride.net/img/items/item/iRO/${item.Id}" 
                     alt="${item.Name}" 
                     class="item-sprite-small"
                     onerror="this.style.display='none'">
            </td>
            <td class="col-name">${item.Name}</td>
            <td class="col-type">${item.Type || 'Etc'}</td>
            ${isAllTypes ? `<td>${formatNumber(sell)}z</td>` : getItemTypeColumns(item, displayType, sell)}
        </tr>
    `;
    }).join('');
    
    createPagination('items', items.length);
}

// Helper function to determine the primary display type
function getDisplayType(typeSet) {
    const typeOrder = ['Weapon', 'Armor', 'Healing', 'Usable', 'DelayConsume', 'Etc', 'Card'];
    for (const type of typeOrder) {
        if (typeSet.has(type)) {
            return type;
        }
    }
    return 'Etc';
}

// Helper function to get the appropriate columns for an item type
function getItemTypeColumns(item, displayType, sell) {
    switch (displayType) {
        case 'Weapon':
            return `<td>${item.Attack || 0}</td><td>${item.Slots || 0}</td>`;
        case 'Armor':
            return `<td>${item.Defense || 0}</td><td>${item.Slots || 0}</td>`;
        case 'Healing':
        case 'Usable':
        case 'DelayConsume':
            return `<td>${formatNumber(sell)}z</td><td>${item.Weight || 0}</td>`;
        case 'Etc':
            return `<td>${formatNumber(sell)}z</td><td>${item.Weight || 0}</td>`;
        case 'Card':
            return '';
        default:
            return `<td>${formatNumber(sell)}z</td><td>${item.Weight || 0}</td>`;
    }
}

// Helper function to update table headers dynamically
function updateItemTableHeaders(displayType, typeSet) {
    const thead = document.getElementById('items-thead');
    let headers = '<tr><th class="col-id">ID</th><th class="col-icon">Icon</th><th class="col-name">Name</th><th class="col-type">Type</th>';
    
    // If showing all types (multiple types), show base headers + sell
    if (displayType === 'AllTypes') {
        const sellArrow = itemSortField === 'Sell' ? (itemSortDirection === 'desc' ? ' ▼' : ' ▲') : ' ▶';
        headers += `<th onclick="sortItemsByField('Sell')" style="cursor: pointer;">${itemSortField === 'Sell' ? '<strong>' : ''}Sell${sellArrow}${itemSortField === 'Sell' ? '</strong>' : ''}</th>`;
        headers += '</tr>';
        thead.innerHTML = headers;
        return;
    }
    
    switch (displayType) {
        case 'Weapon':
            headers += '<th>Attack</th><th>Slots</th>';
            break;
        case 'Armor':
            headers += '<th>Defense</th><th>Slots</th>';
            break;
        case 'Healing':
        case 'Usable':
        case 'DelayConsume':
            const sellArrow = itemSortField === 'Sell' ? (itemSortDirection === 'desc' ? ' ▼' : ' ▲') : ' ▶';
            headers += `<th onclick="sortItemsByField('Sell')" style="cursor: pointer;">${itemSortField === 'Sell' ? '<strong>' : ''}Sell${sellArrow}${itemSortField === 'Sell' ? '</strong>' : ''}</th><th>Weight</th>`;
            break;
        case 'Etc':
            const etcSellArrow = itemSortField === 'Sell' ? (itemSortDirection === 'desc' ? ' ▼' : ' ▲') : ' ▶';
            headers += `<th onclick="sortItemsByField('Sell')" style="cursor: pointer;">${itemSortField === 'Sell' ? '<strong>' : ''}Sell${etcSellArrow}${itemSortField === 'Sell' ? '</strong>' : ''}</th><th>Weight</th>`;
            break;
        case 'Card':
            break;
        default:
            const defSellArrow = itemSortField === 'Sell' ? (itemSortDirection === 'desc' ? ' ▼' : ' ▲') : ' ▶';
            headers += `<th onclick="sortItemsByField('Sell')" style="cursor: pointer;">${itemSortField === 'Sell' ? '<strong>' : ''}Sell${defSellArrow}${itemSortField === 'Sell' ? '</strong>' : ''}</th><th>Weight</th>`;
    }
    
    headers += '</tr>';
    thead.innerHTML = headers;
}

// Function to sort items by field
function sortItemsByField(field) {
    if (itemSortField === field) {
        // Toggle direction if clicking the same field
        itemSortDirection = itemSortDirection === 'desc' ? 'asc' : 'desc';
    } else {
        // Set new sort field with desc direction (first tap sorts descending)
        itemSortField = field;
        itemSortDirection = 'desc';
    }
    
    // Reset to first page and redisplay
    currentPage = 1;
    const displayData = currentFilteredData || itemsData;
    displayItems(displayData);
}

// Get compound slot label from card Locations
function getCardCompoundSlot(card) {
    const locs = card.Locations || {};
    if (locs.Right_Hand) return 'Weapon';
    if (locs.Left_Hand) return 'Shield';
    if (locs.Armor) return 'Armor';
    if (locs.Head_Top || locs.Head_Mid || locs.Head_Low) return 'Headgear';
    if (locs.Shoes) return 'Footgear';
    if (locs.Garment) return 'Garment';
    if (locs.Both_Accessory) return 'Accessory';
    return 'Unknown';
}

// Get the full card effect for the card table
function getCardEffectSummary(card) {
    if (cardEffectOverrides[card.Id]) {
        return cardEffectOverrides[card.Id];
    }
    const script = card.Script || card.EquipScript || '';
    if (!script.trim()) return 'See details';
    return parseItemScript(card.Script, card.EquipScript);
}

// Display cards tab
function displayCards(cards) {
    const tbody = document.getElementById('cards-tbody');
    const countEl = document.getElementById('card-count');

    countEl.textContent = `${cards.length} cards found`;

    if (cards.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">No cards found</td></tr>';
        return;
    }

    // Sort cards alphabetically by name
    const sorted = [...cards].sort((a, b) => a.Name.localeCompare(b.Name));

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = sorted.slice(start, end);

    tbody.innerHTML = paginated.map(card => {
        const slot = getCardCompoundSlot(card);
        const summary = getCardEffectSummary(card);
        return `
        <tr onclick="showCardDetails(${card.Id})">
            <td>${card.Id}</td>
            <td class="col-icon">
                <img src="https://www.divine-pride.net/img/items/item/iRO/${card.Id}"
                     alt="${card.Name}"
                     class="item-sprite-small"
                     onerror="this.style.display='none'">
            </td>
            <td>${card.Name}</td>
            <td><span class="card-slot-badge card-slot-${slot.toLowerCase()}">${slot}</span></td>
            <td class="card-effect-summary">${summary}</td>
        </tr>`;
    }).join('');

    createPagination('cards', cards.length);
}

// Show card detail modal
function showCardDetails(cardId) {
    const card = cardsData.find(c => c.Id === cardId);
    if (!card) return;

    const modal = document.getElementById('cardModal');
    const details = document.getElementById('cardDetails');
    const slot = getCardCompoundSlot(card);
    const effectHtml = cardEffectOverrides[card.Id] || parseItemScript(card.Script, card.EquipScript);

    // Find monsters that drop this card
    let dropsFromHtml = '';
    if (monstersData && monstersData.length > 0) {
        const dropMonsters = monstersData.filter(m =>
            m.Drops && m.Drops.some(drop => drop.Item === card.Name || drop.Item === card.AegisName)
        );
        if (dropMonsters.length > 0) {
            dropsFromHtml = `
                <div class="detail-section">
                    <h3>Dropped By</h3>
                    <table class="drops-table">
                        <thead><tr><th>Monster</th><th>Rate</th></tr></thead>
                        <tbody>
                            ${dropMonsters.map(monster => {
                                const drop = monster.Drops.find(d => d.Item === card.Name || d.Item === card.AegisName);
                                const percent = ((drop.Rate / 10000) * 100).toFixed(2).replace(/\.?0+$/, '');
                                return `<tr>
                                    <td><span class="spawn-map-link" onclick="closeCardModalAndShowMonster(${monster.Id})">${monster.Name}</span></td>
                                    <td>${percent}%</td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>`;
        }
    }

    details.innerHTML = `
        <div class="card-detail-header">
            <div class="card-illustrations">
                <img src="https://www.divine-pride.net/img/items/collection/iRO/${card.Id}"
                     alt="${card.Name} illustration"
                     class="card-illustration"
                     onerror="this.style.display='none'">
                <img src="https://www.divine-pride.net/img/items/item/iRO/${card.Id}"
                     alt="${card.Name}"
                     class="card-sprite-large"
                     onerror="this.style.display='none'">
            </div>
            <div class="card-title-section">
                <h2>${card.Name}</h2>
                <div class="card-meta">
                    <span class="card-slot-badge card-slot-${slot.toLowerCase()}">${slot}</span>
                    <span class="card-id">ID: ${card.Id}</span>
                </div>
            </div>
        </div>

        <div class="detail-section card-effect-section">
            <h3>Card Effect</h3>
            <div class="card-effect-text">${effectHtml}</div>
        </div>

        ${dropsFromHtml}
    `;

    modal.style.display = 'block';
}

function closeCardModalAndShowMonster(monsterId) {
    document.getElementById('cardModal').style.display = 'none';
    showMonsterDetails(monsterId);
}

// ===== Quests Tab =====

function getQuestLocationLabel(loc) {
    if (loc === 'Head_Top') return 'Top';
    if (loc === 'Head_Mid') return 'Mid';
    if (loc === 'Head_Low') return 'Low';
    return loc;
}

function getQuestLocationClass(loc) {
    if (loc === 'Head_Top') return 'quest-loc-top';
    if (loc === 'Head_Mid') return 'quest-loc-mid';
    if (loc === 'Head_Low') return 'quest-loc-low';
    return 'quest-loc-top';
}

function renderLocationBadges(locations) {
    return locations.map(loc =>
        `<span class="quest-location-badge ${getQuestLocationClass(loc)}">${getQuestLocationLabel(loc)}</span>`
    ).join(' ');
}

function displayQuests(quests) {
    const tbody = document.getElementById('quests-tbody');
    const countEl = document.getElementById('quest-count');

    countEl.textContent = `${quests.length} quest${quests.length !== 1 ? 's' : ''} found`;

    if (quests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="loading">No quests found</td></tr>';
        return;
    }

    const sorted = [...quests].sort((a, b) => a.resultName.localeCompare(b.resultName));
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = sorted.slice(start, end);

    tbody.innerHTML = paginated.map(q => {
        const item = itemsData.find(i => i.Id === q.resultId);
        const effectHtml = itemEffectOverrides[q.resultId] || (item && item.Script ? parseItemScript(item.Script, item.EquipScript) : '<span style="color:#aaa">—</span>');
        return `
        <tr onclick="showQuestDetails(${q.id})">
            <td class="col-icon">
                <img src="https://www.divine-pride.net/img/items/item/iRO/${q.resultId}"
                     alt="${q.resultName}"
                     class="item-sprite-small"
                     onerror="this.style.display='none'">
            </td>
            <td>${q.resultName}</td>
            <td>${renderLocationBadges(q.locations)}</td>
            <td class="quest-effect-cell">${effectHtml}</td>
        </tr>`;
    }).join('');

    createPagination('quests', quests.length);
}

function showQuestDetails(questId) {
    const q = questsData.find(x => x.id === questId);
    if (!q) return;

    const modal = document.getElementById('questModal');
    const details = document.getElementById('questDetails');

    // Try to get the item script from loaded itemsData for this headgear
    const item = itemsData.find(i => i.Id === q.resultId);
    const effectHtml = itemEffectOverrides[q.resultId] || (item && item.Script ? parseItemScript(item.Script, item.EquipScript) : '');

    const requirementsHtml = q.requirements.map(r => `
        <tr>
            <td class="req-icon-cell">
                <img src="https://www.divine-pride.net/img/items/item/iRO/${r.id}"
                     alt="${r.name}"
                     class="item-sprite-small"
                     onerror="this.style.display='none'">
            </td>
            <td class="req-qty">${r.qty}x</td>
            <td><span class="spawn-map-link" onclick="document.getElementById('questModal').style.display='none'; showItemDetails(${r.id})">${r.name}</span></td>
        </tr>`).join('');

    details.innerHTML = `
        <div class="quest-detail-header">
            <div class="quest-illustrations">
                <img src="https://www.divine-pride.net/img/items/collection/iRO/${q.resultId}"
                     alt="${q.resultName} illustration"
                     class="quest-illustration"
                     onerror="this.style.display='none'">
                <img src="https://www.divine-pride.net/img/items/item/iRO/${q.resultId}"
                     alt="${q.resultName}"
                     class="quest-sprite-large"
                     onerror="this.style.display='none'">
            </div>
            <div class="quest-title-section">
                <h2>${q.resultName}</h2>
                <div class="quest-meta">
                    ${renderLocationBadges(q.locations)}
                    <span class="quest-id">ID: ${q.resultId}</span>
                </div>
                ${effectHtml ? `<div class="quest-item-effect">${effectHtml}</div>` : ''}
            </div>
        </div>

        <div class="detail-section">
            <h3>Required Materials</h3>
            <table class="quest-requirements-table">
                <tbody>${requirementsHtml}</tbody>
            </table>
        </div>
    `;

    modal.style.display = 'block';
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
    
    grid.innerHTML = maps.map(map => {
        // Calculate recommended level range based on lowest monster level
        const mapSpawns = spawnsData.filter(spawn => spawn.map === map.name);
        let levelText = 'No Monsters';
        
        if (mapSpawns.length > 0) {
            const monsterLevels = mapSpawns
                .map(spawn => {
                    const monster = monstersData.find(m => m.Id === spawn.mobId);
                    return monster ? (monster.Level || 1) : null;
                })
                .filter(level => level !== null);
            
            if (monsterLevels.length > 0) {
                const lowestMonsterLevel = Math.min(...monsterLevels);
                const recommendedMin = Math.max(1, lowestMonsterLevel - 10);
                const recommendedMax = Math.min(99, lowestMonsterLevel + 10);
                levelText = `⚔️ Lv ${recommendedMin}-${recommendedMax}`;
            }
        }
        
        return `
        <div class="map-card" onclick="exploreMap('${map.name}')">
            <div class="map-type-badge ${map.type.toLowerCase()}">${map.type}</div>
            <div class="map-preview">
                <img src="https://www.divine-pride.net/img/map/original/${map.name}" 
                     alt="${map.name}"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23f0f0f0%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2224%22>🗺️</text></svg>'">
            </div>
            <h3>${map.name}</h3>
            <p class="map-id">${formatMapName(map.name)}</p>
            <div class="map-card-footer">
                <span class="recommended-level">${levelText}</span>
            </div>
        </div>
        `;
    }).join('');
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
                        ${monster.Drops.map(drop => {
                            const item = itemsData.find(i => i.Name === drop.Item || i.AegisName === drop.Item);
                            const itemId = item ? item.Id : null;
                            const itemName = item ? item.Name : drop.Item;
                            const percent = ((drop.Rate / 10000) * 100).toFixed(2).replace(/\.?0+$/, '');
                            const isCard = item && item.Type === 'Card';
                            const clickHandler = isCard
                                ? `showCardDetails(${itemId})`
                                : `showItemDetails(${itemId})`;
                            const itemDisplay = itemId ? 
                                `<span class="spawn-map-link" onclick="${clickHandler}">${itemName}</span>` :
                                drop.Item;
                            return `
                                <tr>
                                    <td>${itemDisplay}</td>
                                    <td>${percent}%</td>
                                </tr>
                            `;
                        }).join('')}
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

    // Cards use the dedicated card detail modal
    if (item.Type === 'Card') {
        showCardDetails(itemId);
        return;
    }
    const modal = document.getElementById('itemModal');
    const details = document.getElementById('itemDetails');
    
    // Calculate sell price
    const sellPrice = item.Sell || Math.floor((item.Buy || 0) / 2);
    
    // Find monsters that drop this item
    let dropsFromHtml = '';
    if (monstersData && monstersData.length > 0) {
        const dropMonsters = monstersData.filter(m => 
            m.Drops && m.Drops.some(drop => drop.Item === item.Name || drop.Item === item.AegisName)
        );
        
        if (dropMonsters.length > 0) {
            dropsFromHtml = `
                <div class="detail-section">
                    <h3>Dropped By</h3>
                    <table class="drops-table">
                        <thead>
                            <tr>
                                <th>Monster</th>
                                <th>Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dropMonsters.map(monster => {
                                const drop = monster.Drops.find(d => d.Item === item.Name || d.Item === item.AegisName);
                                const percent = ((drop.Rate / 10000) * 100).toFixed(2).replace(/\.?0+$/, '');
                                return `
                                    <tr>
                                        <td><span class="spawn-map-link" onclick="closeItemModalAndShowMonster(${monster.Id})">${monster.Name}</span></td>
                                        <td>${percent}%</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
    
    details.innerHTML = `
        <div class="item-header">
            <img src="https://www.divine-pride.net/img/items/item/iRO/${item.Id}" 
                 alt="${item.Name}" 
                 class="item-sprite"
                 onerror="this.style.display='none'">
            <div class="item-title-section">
                <h2>${item.Name}</h2>
            </div>
        </div>
        
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
                    <div class="detail-label">Sell Price</div>
                    <div class="detail-value">${formatNumber(sellPrice)}z</div>
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
        
        ${item.Script ? `
            <div class="detail-section">
                <h3>Script</h3>
                <div class="detail-value">${parseItemScript(item.Script)}</div>
            </div>
        ` : ''}
        
        ${dropsFromHtml}
    `;
    
    modal.style.display = 'block';
}

// Helper function to close map modal and show monster details
function closeMapModalAndShowMonster(monsterId) {
    const mapModal = document.getElementById('mapModal');
    mapModal.style.display = 'none';
    showMonsterDetails(monsterId);
}

// Helper function to close item modal and show monster details
function closeItemModalAndShowMonster(monsterId) {
    const itemModal = document.getElementById('itemModal');
    itemModal.style.display = 'none';
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


