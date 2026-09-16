# Babylon Flow™ Trip OS --- Context & Seed Data

> Source of truth for quickly building and maintaining the first usable
> version of **Babylon Flow™ Trip OS**.

## 1. Project Identity

-   **App:** Babylon Flow™ Trip OS
-   **Trip:** España 2026
-   **Dates:** 22.08.2026--23.09.2026
-   **Language:** English, with occasional Spanish
-   **Deployment:** GitHub Pages
-   **V1 data model:** one master device using `localStorage`
-   **Photos:** none required
-   **Admin mode:** enabled
-   **Tone:** absurdly serious presentation of unserious group lore
-   **Visual direction:** Ibiza nightclub × Bloomberg terminal × GTA ×
    luxury nightlife × trashy 2000s internet

### Core Rule

The app must be understandable in roughly 10 seconds and common actions
should take no more than 2--3 taps.

------------------------------------------------------------------------

## 2. Current Active Group

These are the **only currently active travelers** and should appear by
default on the main dashboard.

  -----------------------------------------------------------------------
  Name                    Display Name            Character / Running
                                                  Joke
  ----------------------- ----------------------- -----------------------
  Philipp                 P to the K              Cat; the one with the
                                                  Spanish girlfriend;
                                                  brought DJ equipment
                                                  and DJs at the house

  Ainhoa                  Ainhoa                  Beer; Philipp's
                                                  girlfriend; Latina

  Nerea                   Nerea                   Ainhoa's sister;
                                                  ongoing lore with
                                                  Daniel

  Tibi                    Tibi                    Dog; Romanian/Italian
                                                  ganja man; inventor of
                                                  the name "Babylon Flow"

  Luisa                   Luul                    Tibi's girlfriend

  Sven                    WaggerBagger            Elephant; always
                                                  complaining; "El
                                                  Trafficante";
                                                  smokes/drinks
                                                  everything; can sleep
                                                  through anything

  Robin                   Roger                   Lion; designated woman
                                                  hunter / "top scorer"
  -----------------------------------------------------------------------

### Former / Inactive Trip Members

Do **not** show these people on the default active dashboard, but keep
them available in historical events, quotes, lore and Spain Wrapped:

-   Taeyong / Tay Tay --- Noodles; Nico's girlfriend
-   Alex / Lex --- Mouse; "the alcoholic"
-   Nico / Greiner --- Giraffe; "the most German Spanish boy"
-   Daniel --- "the player"; Crazy Ass lore; kissed Nerea many times;
    cockroach romance lore
-   Ruben --- already left
-   Marvin --- already left; "Woisch oldr"
-   Jan --- full-send alcoholic

Use an `active: false` field for these people if they are seeded into
the app.

------------------------------------------------------------------------

## 3. Character Stats

Each active character has:

-   Aura
-   Reliability
-   Spanish Fluency
-   Chaos
-   Fiscal Responsibility
-   Ibiza Performance
-   Sex Appeal
-   XP
-   Stock Price

### Starting Logic

For V1:

-   Most ratings start randomly around **35--65 / 100**.
-   Values should feel different enough that characters do not look
    identical.
-   Light lore-based bias is allowed where it makes the joke better.
-   Do not make starting stats insulting or relationship-hostile.
-   XP starts at **0**.
-   Stock price starts randomly between **€50 and €150**.
-   Stats may later exceed the initial range through events.
-   Keep values editable through Admin Mode.

Example data shape:

``` js
{
  id: "sven",
  name: "Sven",
  displayName: "WaggerBagger",
  active: true,
  character: "Elephant",
  lore: ["El Trafficante", "Can sleep through anything"],
  stats: {
    aura: 54,
    reliability: 41,
    spanish: 38,
    chaos: 64,
    fiscalResponsibility: 43,
    ibizaPerformance: 59,
    sexAppeal: 52,
    xp: 0
  },
  stockPrice: 112.40
}
```

------------------------------------------------------------------------

## 4. Important Locations

### Jávea / Xàbia

Main base of operations.

### Kandhala

The go-to club.

Treat it as a recurring location/category in events and side quests.

