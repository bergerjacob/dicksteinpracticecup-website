---
layout: default
title: Home
---
# 🏆 Dick Stein Practice Cup
The official home for our weekly casual competition.

---
{% raw %}{% assign current_winner_entry = site.data.winners.winners | where: "current", true | first %}{% endraw %}
{% if current_winner_entry %}
  {% assign current_winner_name = current_winner_entry.name %}
  {% assign player_profile = site.data.players | where: "name", current_winner_name | first %}

<div class="content-card champion-card" style="text-align: center;">
    <h2>Current Champion</h2>
    {% if player_profile.image %}
        <img src="{{ player_profile.image | relative_url }}" alt="{{ player_profile.name }}" style="max-width: 300px; border-radius: 8px; margin: 0 auto 1rem; display: block;">
    {% endif %}
    <h3 style="margin-top: 0;">{{ current_winner_entry.name }}</h3>
    <p style="text-align: center; margin-bottom: 0;"><strong>Week Of:</strong> {{ current_winner_entry.week }} | <strong>Series:</strong> {{ current_winner_entry.series }}</p>
</div>
{% endif %}

## Seasonal Results & Stats
<div class="content-card">
    <p>View complete historical results for each six-month season, or download the original Excel files.</p>
    <p style="text-align: center;"><a href="/history/" style="font-weight: bold; font-size: 1.2rem;">View All Seasonal Results</a></p>
</div>

## Where Has The Cup Been?
<div class="content-card">
    <p>The first time you win the Cup, a picture of it has to be taken at home or somewhere with you. Here are some of the places it has been sighted.</p>
    <div class="gallery">
        {% assign sorted_images = site.static_files | where_exp: "item", "item.path contains '/assets/images/trophy-locations/'" | sort: 'path' | reverse %}
        {% for file in sorted_images %}
            <div class="gallery-item">
                <img src="{{ file.path | relative_url }}" alt="Trophy Location Photo">
            </div>
        {% endfor %}
    </div>
</div>
