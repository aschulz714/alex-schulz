---
title: Tennis Patterns
blurb: A point-construction trainer built on 1.85 million professional points from the Match Charting Project — what are my options from here, what do pros pick, and how does each choice work out. Personal use only.
description: A command-line coach and drill tool that parses the Match Charting Project's shot-by-shot notation into 6.8 million shots, validates the parser against the charters' own point winners, and answers situational questions about serve, return, and rally choices with pro outcome rates.
category: python
projectType: research
year: 2026
plate: 13
figure:
  src: figures/tennis-patterns.jpg
  alt: Two bar charts comparing crosscourt and down-the-line outcomes for forehands and backhands at three incoming ball depths
  caption: "Crosscourt or down the line, by wing and incoming depth. Deep balls favor crosscourt; short balls reward the line. Correlations, not causes."
  ratio: '2362/1007'
  source: Tennis Abstract Match Charting Project, CC BY-NC-SA 4.0
tech:
  - Python
  - pandas + pyarrow
  - Match Charting Project data
  - Parser validation
status: Personal tool; non-commercial by license
role: Builder and user
scale:
  - 1,853,115 charted points from 11,600+ pro matches
  - 6.77 million parsed shots with wing, lane, depth, and outcome
  - 98.35% of points parsed; winner agrees with the charters 99.994% of the time
proof:
  - Parser re-derives each point's winner from notation and checks it against the independent PtWinner column
  - "Geometry check: 99.4% of balls on a right-hander's forehand side are hit with a forehand"
  - Serve stats reproduce published ATP averages, 72.5% and 51.0% of first and second-serve points won
  - Undocumented notation quirks handled, recovering about 13% of points
artifact:
  label: Coach CLI + drill mode
  detail: Situational queries by wing, side, depth, court, serve number, tour, hand, and surface, plus a quiz mode that asks you to guess the play before showing what pros do.
caseStudy:
  question: In a given situation on court, what do professionals actually choose, and how often does each choice win the point?
  data: The Match Charting Project's crowd-sourced shot-by-shot records, one compact notation string per point.
  method: Parse the notation into shots with wing, incoming and outgoing direction, depth, and terminal outcome; derive crosscourt versus down-the-line from the receiver-relative direction codes; validate against the charters' winners; then aggregate by situation with sample sizes shown.
  signal: The baseline for a rally shot is about 45 percent because more points end in errors than winners. Against that baseline, deep incoming balls favor crosscourt and short balls reward going down the line, on both wings.
  why: It is the same discipline as the accounting work, applied to a hobby. Parse carefully, validate against an independent source, state the sample size, and say what the numbers cannot prove.
featured: false
---

## The question it answers

Point-construction coaching usually comes as a subscription or a video. The data to answer the practical question already exists: given the ball I am looking at, what are my options, what do professionals pick, and how does each choice tend to end? The Match Charting Project has recorded that for more than 11,600 matches, one compact string per point.

## Getting the parse right

The notation is dense. A string like `4f28b39f1*` is a wide serve, a forehand return to the middle at medium depth, a backhand deep to the opponent's left, and a forehand winner. Direction codes are relative to the receiver, so crosscourt versus down the line has to be worked out from geometry, and the hitting wing depends on each player's handedness. Two quirks in the real data are absent from the official instructions, and handling them recovers about 13 percent of points.

The parser is checked rather than trusted. It re-derives who won each point from the notation alone and compares that to the point-winner column the charters produced independently. On 1,853,115 points, 98.35 percent parse and the winner agrees 99.994 percent of the time. Geometry is checked separately: 99.4 percent of balls arriving on a right-hander's forehand side are hit with a forehand, left-handers mirror it, and serve statistics reproduce published tour averages.

## What the numbers mean

A rally shot's baseline win rate is about 45 percent, not 50, because errors outnumber winners and the error is charged to the player who hit last. Every output is a correlation. Players go down the line when the ball invites it, so conditioning on incoming depth is the most important filter in the tool, and even then the result is "what tends to happen around this choice," not "this choice causes this result."

## License

The underlying data is the Tennis Abstract Match Charting Project, licensed CC BY-NC-SA 4.0. Attribution is required and commercial use is not permitted. This tool is for personal use, and the chart on this page is shared under the same terms.
