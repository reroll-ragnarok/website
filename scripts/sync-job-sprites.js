const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://nn.ai4rei.net/dev/npclist/i';
const OUTPUT_DIR = path.join(__dirname, '..', 'images', 'jobs');

const CLASS_SPRITES = [
    'NOVICE',
    'SWORDMAN', 'KNIGHT', 'CRUSADER', 'KNIGHT_H', 'CRUSADER_H',
    'MAGICIAN', 'WIZARD', 'SAGE', 'WIZARD_H', 'SAGE_H',
    'ARCHER', 'HUNTER', 'BARD', 'DANCER', 'HUNTER_H', 'BARD_H', 'DANCER_H',
    'MERCHANT', 'BLACKSMITH', 'ALCHEMIST', 'BLACKSMITH_H', 'ALCHEMIST_H',
    'ACOLYTE', 'PRIEST', 'MONK', 'PRIEST_H', 'MONK_H',
    'THIEF', 'ASSASSIN', 'ROGUE', 'ASSASSIN_H', 'ROGUE_H'
];

function downloadSprite(className) {
    const targetPath = path.join(OUTPUT_DIR, `${className}.gif`);
    const url = `${BASE_URL}/${className}.gif`;

    return new Promise((resolve, reject) => {
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                Referer: 'https://nn.ai4rei.net/dev/npclist/?',
                Accept: 'image/gif,image/*;q=0.9,*/*;q=0.8'
            }
        }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                res.resume();
                return reject(new Error(`Redirect not supported for ${className}: ${res.headers.location}`));
            }

            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(`HTTP ${res.statusCode} for ${className}`));
            }

            const contentType = (res.headers['content-type'] || '').toLowerCase();
            if (!contentType.includes('image/gif')) {
                res.resume();
                return reject(new Error(`Unexpected content-type for ${className}: ${contentType || 'unknown'}`));
            }

            const file = fs.createWriteStream(targetPath);
            res.pipe(file);

            file.on('finish', () => {
                file.close(() => resolve());
            });

            file.on('error', (err) => {
                fs.unlink(targetPath, () => reject(err));
            });
        });

        req.on('error', reject);
    });
}

async function main() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    console.log(`Syncing ${CLASS_SPRITES.length} job sprites...`);

    let ok = 0;
    for (const className of CLASS_SPRITES) {
        try {
            await downloadSprite(className);
            ok += 1;
            console.log(`  OK ${className}.gif`);
        } catch (err) {
            console.warn(`  FAIL ${className}.gif -> ${err.message}`);
        }
    }

    console.log(`Done. Downloaded ${ok}/${CLASS_SPRITES.length} sprites to images/jobs/.`);

    if (ok === 0) {
        process.exitCode = 1;
    }
}

main().catch((err) => {
    console.error('Sprite sync failed:', err.message);
    process.exit(1);
});
