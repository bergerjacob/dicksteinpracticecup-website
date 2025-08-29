---
layout: default
title: History
---
<h1>History &amp; Seasonal Results</h1>

<div class="content-card">
    <p>Click on a season below to see the full week-by-week results in a table. Each season's page also contains a link to download the original Excel spreadsheet.</p>
    <ul>
        {% comment %}
          First, get all the season pages.
        {% endcomment %}
        {% assign season_pages = site.pages | where_exp: "page", "page.path contains 'history/' and page.name != 'history.md'" %}

        {% comment %}
          Next, group the pages by year. The complex-looking line below extracts the "YYYY" part from the filename (e.g., "late-2024.md").
        {% endcomment %}
        {% assign pages_by_year = season_pages | group_by_exp: "page", "page.name | split: '-' | last | split: '.' | first " %}

        {% comment %}
          Sort the groups of years chronologically (e.g., 2024, 2025).
        {% endcomment %}
        {% assign sorted_years = pages_by_year | sort: 'name' %}

        {% comment %}
          Finally, loop through each year's group and then loop through the pages inside that group, sorting them alphabetically ('early' before 'late').
        {% endcomment %}
        {% for year_group in sorted_years %}
          {% assign sorted_pages_in_year = year_group.items | sort: 'name' %}
          {% for page in sorted_pages_in_year %}
            <li><a href="{{ page.url | relative_url }}">{{ page.title }}</a></li>
          {% endfor %}
        {% endfor %}
    </ul>
</div>
