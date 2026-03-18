const effMap = {
    Eff_Bleeding: "Bleeding",
    Eff_Blind: "Blind",
    Eff_Burning: "Burning",
    Eff_Confusion: "Confusion",
    Eff_Crystalize: "Crystalize",
    Eff_Curse: "Curse",
    Eff_DPoison: "Deadly Poison",
    Eff_Fear: "Fear",
    Eff_Freeze: "Freeze",
    Eff_Freezing: "Freezing",
    Eff_Heat: "Heat",
    Eff_Deepsleep: "Deep Sleep",
    Eff_Poison: "Poison",
    Eff_Silence: "Silence",
    Eff_Sleep: "Sleep",
    Eff_Stone: "Stone Curse",
    Eff_Stun: "Stun",
    Eff_WhiteImprison: "White Imprison",
};

const skillNameMap = {
    // Swordman
    SM_BASH: "Bash",
    SM_PROVOKE: "Provoke",
    SM_MAGNUM: "Magnum Break",
    // Knight
    KN_SPEARSTAB: "Spear Stab",
    KN_PIERCE: "Pierce",
    KN_BRANDISHSPEAR: "Brandish Spear",
    KN_SPEARBOOMERANG: "Spear Boomerang",
    KN_AUTOCOUNTER: "Counter Attack",
    // Lord Knight
    LK_SPIRALPIERCE: "Spiral Pierce",
    LK_JOINTBEAT: "Joint Beat",
    // Crusader / Paladin
    CR_HOLYCROSS: "Holy Cross",
    CR_SHIELDBOOMERANG: "Shield Boomerang",
    CR_SHIELDCHARGE: "Shield Charge",
    CR_REFLECTSHIELD: "Reflect Shield",
    CR_GRANDCROSS: "Grand Cross",
    PA_SACRIFICE: "Devotion",
    PA_SHIELDCHAIN: "Shield Chain",
    PA_GRAND_CROSS: "Grand Cross",
    // Acolyte / Priest / High Priest
    AL_HEAL: "Heal",
    AL_BLESSING: "Blessing",
    AL_INCAGI: "Increase Agility",
    AL_DECAGI: "Decrease Agility",
    AL_ANGELUS: "Angelus",
    PR_HOLYLIGH: "Holy Light",
    PR_MAGNUS: "Magnus Exorcismus",
    PR_KYRIE: "Kyrie Eleison",
    PR_LEXAETERNA: "Lex Aeterna",
    PR_LEXDIVINA: "Lex Divina",
    HP_ASSUMPTIO: "Assumptio",
    // Mage / Wizard
    MG_SOULSTRIKE: "Soul Strike",
    MG_FIREBOLT: "Fire Bolt",
    MG_LIGHTNINGBOLT: "Lightning Bolt",
    MG_COLDBOLT: "Cold Bolt",
    WZ_STORMGUST: "Storm Gust",
    WZ_VERMILION: "Lord of Vermilion",
    WZ_FROSTNOVA: "Frost Nova",
    WZ_QUAGMIRE: "Quagmire",
    WZ_HEAVENDRIVE: "Heaven's Drive",
    WZ_METEOR: "Meteor Storm",
    WZ_EARTHSPIKE: "Earth Spike",
    // Archer / Hunter / Bard
    AC_CONCENTRATION: "Concentration",
    AC_DOUBLE: "Double Strafe",
    AC_CHARGEARROW: "Arrow Repel",
    CG_ARROWVULCAN: "Arrow Vulcan",
    // Thief / Rogue / Assassin
    TF_HIDING: "Hiding",
    TF_DOUBLE: "Double Attack",
    RG_TUNNELDRIVE: "Tunnel Drive",
    RG_STEALCOIN: "Steal Coin",
    RG_CLOSECONFINE: "Close Confine",
    AS_CLOAKING: "Cloaking",
    AS_SONICBLOW: "Sonic Blow",
    ASC_BREAKER: "Soul Breaker",
    // Monk
    MO_CALLSPIRITS: "Call Spirits",
    MO_EXPLOSIONSPIRITS: "Fury",
    // Blacksmith
    BS_HAMMERFALL: "Hammer Fall",
    // Ninja
    NJ_SHADOWJUMP: "Shadow Jump",
};

