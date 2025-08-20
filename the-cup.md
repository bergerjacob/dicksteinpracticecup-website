---
layout: default
title: The Cup
---

<h1>The Coveted Cup</h1>

<div class="content-card">
    <h2>What Is It?</h2>
    <div class="placeholder-image" style="height: 300px;">[Image(s) of the Cup and its inscriptions]</div>
    <p>[Insert text here describing the physical cup, its appearance, and the details of the inscriptions.]</p>
</div>

<div class="content-card">
    <h2>Why?</h2>
    <p>[Insert the brief story here, written by you, Greg, and Bruce, explaining why the cup was created.]</p>
</div>

<div class="content-card">
    <h2>Where Has It Been?</h2>
    <p>The cup travels with the winner each week. Here are some of the places it has been sighted. New photos added to the locations folder will appear here automatically.</p>
    <div class="gallery">
        {% for file in site.static_files %}
            {% if file.path contains '/assets/images/trophy-locations/' %}
                <div class="gallery-item">
                    <img src="{{ file.path | relative_url }}" alt="Trophy Location Photo">
                </div>
            {% endif %}
        {% endfor %}
    </div>
</div>
