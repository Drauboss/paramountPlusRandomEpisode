import requests
import json

show_title = 'king-of-queens'

def fetch_json(season_number):
    url = f"https://www.paramountplus.com/shows/{show_title}/xhr/episodes/page/0/size/30/xs/0/season/{season_number}/"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data['result']['total'] == 0:
            return None
        return data
    else:
        print(f"Failed to fetch data for season {season_number}")
        return None

def extract_episode_ids(json_data):
    episodes = json_data.get('result', {}).get('data', [])
    episode_ids = [{'title': episode.get('title'), 'season': episode.get('season_number'), 'episode': episode.get('episode_number'), 'content_id': episode.get('content_id')} for episode in episodes]
    return episode_ids

def main():
    season = 1
    all_episode_ids = []
    while True:
        json_data = fetch_json(season)
        if not json_data:
            break
        episode_ids = extract_episode_ids(json_data)
        all_episode_ids.extend(episode_ids)
        season += 1
    
    # Save all episode IDs to a single file
    if all_episode_ids:
        filename = f'{show_title}_all_episodes_ids.json'
        with open(filename, 'w', encoding='utf-8') as file:
            json.dump(all_episode_ids, file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main()