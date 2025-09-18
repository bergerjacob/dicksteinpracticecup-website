---
layout: default
title: Players
---
<h1>Player Profiles</h1>

<div class="content-card">
    <p>A directory of all who have participated in the Dick Stein Practice Cup. Click on a player to view their bio and photos.</p>
    <div class="gallery">
        {% assign sorted_players = site.players | sort: 'title' %}
        {% for player in sorted_players %}
        <a href="{{ player.url | relative_url }}" class="gallery-player-card">
            <img src="{{ player.image | relative_url }}" alt="Photo of {{ player.title }}">
            <div class="player-name-overlay">{{ player.title }}</div>
        </a>
        {% endfor %}
    </div>
</div>
