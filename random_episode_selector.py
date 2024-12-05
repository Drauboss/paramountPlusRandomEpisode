import json
import random
import webbrowser

show_title = 'zoey-101'

# Load the JSON data from the file
with open(f'{show_title}_all_episodes_ids.json', 'r', encoding='utf-8') as file:
    episodes = json.load(file)

# Select a random episode
random_episode = random.choice(episodes)

# Construct the URL
content_id = random_episode['content_id']
url = f"https://www.paramountplus.com/shows/video/{content_id}/"

# Open the URL in the default web browser
print(f"Opening random episode: {random_episode['title']}, Season {random_episode['season']}, Episode {random_episode['episode']}")
print(f"URL: {url}")
webbrowser.open(url)
