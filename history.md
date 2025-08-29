---
layout: default
title: History
---
<h1>History &amp; Seasonal Results</h1>

<div class="content-card">
    <p>Click on a season below to see the full week-by-week results in a table. Each season's page also contains a link to download the original Excel spreadsheet.</p>
    <ul>
        {% assign season_pages = site.pages | where_exp: "page", "page.path contains 'history/' and page.name != 'history.md'" | sort: 'name' | reverse %}
        {% for page in season_pages %}
            <li><a href="{{ page.url | relative_url }}">{{ page.title }}</a></li>
        {% endfor %}
    </ul>
</div>
