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

## High Scores
<div class="content-card">
    <p>[A section to highlight high scores, like best series, 300 games, etc., will be added here.]</p>
</div>

## Past Results
<div class="table-container">
    <table>
        <thead>
            <tr>
                <th>Winner</th>
                <th>Week Of</th>
                <th>Series</th>
            </tr>
        </thead>
        <tbody>
            {% for winner in site.data.winners %}
            <tr>
                <td>{{ winner.name }}</td>
                <td>{{ winner.week }}</td>
                <td>{{ winner.series }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>

## Past Winner's Gallery
<div class="content-card">
    <p>A place to feature photos of our esteemed champions with the cup.</p>
    <div class="gallery">
        <div class="placeholder-image"></div>
        <div class="placeholder-image"></div>
        <div class="placeholder-image"></div>
    </div>
</div>
