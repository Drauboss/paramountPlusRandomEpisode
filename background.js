chrome.action.onClicked.addListener(async function (tab) {
    const currentTab = await getCurrentTab();
    const currentUrl = currentTab.url;
    console.log('Current URL:', currentUrl);

    if (!currentUrl.includes('paramountplus.com')) {
        console.error('Not on Paramount+ website');
        return;
    }

    const showTitle = await getShowTitle(currentTab, currentUrl);
    if (!showTitle) {
        console.error('Could not extract show title');
        return;
    }

    console.log('Show Title:', showTitle);

    const randomEpisodeUrl = await getRandomEpisodeUrl(showTitle);
    if (randomEpisodeUrl) {
        chrome.tabs.create({ url: randomEpisodeUrl });
    } else {
        console.error('No episodes found');
    }
});

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        updateIcon(tab);
    }
});

chrome.tabs.onActivated.addListener(async function (activeInfo) {
    const tab = await getCurrentTab();
    updateIcon(tab);
});

async function updateIcon(tab) {
    const currentUrl = tab.url;
    if (currentUrl.includes('paramountplus.com')) {
        chrome.action.setIcon({ path: {
            "16": "icons/icon16.png",
            "48": "icons/icon48.png",
            "128": "icons/icon128.png"
        }, tabId: tab.id });
    } else {
        chrome.action.setIcon({ path: {
            "16": "icons/icon16_grey.png",
            "48": "icons/icon48_grey.png",
            "128": "icons/icon128_grey.png"
        }, tabId: tab.id });
    }
}

async function getCurrentTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
}

async function getShowTitle(currentTab, currentUrl) {
    if (currentUrl.includes('video')) {
        const results = await chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: () => {
                const showLink = document.querySelector('a[aa-link*="show header"]');
                return showLink ? showLink.href.match(/shows\/([^/]+)/)[1] : null;
            }
        });
        if (chrome.runtime.lastError || !results || !results[0].result) {
            return null;
        }
        return results[0].result;
    } else {
        return currentUrl.match(/shows\/([^/]+)/)[1];
    }
}

async function fetchJson(showTitle, seasonNumber) {
    const url = `https://www.paramountplus.com/shows/${showTitle}/xhr/episodes/page/0/size/30/xs/0/season/${seasonNumber}/`;
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        if (data.result.total === 0) {
            return null;
        }
        return data;
    } else {
        console.error(`Failed to fetch data for season ${seasonNumber}`);
        return null;
    }
}

function extractEpisodeIds(jsonData) {
    const episodes = jsonData.result.data || [];
    return episodes.map(episode => ({
        title: episode.title,
        season: episode.season_number,
        episode: episode.episode_number,
        contentId: episode.content_id
    }));
}

async function getRandomEpisodeUrl(showTitle) {
    let season = 1;
    let allEpisodeIds = [];
    while (true) {
        const jsonData = await fetchJson(showTitle, season);
        if (!jsonData) {
            break;
        }
        const episodeIds = extractEpisodeIds(jsonData);
        allEpisodeIds = allEpisodeIds.concat(episodeIds);
        season += 1;
    }

    if (allEpisodeIds.length > 0) {
        const randomEpisode = allEpisodeIds[Math.floor(Math.random() * allEpisodeIds.length)];
        return `https://www.paramountplus.com/shows/video/${randomEpisode.contentId}/`;
    } else {
        return null;
    }
}
