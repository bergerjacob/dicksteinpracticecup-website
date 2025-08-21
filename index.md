---
layout: default
title: Home
---
# 🏆 Dick Stein Practice Cup
The official home for our weekly casual competition.

---
{% for winner in site.data.winners %}
  {% if winner.current == true %}
<div class="content-card champion-card">
    <h2 style="border-bottom: none; text-align: center;">Current Champion</h2>
    <h3 style="text-align: center; margin-top: 0;">{{ winner.name }}</h3>
    <p style="text-align: center; margin-bottom: 0;"><strong>Week Of:</strong> {{ winner.week }} | <strong>Series:</strong> {{ winner.series }}</p>
</div>
  {% endif %}
{% endfor %}

## Seasonal Results & Stats
<div class="content-card">
    <p>Download the complete historical results for each six-month season below.</p>
    <ul>
        <li><a href="/assets/downloads/DS PC Late 2024-2.xlsx" download>Late 2024 Season Results</a></li>
        <li><a href="/assets/downloads/DS PC Early 2025.xlsx" download>Early 2025 Season Results</a></li>
        <li><a href="/assets/downloads/DS PC Late 2025.xlsx" download>Late 2025 Season Results (Ongoing)</a></li>
    </ul>
</div>

## Past Winner's Gallery
<div class="content-card">
    <p>A place to feature photos of our esteemed champions with the cup. New photos added to the gallery folder will appear here automatically.</p>
    <div class="gallery">
        {% assign sorted_images = site.static_files | where_exp: "item", "item.path contains '/assets/images/winners-gallery/'" | sort: 'path' | reverse %}
        {% for file in sorted_images %}
            <div class="gallery-item">
                <img src="{{ file.path | relative_url }}" alt="Past Winner Photo">
            </div>
        {% endfor %}
    </div>
</div>
