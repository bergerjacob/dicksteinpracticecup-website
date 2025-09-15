---
layout: default
title: Video
---

<h1>Video Highlights</h1>

{% for video in site.data.highlights.videos %}
<div class="content-card">
    <h2>{{ video.title }}</h2>
    {% if video.description %}
        <p>{{ video.description }}</p>
    {% endif %}
    <div class="video-container">
        <iframe 
            width="560" 
            height="315" 
            src="{{ video.url | replace: 'watch?v=', 'embed/' | replace: '/shorts/', '/embed/' }}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    </div>
</div>
{% else %}
<div class="content-card">
    <p>No video highlights have been added yet.</p>
</div>
{% endfor %}

<style>
.video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;
    max-width: 100%;
    background: #000;
}
.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
