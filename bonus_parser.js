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

    // Autospell
    bAutoSpell: { text: "{n}/10% chance to cast Lv.{y} {sk}", params: ['sk', 'y', 'n'] },
    bAutoSpellWhenHit: { text: "{n}/10% chance to cast Lv.{y} {sk} when hit", params: ['sk', 'y', 'n'] },

    // HP/SP drain
    bHPDrainRate: { text: "{x}/10% chance to drain {n}% HP from damage dealt", params: ['x', 'n'] },
    bSPDrainRate: { text: "{x}/10% chance to drain {n}% SP from damage dealt", params: ['x', 'n'] },

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
    bIntravision: { text: "Detects hidden enemies." },
    bNoWalkDelay: { text: "No walk delay (infinite Endure)." },
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
    RC_Player_Human: "Player",
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

function parseItemScript(script) {
    if (!script) return "No script available.";

    const lines = script.split(';').map(s => s.trim()).filter(Boolean);
    const effects = [];
    let refineCondition = null; // track current refine-based condition

    lines.forEach(rawLine => {
        let line = rawLine;

        // Handle refine-based condition blocks, e.g. if (getrefine()>=7) {
        const refineIfMatch = line.match(/^if\s*\(\s*getrefine\(\)\s*([<>!=]=?|)\s*(\d+)\s*\)\s*\{?\s*$/);
        if (refineIfMatch) {
            const op = refineIfMatch[1] || '>=';
            const value = parseInt(refineIfMatch[2], 10);
            // Simplify to human-readable description for common patterns
            let desc = null;
            if (op === '>=') desc = `If item is refined +${value} or higher:`;
            else if (op === '>') desc = `If item is refined above +${value}:`;
            else if (op === '<=') desc = `If item is refined +${value} or lower:`;
            else if (op === '<') desc = `If item is refined below +${value}:`;
            else if (op === '==') desc = `If item is refined exactly +${value}:`;

            refineCondition = desc;
            // Don't output the raw if-line itself
            return;
        }

        // Closing brace ends current refine condition
        if (line === '}' || line === '};') {
            refineCondition = null;
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
                        if (paramName === 'sk') value = value.replace(/"/g, '');
                        params[paramName] = value;
                    });
                    text = text.replace(/{(\w+)}/g, (_, key) => params[key] || `{${key}}`);
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
                        // For x/10 patterns like bHPDrainRate, compute the actual percentage
                        if (bonusType === 'bHPDrainRate' || bonusType === 'bSPDrainRate') {
                            const x = Number(nValue);
                            const percent = x / 10;
                            nValue = String(percent);
                        }
                    }

                    text = text.replace(/{n}/g, nValue);
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

    if (!effects.length) return "No script effects.";
    return effects.join('<br>');
}
