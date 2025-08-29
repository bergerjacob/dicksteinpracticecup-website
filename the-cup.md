---
layout: default
title: The Cup
---


<h1>The Coveted Cup</h1>

<div class="content-card">
    <h2>What Is It?</h2>
    <div class="gallery">
        <div class="gallery-item">
            <img src="/assets/images/cup-1.jpg" alt="Photo of the Practice Cup trophy">
        </div>
        <div class="gallery-item">
            <img src="/assets/images/cup-2.jpg" alt="Photo of the Practice Cup trophy inscription">
        </div>
        <div class="gallery-item">
            <img src="/assets/images/cup-3.jpg" alt="Side view of the Practice Cup trophy">
        </div>
        <div class="gallery-item">
            <img src="/assets/images/cup-4.jpg" alt="Close-up of the Practice Cup trophy base">
        </div>
    </div>
    <p>The trophy features a base, a weird sort of hanger thing that looked like Dick Stein’s cane, and a couple of small chalk boards to depict current High Score + High Series. The winner's names are added each week with a Dymo label maker.</p>
    <p>On the inside of the cane is the inscription: “This cane may be removed only by Dick Stein for admonishment as needed”. On the outside: “ Warning!! Emergency Use Only!!”.</p>
</div>

<div class="content-card">
    <h2>Why the Practice Cup?</h2>
    <p>Back in the early summer of 2024, Joe Berger, Greg Bingham and myself (Bruce Rufener) had just finished playing a few practice games together as we had done on many occasions before, and I suggested that maybe we should make it more of an event, by calling it the Practice Cup. We all agreed that would be cool, so I set about designing a trophy worthy of our elevated station in the sport of bowling.</p>
    <p>The idea was to create a friendly, yet serious mini-tourney that would help us to raise our level of play to be able to more effectively compete in the various leagues we participated in. At first it was just three or four of us (the first 6 tourneys) with odd times and an unusual format- we started with a practice game, before moving on to a three game series. Eventually, we eliminated the practice game and moved to a more predictable schedule, 1:00 on Wednesdays, changing to 9:00 am Thursdays for the summer. We started inviting others to join us (you have to be invited) and the Cup grew to 7, 8, 10, 12 people depending on the day. We’ve had up to 15 and I expect it may grow a bit more, although we will not let it get too big.</p>
    <p>As you can see by the trophy itself, we don’t take ourselves too seriously, but that does not mean that we don’t take the competition seriously- nope! As we say every week, “Good luck and Goooooood bowling!!!”</p>
</div>

<div class="content-card">
    <h2>Where Has It Been?</h2>
    <p>The cup travels with the winner each week. Here are some of the places it has been sighted. New photos added to the locations folder will appear here automatically.</p>
    <div class="gallery">
        {% assign sorted_images = site.static_files | where_exp: "item", "item.path contains '/assets/images/trophy-locations/'" | sort: 'path' | reverse %}
        {% for file in sorted_images %}
            <div class="gallery-item">
                <img src="{{ file.path | relative_url }}" alt="Trophy Location Photo">
            </div>
        {% endfor %}
    </div>
</div>