### Granadella

The most beautiful beach of the trip.

### Rage Cage

The pregame location.

### Alicante

Associated with a **crazy night out**.

### Ibiza

Associated with the **craziest 24-hour visit of the vacation**.

### Valencia

Visited during España 2026.

### Madrid

Visited during España 2026.

------------------------------------------------------------------------

## 5. Existing Babylon Lore

Seed these as lore/context. They do not all need to appear as timeline
events immediately.

-   Sven is **El Trafficante**.
-   "El Trafficante" means that when someone passes a drink or joint,
    the person passing it gets one sip/hit.
-   Sven smokes and drinks basically everything.
-   Sven can sleep no matter what is happening.
-   Robin's recurring mission is to hook up with girls and become the
    trip's "top scorer".
-   Daniel and Nerea kissed many times.
-   Everyone insists that **they themselves are not sunburned; everyone
    else is**.
-   Daniel accidentally used **"Crazy Ass"** instead of **"Gracias"**.
-   Alicante produced a crazy night out.
-   Ibiza was the most chaotic 24-hour visit of the vacation.
-   **Babylon Flow** was originally an album name invented by Tibi.
-   The group started a **single-shoe collection**.
-   Shoe #1: a suit shoe found in the parking lot in front of Moly Club.
-   Shoe #2: a swimming shoe found later.
-   There were good pool parties with guys the group knows from Germany.
-   Inviting girls to the pool party is recurring trip behavior.
-   Daniel has "fallen in love with a cockroach" in the group lore.
-   Philipp brought DJ equipment and plays music at the house.
-   The group randomly met British girls from the previous year again.
-   The Cannabis Social Club is a recurring chill/restock location.
-   The group has already played padel twice.

------------------------------------------------------------------------

## 6. Seed Quotes / Expressions

### El Trafficante

Meaning:

> When passing a drink or joint, the person passing it gets one sip/hit.

Associated primarily with Sven.

### Crazy Ass

Origin:

> Daniel saying "Crazy Ass" instead of "Gracias".

### Woisch oldr

Associated with Marvin.

Meaning:

> "Weißt, Alter?"

Keep the original phrase for quote/lore purposes.

------------------------------------------------------------------------

## 7. Event System

Events should support:

``` text
Title
Description
People involved
Location
Category
Timestamp
Stat changes
Stock changes
XP
Optional achievement
```

Suggested categories:

-   Party
-   Club
-   Beach
-   Romance
-   Fail
-   Legendary
-   Food
-   Alcohol
-   Weed
-   Travel
-   Sport
-   Pool Party
-   Quote
-   Court
-   Side Quest
-   Random Lore

### Automatic Effects

An event **may** automatically:

-   change stats;
-   award XP;
-   move stock prices;
-   unlock achievements.

Effects should be small most of the time.

Large moves should be reserved for unusually funny/legendary events.

------------------------------------------------------------------------

## 8. Side Quest Rules

**Chaos level: 5/5.**

The quests should feel bold, unpredictable and funny, while remaining
safe and legal.

### Important Relationship Rule

Existing relationships must be respected:

-   Philipp ↔ Ainhoa
-   Tibi ↔ Luisa

Do not generate quests that require cheating, sexual contact with
another person, deliberately causing jealousy, or otherwise undermining
an existing relationship.

Social interaction with strangers is fine when it does not conflict with
this rule.

### Quest Categories

-   Club
-   Beach
-   Bar
-   Pregame
-   Restaurant
-   Supermarket
-   Car
-   Airport
-   House
-   Pool Party
-   Anywhere
-   Duo Mission

### Rarity

-   Common
-   Rare
-   Epic
-   Legendary

Higher rarity = stranger/more memorable, not more dangerous.

------------------------------------------------------------------------

## 9. Babylon Court / VAR

Court should be biased toward comedy.

### Verdict Distribution

Prefer outcomes roughly like:

-   Guilty: common
-   Technically Guilty: common
-   Not Guilty: uncommon
-   Case Dismissed Due to Babylon Law: rare

Do not pretend the verdict has any real authority.

