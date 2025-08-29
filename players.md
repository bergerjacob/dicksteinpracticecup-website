---
layout: default
title: Players
---
<h1>Player Profiles</h1>

<div class="content-card">
    <p>A directory of all who have participated in the Dick Stein Practice Cup. Click on a player to view their bio and photos.</p>
    <div class="gallery">
        {% for player in site.players %}
        <a href="{{ player.url | relative_url }}" class="gallery-player-card">
            <img src="{{ player.image | relative_url }}" alt="Photo of {{ player.name }}">
            <div class="player-name-overlay">{{ player.name }}</div>
        </a>
        {% endfor %}
    </div>
</div>