const bonusDB = {
    // Base stats
    bStr: { text: "STR +{n}" },
    bAgi: { text: "AGI +{n}" },
    bVit: { text: "VIT +{n}" },
    bInt: { text: "INT +{n}" },
    bDex: { text: "DEX +{n}" },
    bLuk: { text: "LUK +{n}" },
    bAllStats: { text: "All Stats +{n}" },
    bAgiVit: { text: "AGI/VIT +{n}" },
    bAgiDexStr: { text: "AGI/DEX/STR +{n}" },

    // HP/SP
    bMaxHP: { text: "Max HP +{n}" },
    bMaxHPrate: { text: "Max HP +{n}%" },
    bMaxSP: { text: "Max SP +{n}" },
    bMaxSPrate: { text: "Max SP +{n}%" },

    // Atk/Def
    bBaseAtk: { text: "Base ATK +{n}" },
    bAtk: { text: "ATK +{n}" },
    bAtk2: { text: "Weapon ATK +{n}" },
    bAtkRate: { text: "ATK +{n}%" },
    bWeaponAtkRate: { text: "Weapon ATK +{n}%" },
    bMatk: { text: "MATK +{n}" },
    bMatkRate: { text: "MATK +{n}%" },
    bWeaponMatkRate: { text: "Weapon MATK +{n}%" },
    bDef: { text: "DEF +{n}" },
    bDefRate: { text: "DEF +{n}%" },
    bDef2: { text: "VIT DEF +{n}" },
    bDef2Rate: { text: "VIT DEF +{n}%" },
    bMdef: { text: "MDEF +{n}" },
    bMdefRate: { text: "MDEF +{n}%" },
    bMdef2: { text: "INT MDEF +{n}" },
    bMdef2Rate: { text: "INT MDEF +{n}%" },

    // Additional stats
    bHit: { text: "Hit +{n}" },
    bHitRate: { text: "Hit +{n}%" },
    bCritical: { text: "Critical +{n}" },
    bCriticalLong: { text: "Ranged Crit +{n}" },
    bCriticalRate: { text: "Critical Damage +{n}%" },
    bFlee: { text: "Flee +{n}" },
    bFleeRate: { text: "Flee +{n}%" },
    bFlee2: { text: "Perfect Dodge +{n}" },
    bFlee2Rate: { text: "Perfect Dodge +{n}%" },
    bPerfectHitRate: { text: "Perfect Hit +{n}%" },
    bSpeedRate: { text: "Movement Speed +{n}%" },
    bSpeedAddRate: { text: "Movement Speed +{n}%" },
    bAspd: { text: "ASPD +{n}" },
    bAspdRate: { text: "ASPD +{n}%" },
    bAtkRange: { text: "Attack Range +{n}" },
    bAddMaxWeight: { text: "Max Weight +{n}" },

    // HP/SP Recovery
    bHPrecovRate: { text: "HP Recovery +{n}%" },
    bSPrecovRate: { text: "SP Recovery +{n}%" },

    // Cast time/delay
    bCastrate: { text: "Variable Cast Time {n}%" },
    bFixedCastrate: { text: "Fixed Cast Time {n}%" },
    bVariableCastrate: { text: "Variable Cast Time {n}%" },
    bDelayRate: { text: "After-cast Delay {n}%" },
    // Legacy lowercase variant, keep as alias
    bDelayrate: { text: "After-cast Delay {n}%" },
    bNoCastCancel: { text: "Prevents skill casting from being interrupted." },
    bNoCastCancel2: { text: "Prevents skill casting from being interrupted." },
    bUseSPrate: { text: "SP consumption {n}%" },

    // Damage modifiers
    bShortAtkRate: { text: "Melee Damage +{n}%" },
    bLongAtkRate: { text: "Ranged Damage +{n}%" },
    bCritAtkRate: { text: "Critical Damage +{n}%" },
    bNearAtkDef: { text: "Melee Damage Resistance +{n}%" },
    bLongAtkDef: { text: "Ranged Damage Resistance +{n}%" },
    bMagicAtkDef: { text: "Magic Damage Resistance +{n}%" },
    bMiscAtkDef: { text: "Misc Damage Resistance +{n}%" },

    // Healing
    bHealPower: { text: "Healing Power +{n}%" },
    bHealPower2: { text: "Heal Received +{n}%" },
    // For both bonus and bonus2 variants, use the last argument as the percentage value
    bAddItemHealRate: { text: "Healing from items +{n}%", nIndex: -1 },

    // Ignore Def
    bIgnoreDefRace: { text: "Ignore {r} race DEF", params: ['r'] },
    bIgnoreMDefRace: { text: "Ignore {r} race MDEF", params: ['r'] },
    bIgnoreDefRaceRate: { text: "Ignore {n}% of {r} race DEF", params: ['r', 'n'] },
    bIgnoreMdefRaceRate: { text: "Ignore {n}% of {r} race MDEF", params: ['r', 'n'] },
    bIgnoreDefClassRate: { text: "Ignore {n}% of {c} class DEF", params: ['c', 'n'] },
    bIgnoreMdefClassRate: { text: "Ignore {n}% of {c} class MDEF", params: ['c', 'n'] },

    // Damage to...
    bAddRace: { text: "+{x}% damage to {r} race", params: ['r', 'x'] },
    bMagicAddRace: { text: "+{x}% magic damage to {r} race", params: ['r', 'x'] },
    bAddSize: { text: "+{x}% damage to {s} size", params: ['s', 'x'] },
    bMagicAddSize: { text: "+{x}% magic damage to {s} size", params: ['s', 'x'] },
    bAddEle: { text: "+{x}% damage to {e} element", params: ['e', 'x'] },
    bMagicAddEle: { text: "+{x}% magic damage to {e} element", params: ['e', 'x'] },
    bMagicAtkEle: { text: "Increases magic damage with {e} element by {x}%", params: ['e', 'x'] },
    bAddClass: { text: "+{x}% damage to {c} class", params: ['c', 'x'] },
    bMagicAddClass: { text: "+{x}% magic damage to {c} class", params: ['c', 'x'] },

    // Resistance from...
    bSubRace: { text: "-{x}% damage from {r} race", params: ['r', 'x'] },
    bSubSize: { text: "-{x}% damage from {s} size", params: ['s', 'x'] },
    bSubEle: { text: "-{x}% damage from {e} element", params: ['e', 'x'] },
    bSubClass: { text: "-{x}% damage from {c} class", params: ['c', 'x'] },

    // Defense / Attack element
    bDefEle: { text: "Changes defense element to {e}", params: ['e'] },
    bAtkEle: { text: "Changes attack element to {e}", params: ['e'] },

    // Skill damage / healing
    bSkillAtk: { text: "+{n}% damage with {sk}", params: ['sk', 'n'] },
    bSkillHeal: { text: "+{n}% healing power for {sk}", params: ['sk', 'n'] },
    bSkillHeal2: { text: "+{n}% healing received from {sk}", params: ['sk', 'n'] },
    bAddSkillBlow: { text: "Knocks back target {n} cells when using {sk}", params: ['sk', 'n'] },

    // Experience
    bExpAddRace: { text: "+{x}% EXP vs {r} race", params: ['r', 'x'] },
    bExpAddClass: { text: "+{x}% EXP vs {c} class", params: ['c', 'x'] },

    // HP/SP drain on hit
    bHPDrainValue: { text: "Recover +{n} HP with each hit" },
    bSPDrainValue: { text: "Recover +{n} SP with each hit" },
    bHPDrainValueRace: { text: "Recover +{n} HP when hitting {r} race", params: ['r', 'n'] },
    bSPDrainValueRace: { text: "Recover +{n} SP when hitting {r} race", params: ['r', 'n'] },

    // HP/SP gain on kill
    bHPGainValue: { text: "Recover +{n} HP when killing with melee" },
    bSPGainValue: { text: "Recover +{n} SP when killing with melee" },
    bLongHPGainValue: { text: "Recover +{n} HP when killing with ranged" },
    bLongSPGainValue: { text: "Recover +{n} SP when killing with ranged" },
    bMagicHPGainValue: { text: "Recover +{n} HP when killing with magic" },
    bMagicSPGainValue: { text: "Recover +{n} SP when killing with magic" },

    // Drop bonuses
    bDropAddRace: { text: "+{x}% drop rate vs {r} race", params: ['r', 'x'] },
    bDropAddClass: { text: "+{x}% drop rate vs {c} class", params: ['c', 'x'] },
    bAddMonsterDropItem: { text: "Chance to obtain {i} when killing monsters", params: ['i', 'x'] },

    // Autospell
    bAutoSpell: { text: "{n/10}% chance to cast Lv.{y} {sk}", params: ['sk', 'y', 'n'] },
    bAutoSpellWhenHit: { text: "{n/10}% chance to cast Lv.{y} {sk} when hit", params: ['sk', 'y', 'n'] },

    // HP/SP drain
    bHPDrainRate: { text: "{x/10}% chance to drain {n}% HP from damage dealt", params: ['x', 'n'] },
    bSPDrainRate: { text: "{x/10}% chance to drain {n}% SP from damage dealt", params: ['x', 'n'] },

    // Damage return
    bShortWeaponDamageReturn: { text: "Reflects {n}% of received melee damage" },
    bLongWeaponDamageReturn: { text: "Reflects {n}% of received ranged damage" },
    bMagicDamageReturn: { text: "Reflects {n}% of received magic damage" },

    // Other
    bUnstripable: { text: "Equipment cannot be stripped." },
    bUnbreakable: { text: "Equipment cannot be broken." },
    bUnbreakableWeapon: { text: "Weapon cannot be broken." },
    bUnbreakableArmor: { text: "Armor cannot be broken." },
    bUnbreakableHelm: { text: "Helm cannot be broken." },
    bUnbreakableShield: { text: "Shield cannot be broken." },
    bUnbreakableGarment: { text: "Garment cannot be broken." },
    bUnbreakableShoes: { text: "Shoes cannot be broken." },
    bNoKnockback: { text: "Cannot be knocked back." },
    bNoGemStone: { text: "Skills do not require gemstones." },
    bIntravision: { text: "Enables seeing hidden enemies." },
    bNoWalkDelay: { text: "Removes staggering when hit (Endure effect)." },
    bNoSizeFix: { text: "Nullifies weapon size penalty." },
    bNoMagicDamage: { text: "100% immunity to magic damage." },
};