### Flow

``` text
Accused selected
↓
Accusation entered
↓
Optional defense
↓
ANALYSING EVIDENCE...
↓
CHECKING VAR...
↓
CONSULTING BABYLON LAW...
↓
VERDICT
↓
SENTENCE
```

### Example Punishment Pool

-   Speak only Spanish for the next 15 minutes.
-   Complete one random side quest.
-   Do 20 push-ups.
-   Lose 10 Aura.
-   Gain 10 Chaos.
-   Wear a ridiculous accessory chosen by the group for 30 minutes.
-   Become El Trafficante for the next round.
-   Deliver a formal public apology to Babylon Flow.
-   Let another player choose your next non-alcoholic drink/snack.
-   Give a dramatic 30-second courtroom speech.
-   Use "Crazy Ass" instead of "Gracias" once.
-   Receive a temporary stock-market downgrade.
-   Become responsible for the next group photo.
-   Carry the Babylon shoe, if available, for the next journey.

Punishments should remain safe, legal and compatible with relationships.

------------------------------------------------------------------------

## 10. Trip Stock Exchange

Each person has a fake share price.

### Starting Price

Random:

``` text
€50.00–€150.00
```

### Event Effects

Events can automatically move stock prices.

Typical:

``` text
±1% to ±8%
```

Major lore event:

``` text
±8% to ±25%
```

Absurd exceptional event:

``` text
up to roughly ±40%
```

Generate fake Bloomberg-style headlines.

Examples:

> **WAGGERBAGGER -18.4%** --- Investor confidence deteriorates following
> another unexplained disappearance.

> **P TO THE K +11.7%** --- Strong DJ performance drives after-hours
> guidance upgrade.

The market is deliberately fictional and unserious.

------------------------------------------------------------------------

## 11. Aura Credit Score

Optional secondary score visualization.

Suggested starting point:

``` text
500
```

Events can move the score.

Example:

``` text
Ordered water at 03:14
+17 Fiscal Responsibility
-8 Ibiza Aura
```

Keep this secondary to the main character stats.

------------------------------------------------------------------------

## 12. Achievements

Create approximately **30 achievements** initially.

Mix easy, rare and secret achievements.

Example themes:

-   Spain
-   Spanish language
-   Clubbing
-   Padel
-   Pool parties
-   Babylon Court
-   Quotes
-   Trafficante
-   Shoes
-   Sunburn
-   DJing
-   NPC encounters
-   Ibiza
-   Alicante
-   Sleeping
-   Romance
-   Side quests
-   Stock-market crashes/comebacks

Achievements should have:

``` text
Name
Description
Icon/emoji or simple symbol
Rarity
XP reward
Unlocked by
Secret: true/false
```

Avoid achievements that encourage dangerous behavior.

------------------------------------------------------------------------

## 13. Quote System

Adding a quote should take only a few seconds.

Fields:

``` text
Quote
Speaker
Context (optional)
Location (optional)
Timestamp
```

Quotes feed into:

-   timeline;
-   character profiles;
-   Who Said This?;
-   Spain Wrapped.

------------------------------------------------------------------------

## 14. Who Said This?

Later feature.

Use stored quotes to generate a multiple-choice game.

Default:

-   one quote;
-   four possible people;
-   reveal answer;
-   track temporary game score.

Prioritize funny quotes with enough context removed that guessing is
possible.

------------------------------------------------------------------------

## 15. NPC System

Later feature for memorable strangers.

Fields:

``` text
Nickname
Encounter location
Nationality (optional)
Lore
Danger/Chaos Level
Associated group members
Side quest
Chance of ever seeing them again
```

Do not require real names or personal contact information.

------------------------------------------------------------------------

## 16. Admin Mode

Admin Mode is required.

It should allow:

-   change character stats;
-   change XP;
-   edit stock prices;
-   create/edit/delete events;
-   create/edit/delete quotes;
-   activate/deactivate characters;
-   award/remove achievements;
-   edit lore;
-   add secret quotes;
-   reset selected data;
-   export all data;
-   import all data.

### Important

Because V1 uses one-device `localStorage`, add:

