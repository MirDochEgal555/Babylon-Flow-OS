# Babylon Flow™ Trip OS

> A deliberately overengineered operating system for a Spain trip that
> turns stupid moments, quotes, challenges and group lore into a shared
> game.

## Project Goal

Build a **simple, mobile-first static web app** that the group can open
from a URL and use throughout the trip.

**Deployment:** GitHub Pages\
**Initial stack:** HTML + CSS + vanilla JavaScript\
**Rule:** No backend, accounts, build system or unnecessary
infrastructure for V1.

The first version should be fun within minutes. Features can become more
ridiculous later.

------------------------------------------------------------------------

## V1 --- Minimum Fun Product

Start with one home screen and four large buttons:

1.  **EVENT**
2.  **SIDE QUEST**
3.  **COURT**
4.  **QUOTE**

Also show the group's character cards and a few fake stats.

### Character Cards

Each traveler gets a card with optional photo/name and deliberately
unserious stats:

-   Aura
-   Reliability
-   Spanish Fluency
-   Chaos
-   Fiscal Responsibility
-   Ibiza Performance Rating
-   XP
-   Achievements

Stats are entertainment only and can initially be changed manually.

### EVENT

Log something that happened.

Fields:

-   Person(s)
-   Short title
-   Description
-   Location (optional)
-   Category
-   Stat change (optional)

Example:

> **The Supermarket Incident**\
> Sven tried Spanish for 4 minutes. Nobody involved spoke Spanish.\
> Spanish Fluency +3 · Aura +8 · Reliability -2

Events become part of the trip timeline.

### SIDE QUEST

Generate a random small challenge.

Possible categories:

-   Beach
-   Club
-   Bar
-   Supermarket
-   Airport
-   Car
-   Restaurant
-   Anywhere

Each quest has:

-   Mission
-   Difficulty
-   XP
-   Rarity: Common / Rare / Legendary
-   Complete / Reroll

Keep quests funny, social and harmless.

### COURT

Settle pointless group disputes with unnecessary ceremony.

Inputs:

-   Accused
-   Accusation
-   Optional defense

Flow:

`SUBMIT → CHECKING EVIDENCE... → REVIEWING VAR... → VERDICT`

Output:

-   Guilty / Not Guilty / Technically Guilty
-   Ridiculous reasoning
-   Sentence

Example sentence:

> Must speak only Spanish when ordering the next round.

### QUOTE

Save things people say during the trip.

Store:

-   Quote
-   Person
-   Date
-   Optional context

Important: quotes should be easy to add in under 10 seconds.

Later these feed into **Who Said This?** and **Spain Wrapped**.

------------------------------------------------------------------------

## V1.1 --- Group Achievements

Create unlockable achievements triggered manually or from events.

Examples:

-   **International Relations** --- successfully communicate despite a
    language barrier
-   **Fiscal Disaster** --- make an objectively questionable purchase
-   **Side Character** --- disappear and return with unexplained lore
-   **Local Legend** --- get recognized somewhere twice
-   **No Context Required** --- produce a quote that cannot be explained
-   **VAR Survivor** --- win a Babylon Court case

Show a dramatic achievement popup when unlocked.

------------------------------------------------------------------------

## V1.2 --- Trip Stock Exchange

Everyone becomes a publicly traded company.

Example:

``` text
PHIL ▲ 12.4%
SVEN ▼ 31.8%
ROBIN ▲ 4.2%
```

Events can move fake share prices.

Generate fake financial headlines:

> **SVEN tumbles 18% following late-night operational uncertainty.**

> **PHIL rallies after stronger-than-expected Spanish-language
> performance.**

No real finance logic required. The more unnecessarily serious the
presentation, the better.

------------------------------------------------------------------------

## V1.3 --- Aura Credit Score

Everyone starts around 500.

Events can add or remove points.

Example:

> Ordered water at 03:14\
> +17 Fiscal Responsibility\
> -8 Ibiza Aura

Show the current score and recent reasons for changes.

------------------------------------------------------------------------

## V2 --- More Chaos

### Who Said This?

Turn saved quotes into a group quiz.

Show a quote and four possible people. Track scores.

This feature becomes better the longer the Quote database grows.

### NPC Generator

Save memorable people encountered during the trip.

Fields:

-   Nickname
-   Where encountered
-   Nationality (optional)
-   Lore
-   Danger level
-   Side quest
-   Probability of ever seeing them again

Display them as collectible RPG-style cards.

### Random Duo Missions

Randomly pair two group members and assign them a cooperative mission.

Goal: create unexpected combinations instead of the same people always
doing things together.

### Spain Wanted Posters

Select:

-   Person
-   Crime
-   Reward

Generate a fake poster.

Example:

> **WANTED: SVEN**\
> Crime: Catastrophic Spanish Pronunciation\
> Reward: 2 Cervezas

Image generation can come later; V1 can simply render a styled poster
that can be screenshotted.

### Relationship / Lore Graph

Visualize the increasingly stupid connections between:

-   People
-   Places
-   Events
-   NPCs
-   Objects
-   Quotes

Example:

`Robin → Lost → Shoe → Ibiza → Sven → 04:37`

This should eventually become almost impossible to understand.

### Morning After Report

Everyone submits fragments of what they remember.

The app builds an "official" timeline and highlights contradictory
testimony.

Can initially work without AI by simply grouping submissions
chronologically.

------------------------------------------------------------------------

## Finale --- SPAIN WRAPPED 2026

The payoff.

Use all accumulated trip data to generate a Spotify-Wrapped-style recap.

Possible slides/cards:

-   Most XP
-   Biggest liability
-   Highest Aura
-   Largest stock-market collapse
-   Biggest comeback
-   Most side quests completed
-   Most court appearances
-   Most guilty verdicts
-   Most quoted person
-   Quote of the trip
-   Most encountered NPC
-   Latest recorded incident
-   Most chaotic location
-   Achievement leader
-   Timeline of major incidents

The final screen:

> **BABYLON FLOW™ --- SPAIN 2026**\
> *The data suggests this should not have worked.*

------------------------------------------------------------------------

## Technical Plan

### Keep V1 deliberately simple

``` text
babylon-flow-trip-os/
├── index.html
├── style.css
├── app.js
├── data.js
├── assets/
│   └── images/
└── README.md
```

### Storage

Use `localStorage` initially for:

-   People
-   Events
-   Quotes
-   Achievements
-   Scores
-   Court cases

This makes GitHub Pages deployment trivial.

**Limitation:** localStorage is device-specific. The first version
therefore works best on one designated "Babylon device."

If everyone needs synchronized data later, add something lightweight
such as Supabase or Firebase. Do **not** start there.

### GitHub Pages

Target workflow:

``` text
GitHub repository
      ↓
main branch
      ↓
GitHub Pages
      ↓
https://<username>.github.io/babylon-flow-trip-os/
```

No server required.

------------------------------------------------------------------------

## Design Direction

Think:

**Ibiza nightclub × Bloomberg terminal × PlayStation achievements ×
terrible government software**

But keep the interface clean enough to actually use while drunk/tired/on
a beach.

Requirements:

-   Mobile-first
-   Dark interface
-   Large buttons
-   Minimal typing
-   Strong typography
-   Dramatic fake loading screens
-   Cards that screenshot well
-   Animations only where they improve the joke
-   Maximum 2--3 taps for common actions

------------------------------------------------------------------------

## Coding Order

### Session 1

Build:

-   Home screen
-   Group member cards
-   EVENT
-   QUOTE
-   localStorage
-   Basic timeline

**Goal:** deploy to GitHub Pages immediately.

### Session 2

Add:

-   Side Quest generator
-   Babylon Court / VAR
-   Achievements

### Session 3

Add:

-   Stock Exchange
-   Aura Credit Score
-   Who Said This?

### Later

Only if the project is actually being used:

-   NPC cards
-   Duo missions
-   Wanted posters
-   Lore graph
-   Morning After Report
-   Shared online database
-   Spain Wrapped

------------------------------------------------------------------------

## Core Product Rule

Every feature must pass this test:

> **Can someone understand it and use it within 10 seconds?**

If not, simplify it.

The app should not become a serious trip organizer. No itineraries,
expense management, maps or productivity features unless they directly
contribute to the joke.

------------------------------------------------------------------------

## First Coding Prompt

Use this as the initial vibe-coding prompt:

``` text
Build a mobile-first static web app called "Babylon Flow™ Trip OS".

It is a humorous operating system for a group of friends on a Spain trip.

Use only HTML, CSS and vanilla JavaScript so it can be hosted directly on GitHub Pages. Do not use a framework, backend, database, authentication or build step.

Create a dark, polished interface inspired by a mixture of an Ibiza nightclub, Bloomberg terminal and video-game achievement system.

V1 needs:

1. A home dashboard with character cards for group members.
2. Each character has Aura, Reliability, Spanish Fluency, Chaos and XP stats.
3. An EVENT button that lets us log a funny incident involving one or more people.
4. A QUOTE button that saves a quote, speaker and optional context.
5. A SIDE QUEST button that randomly generates a challenge from a hard-coded JavaScript list.
6. A COURT button where we select an accused person, enter an accusation, show a dramatic "CHECKING VAR..." animation and then generate a random humorous verdict and sentence.
7. A timeline showing recent events.
8. Save all user-created data in localStorage so it survives page reloads.
9. Make all common actions easy to use on a phone.
10. Keep the code simple, readable and split into index.html, style.css, app.js and data.js.

Do not overengineer anything.

Add a footer:
"BABYLON FLOW™ — SPAIN 2026"

The app should already be fun and fully usable after this first implementation.
```

------------------------------------------------------------------------

## Definition of Done for V1

V1 is finished when:

-   It opens correctly on a phone.
-   Everyone appears as a character.
-   An event can be added in seconds.
-   Quotes can be stored.
-   Side quests work.
-   Court produces ridiculous verdicts.
-   Data survives refreshes.
-   The timeline updates.
-   It is live through GitHub Pages.
-   Someone in the group laughs without needing the app explained to
    them.

Everything after that is DLC.