const raceMap = {
    RC_Angel: "Angel",
    RC_Brute: "Brute",
    RC_DemiHuman: "Demi-Human",
    RC_Demon: "Demon",
    RC_Dragon: "Dragon",
    RC_Fish: "Fish",
    RC_Formless: "Formless",
    RC_Insect: "Insect",
    RC_Plant: "Plant",
    RC_Player_Human: "Player (Human)",
    RC_Player_Doram: "Player (Doram)",
    RC_Undead: "Undead",
    RC_All: "All",
};

const classMap = {
    Class_Normal: "Normal",
    Class_Boss: "Boss",
    Class_Guardian: "Guardian",
    Class_All: "All",
};

const sizeMap = {
    Size_Small: "Small",
    Size_Medium: "Medium",
    Size_Large: "Large",
    Size_All: "All",
};

const elementMap = {
    Ele_Dark: "Dark",
    Ele_Earth: "Earth",
    Ele_Fire: "Fire",
    Ele_Ghost: "Ghost",
    Ele_Holy: "Holy",
    Ele_Neutral: "Neutral",
    Ele_Poison: "Poison",
    Ele_Undead: "Undead",
    Ele_Water: "Water",
    Ele_Wind: "Wind",
    Ele_All: "All",
};

// Known item ID → display name map
const knownItemNames = {
    644: 'Gift Box',
};

