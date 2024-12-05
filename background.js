chrome.action.onClicked.addListener(function(tab) {
  const showTitle = 'king-of-queens';

  async function fetchJson(seasonNumber) {
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

  async function getRandomEpisode() {
    let season = 1;
    let allEpisodeIds = [];
    while (true) {
      const jsonData = await fetchJson(season);
      if (!jsonData) {
        break;
      }
      const episodeIds = extractEpisodeIds(jsonData);
      allEpisodeIds = allEpisodeIds.concat(episodeIds);
      season += 1;
    }

    if (allEpisodeIds.length > 0) {
      const randomEpisode = allEpisodeIds[Math.floor(Math.random() * allEpisodeIds.length)];
      const url = `https://www.paramountplus.com/shows/video/${randomEpisode.contentId}/`;
      chrome.tabs.create({ url: url });
    } else {
      console.error('No episodes found');
    }
  }

  getRandomEpisode().catch(error => console.error('Error:', error));
});
