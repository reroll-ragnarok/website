# reROll - Ragnarok Online Server Website

A modern, responsive website for the reROll Ragnarok Online private server featuring a comprehensive game database interface.

## Features

- **Home Page**: Server information, rates, features, and download instructions
- **Database System**: Search and browse monsters, items, and maps
- **RateMyServer-style Interface**: Familiar database layout for RO players
- **Official iRO Color Scheme**: Blue, purple, and gold theme matching Warp Portal's design
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Data**: Directly reads from rAthena YAML database files

## Installation

The website is located in the `website/` folder of your rAthena server.

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup

1. Navigate to the website directory:
```bash
cd /Users/joaocoutinho/reroll/website
```

2. Install dependencies:
```bash
npm install
```

## Running the Website

### Development Mode

```bash
npm start
```

The website will be available at `http://localhost:3000`

### Production Mode

For production deployment, you can use PM2 or similar process managers:

```bash
npm install -g pm2
pm2 start website.js --name reroll-website
```

## Features Overview

### Home Page
- Hero section with call-to-action buttons
- Server rates display (Base EXP, Job EXP, Drop rates, etc.)
- Server features highlight
- Download instructions
- Account registration link

### Database Page
- **Monsters Tab**: Browse all monsters with filtering by element, race, and size
- **Items Tab**: Browse all items with type filtering
- **Maps Tab**: View all available maps
- **Search Function**: Search by name or ID across all databases
- **Detailed Views**: Click on any entry to see full details
- **Pagination**: Easy navigation through large datasets

## Customization

### Update Server Rates

Edit [public/index.html](public/index.html) and modify the rate values in the rates section:

```html
<div class="rate-value">100x</div> <!-- Change this -->
```

### Change Colors

Edit [public/styles.css](public/styles.css) and modify the CSS variables at the top:

```css
:root {
    --primary-blue: #2c5aa0;
    --primary-purple: #6b4c9a;
    --secondary-gold: #f4c542;
    /* Add more customizations */
}
```

### Add More Database Fields

1. Edit the table headers in [public/database.html](public/database.html)
2. Update the display functions in [public/database.js](public/database.js)
3. The backend automatically reads all fields from YAML files

## API Endpoints

The server provides the following API endpoints:

- `GET /api/monsters` - Get all monsters
- `GET /api/monsters/:id` - Get specific monster by ID
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get specific item by ID
- `GET /api/maps` - Get all maps

## Database Sources

The website reads data directly from your rAthena database files:

- **Monsters**: `db/mob_db.yml` and `db/re/mob_db.yml`
- **Items**: `db/item_db.yml` and `db/re/item_db.yml`
- **Maps**: `db/map_index.txt`

Any changes to these files will be reflected in the website after restarting the server.

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Data Format**: YAML parsing
- **Fonts**: Google Fonts (Cinzel, Lato)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

To add new features or fix bugs:

1. Edit the relevant files in the `website/public/` directory
2. Restart the server to see changes
3. Test across different browsers

## License

This website is part of the reROll server project. Ragnarok Online is a registered trademark of Gravity Co., Ltd.

## Support

For issues or questions:
- Discord: [Add your Discord link]
- Forums: [Add your forum link]
- Email: [Add your support email]