// Collapse adjacent sign pairs so double-negatives become positive, etc.
// e.g. "--40" → "+40", "+-50" → "-50", "DEF +{n}" with n=-5 → "DEF -5"
function normalizeSigns(str) {
    // Repeatedly collapse two adjacent signs before a digit or another sign
    let prev;
    do {
        prev = str;
        str = str.replace(/([+-])([+-])(?=[\d])/g, (_, a, b) => {
            return (a === b) ? '+' : '-';
        });
    } while (str !== prev);
    // Clean up a leading standalone '+' that precedes a word (e.g. "+40% damage" → "40% damage" is fine to keep,
    // but only strip + when it appears as a sign in "DEF +{value}" patterns handled above).
    // Actually leave it as-is; a pure "+" prefix on a positive number is fine UX.
    return str;
}

// Split a script into statements on ; and \n, but never split inside quoted strings
function splitScriptLines(text) {
    const result = [];
    let current = '';
    let inString = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '"') {
            inString = !inString;
            current += ch;
        } else if (ch === '\r') {
            // skip
        } else if ((ch === ';' || ch === '\n') && !inString) {
            const trimmed = current.trim();
            if (trimmed) result.push(trimmed);
            current = '';
        } else {
            current += ch;
        }
    }
    const trimmed = current.trim();
    if (trimmed) result.push(trimmed);
    return result;
}