``` text
EXPORT BABYLON DATA
IMPORT BABYLON DATA
```

Export should download/copy a JSON backup.

This protects the trip history if browser storage gets cleared.

------------------------------------------------------------------------

## 17. Spain Wrapped 2026

This is the eventual finale and should influence how data is stored from
day one.

Potential metrics:

-   Most XP
-   Highest Aura
-   Lowest Aura
-   Highest Chaos
-   Highest Sex Appeal
-   Most reliable
-   Most court appearances
-   Most guilty verdicts
-   Most achievements
-   Most quotes
-   Most quoted person
-   Most side quests
-   Biggest stock gain
-   Biggest stock crash
-   Biggest comeback
-   Most active location
-   Most legendary events
-   Quote of the trip
-   Event of the trip
-   Character of each location
-   Shoe collection count

Final card:

> **BABYLON FLOW™ --- ESPAÑA 2026**\
> *The data suggests this should not have worked.*

------------------------------------------------------------------------

## 18. V1 Navigation

Keep the initial navigation extremely small.

### Home

Show:

-   active character cards;
-   current stock ticker;
-   recent timeline;
-   achievement popups.

### Four Primary Actions

``` text
EVENT
SIDE QUEST
COURT
QUOTE
```

Secondary menu:

``` text
CHARACTERS
ACHIEVEMENTS
MARKET
LORE
ADMIN
```

Do not clutter V1 with unfinished future features.

------------------------------------------------------------------------

## 19. Visual Personality

Combine:

-   Ibiza nightlife
-   Bloomberg financial terminal
-   GTA-like satire
-   luxury club branding
-   deliberately tacky 2000s internet moments

But usability wins over visual jokes.

### UI Principles

-   mobile-first;
-   dark;
-   large tap targets;
-   strong typography;
-   fast;
-   minimal forms;
-   fake serious terminology;
-   dramatic result screens;
-   screenshot-friendly cards;
-   occasional Spanish terminology;
-   no unnecessary onboarding.

Potential terminology:

``` text
BABYLON TERMINAL
MARKET OPEN
VAR REVIEW
INCIDENT REPORT
AURA INDEX
BABYLON LAW
TRIP INTELLIGENCE
LEGENDARY EVENT
TRAFFICANTE PROTOCOL
```

------------------------------------------------------------------------

## 20. Development Constraints

For the first usable build:

``` text
HTML
CSS
Vanilla JavaScript
localStorage
GitHub Pages
```

No:

``` text
backend
login
database server
framework
build system
AI API requirement
```

Randomized text/templates should handle V1 Court, market headlines and
quests.

AI features can be added later if they genuinely improve the experience.

------------------------------------------------------------------------

## 21. Data Persistence

Use one master device.

All state should be serializable into one JSON structure.

Suggested top-level shape:

``` js
{
  trip: {},
  people: [],
  events: [],
  quotes: [],
  quests: [],
  courtCases: [],
  achievements: [],
  marketHistory: [],
  lore: [],
  settings: {}
}
```

Every generated/created object should receive:

``` text
unique ID
createdAt timestamp
```

This makes later migration to a shared backend substantially easier.

------------------------------------------------------------------------

## 22. Current Build Priority

Build in this order:

1.  Seed active + inactive characters.
2.  Home dashboard.
3.  Character stats.
4.  Event creation.
5.  Quote creation.
6.  Timeline.
7.  Side Quest generator.
8.  Court / VAR.
9.  Admin Mode.
10. JSON export/import.
11. Achievements.
12. Stock market.
13. Polish and GitHub Pages deployment.

Only after V1 is actively being used:

-   Who Said This?
-   NPC Generator
-   Wanted Posters
-   Duo Missions
-   Lore Graph
-   Morning After Report
-   Spain Wrapped
-   shared multi-device database

------------------------------------------------------------------------

## 23. Definition of Success

The app succeeds if someone can open it during the trip, record
something funny in seconds, and immediately get something entertaining
back.

**Do not turn Babylon Flow into productivity software.**

The trip creates the content.

The app simply turns it into lore.
