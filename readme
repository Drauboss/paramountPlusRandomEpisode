# Paramount Random Episode Chrome Extension

This Chrome extension allows users to open a random episode of a show on Paramount+ with a single click.

## Features

- Detects if the user is on the Paramount+ website.
- Extracts the show title from the current URL or video page.
- Fetches all episodes of the show across all seasons.
- Opens a new tab with a random episode of the show.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on "Load unpacked" and select the directory where you cloned/downloaded this repository.

## Usage

1. Navigate to a show page or video page on Paramount+.
2. Click the extension icon in the Chrome toolbar.
3. The extension will open a new tab with a random episode of the show.

## Development

### Files

- `background.js`: Contains the main logic for the extension, including event listeners and helper functions.

### Functions

- `getCurrentTab()`: Retrieves the currently active tab.
- `getShowTitle(currentTab, currentUrl)`: Extracts the show title from the current URL or video page.
- `fetchJson(showTitle, seasonNumber)`: Fetches episode data for a specific season.
- `extractEpisodeIds(jsonData)`: Extracts episode IDs from the fetched JSON data.
- `getRandomEpisodeUrl(showTitle)`: Fetches all episodes and returns a URL for a random episode.

## License

This project is licensed under the MIT License.