function parseItemScript(script, equipScript) {
    const combined = [script, equipScript].filter(Boolean).join('\n');
    if (!combined.trim()) return "No effect description available.";

    // Split respecting quoted strings so autobonus "{ ... }" isn't broken at inner semicolons
    const lines = splitScriptLines(combined);
    const effects = [];
    let refineCondition = null;
    let singleLineCondition = false; // true when condition has no block braces

    lines.forEach(rawLine => {
        let line = rawLine;
        // If last condition was single-line (no brace), reset after previous iteration already pushed an effect
        if (singleLineCondition && refineCondition && effects.length > 0) {
            const last = effects[effects.length - 1];
            if (last && last.startsWith(refineCondition)) {
                refineCondition = null;
                singleLineCondition = false;
            }
        }
        if (/^sc_end\s/.test(line) || /^delitem\b/.test(line)) return;

        // Skip complex EquipScript item-spawning lines
        if (/^if\s*\(countitem/.test(line) || /^getitem\b/.test(line)) return;

        // Handle autobonus — parse inner bonus, rate, and duration
        const autobonusMatch = line.match(/^autobonus\s+"([^"]+)"\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (autobonusMatch) {
            const innerScript = autobonusMatch[1].replace(/^\{\s*|\s*\}$/g, '').trim();
            const rate = Math.round(parseInt(autobonusMatch[2], 10) / 10);
            const durationSec = Math.round(parseInt(autobonusMatch[3], 10) / 1000);
            const innerEffects = parseItemScript(innerScript, null);
            const effectDesc = innerEffects === 'No effect description available.' ? 'special effect' : innerEffects.replace(/<br>/g, ', ');
            effects.push(`${rate}% chance to gain ${effectDesc} for ${durationSec} seconds on attack`);
            return;
        }
        if (/^autobonus\b/.test(line)) {
            effects.push('Special proc effect on attack (see in-game description)');
            return;
        }

        // Handle inline SC condition: if (!SC_X) bonus...
        const scCondMatch = line.match(/^if\s*\(!SC_\w+\)\s+(bonus.+)/);
        if (scCondMatch) {
            line = scCondMatch[1];
        }

        // Handle skill "X",level lines (grants skill)
        const skillMatch = line.match(/^skill\s+"([^"]+)",\s*(\d+)/);
        if (skillMatch) {
            const skillId = skillMatch[1];
            const level = parseInt(skillMatch[2], 10);
            const skillName = skillNameMap[skillId] || skillId;
            const text = `Grants ${skillName} Lv.${level}`;
            effects.push(refineCondition ? `${refineCondition} ${text}` : text);
            return;
        }

        // Handle refine-based condition blocks, e.g. if (getrefine()>=7) {
        const refineIfMatch = line.match(/^if\s*\(\s*getrefine\(\)\s*([<>!=]=?|)\s*(\d+)\s*\)\s*(\{)?\s*$/);
        if (refineIfMatch) {
            const op = refineIfMatch[1] || '>=';
            const value = parseInt(refineIfMatch[2], 10);
            const hasBrace = !!refineIfMatch[3];
            let desc = null;
            if (op === '>=') desc = `At refine +${value} or higher:`;
            else if (op === '>') desc = `Above refine +${value}:`;
            else if (op === '<=') desc = `At refine +${value} or lower:`;
            else if (op === '<') desc = `Below refine +${value}:`;
            else if (op === '==') desc = `At exactly refine +${value}:`;
            refineCondition = desc;
            singleLineCondition = !hasBrace;
            return;
        }

        // Handle BaseLevel condition blocks, e.g. if (BaseLevel == 99) {
        const baseLevelMatch = line.match(/^if\s*\(\s*BaseLevel\s*([<>!=]=?)\s*(\d+)\s*\)\s*(\{)?\s*$/);
        if (baseLevelMatch) {
            const op = baseLevelMatch[1];
            const value = parseInt(baseLevelMatch[2], 10);
            const hasBrace = !!baseLevelMatch[3];
            let desc = null;
            if (op === '==') desc = `At base level ${value}:`;
            else if (op === '>=') desc = `At base level ${value}+:`;
            else desc = `If base level ${op} ${value}:`;
            refineCondition = desc;
            singleLineCondition = !hasBrace;
            return;
        }

        // Closing brace ends current condition
        if (line === '}' || line === '};') {
            refineCondition = null;
            singleLineCondition = false;
            return;
        }

        // Special handling for bResEff (status resistance)
        const resEffMatch = line.match(/^bonus2\s+bResEff\s*,\s*(\w+)\s*,\s*(\d+)/);
        if (resEffMatch) {
            const effName = effMap[resEffMatch[1]] || resEffMatch[1];
            const resistance = Math.round(parseInt(resEffMatch[2], 10) / 100);
            const text = resistance >= 100
                ? `Immune to ${effName}`
                : `+${resistance}% resistance to ${effName}`;
            effects.push(refineCondition ? `${refineCondition} ${text}` : text);
            return;
        }

        // Special handling for bComaClass
        const comaClassMatch = line.match(/^bonus2\s+bComaClass\s*,\s*(\w+)\s*,\s*(\d+)/);
        if (comaClassMatch) {
            const cls = classMap[comaClassMatch[1]] || comaClassMatch[1];
            const chance = +(parseInt(comaClassMatch[2], 10) / 100).toFixed(2);
            const text = `${chance}% chance to inflict instant-death on ${cls} monsters`;
            effects.push(refineCondition ? `${refineCondition} ${text}` : text);
            return;
        }

        // Special handling for bComaRace
        const comaRaceMatch = line.match(/^bonus2\s+bComaRace\s*,\s*(\w+)\s*,\s*(\d+)/);
        if (comaRaceMatch) {
            const race = raceMap[comaRaceMatch[1]] || comaRaceMatch[1];
            const chance = +(parseInt(comaRaceMatch[2], 10) / 100).toFixed(2);
            const text = `${chance}% chance to inflict instant-death on ${race} race`;
            effects.push(refineCondition ? `${refineCondition} ${text}` : text);
            return;
        }

        // Special handling for bHPDrainRate / bSPDrainRate (params variant)
        const drainRateMatch = line.match(/^bonus2\s+(bHPDrainRate|bSPDrainRate)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (drainRateMatch) {
            const isSP = drainRateMatch[1] === 'bSPDrainRate';
            const chance = Math.round(parseInt(drainRateMatch[2], 10) / 10);
            const pct = drainRateMatch[3];
            const text = `${chance}% chance to drain ${pct}% ${isSP ? 'SP' : 'HP'} from damage dealt`;
            effects.push(refineCondition ? `${refineCondition} ${text}` : text);
            return;
        }

        const match = line.match(/bonus(2|3|4|5)?\s+([a-zA-Z0-9_]+),([^;]+)/);
        if (match) {
            const bonusType = match[2];
            const args = match[3].split(',').map(arg => arg.trim());
            const bonusInfo = bonusDB[bonusType];

            if (bonusInfo) {
                let text = bonusInfo.text;
                if (bonusInfo.params) {
                    const params = {};
                    bonusInfo.params.forEach((paramName, index) => {
                        let value = args[index];
                        if (paramName === 'r') value = raceMap[value] || value;
                        if (paramName === 's') value = sizeMap[value] || value;
                        if (paramName === 'e') value = elementMap[value] || value;
                        if (paramName === 'c') value = classMap[value] || value;
                        if (paramName === 'i') value = knownItemNames[parseInt(value, 10)] || `item #${value}`;
                        if (paramName === 'sk') {
                            value = value.replace(/"/g, '');
                            value = skillNameMap[value] || value;
                        }
                        params[paramName] = value;
                    });
                    text = text.replace(/\{(\w+)(?:\/(\d+))?\}/g, (_, key, divisor) => {
                        const val = params[key];
                        if (divisor && val !== undefined && !isNaN(Number(val))) {
                            return (Number(val) / Number(divisor)).toFixed(4).replace(/\.?0+$/, '');
                        }
                        return val !== undefined ? val : `{${key}}`;
                    });
                    text = normalizeSigns(text);
                } else {
                    const nIndex = typeof bonusInfo.nIndex === 'number'
                        ? (bonusInfo.nIndex < 0 ? args.length + bonusInfo.nIndex : bonusInfo.nIndex)
                        : 0;
                    let nValue = args[nIndex] ?? args[0];

                    // Special-case: readparam(bLuk)/7 -> every 7 points of Luk
                    if (bonusType === 'bFlee2' && nValue === 'readparam(bLuk)/7') {
                        text = 'Perfect Dodge +1 per 7 LUK';
                        effects.push(refineCondition ? `${refineCondition} ${text}` : text);
                        return;
                    }

                    // If numeric, allow the value to carry its sign
                    if (!isNaN(Number(nValue))) {
                        // nothing extra needed, bHPDrainRate/bSPDrainRate handled above via regex
                    }

                    text = text.replace(/{n}/g, nValue);
                    text = normalizeSigns(text);
                }
                const finalText = refineCondition ? `${refineCondition} ${text}` : text;
                effects.push(finalText);
            } else {
                const fallback = refineCondition ? `${refineCondition} ${line}` : line;
                effects.push(fallback); // Fallback for unhandled bonuses
            }
        } else if (line) {
            const fallback = refineCondition ? `${refineCondition} ${line}` : line;
            effects.push(fallback); // Fallback for non-bonus lines
        }
    });

    if (!effects.length) return "No effect description available.";
    return effects.join('<br>');
}
