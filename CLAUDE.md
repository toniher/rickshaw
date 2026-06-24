# Rickshaw — Project Notes for Claude

## Overview

Rickshaw (v1.7.1) is a JavaScript toolkit for creating interactive time-series graphs, built on top of D3 v3. It is a fork of the [Shutterstock/rickshaw](https://github.com/shutterstock/rickshaw) repo.

## Build & Test

```bash
npm run build       # concatenate + minify src/ → rickshaw.js / rickshaw.min.js
npm test            # run Jest test suite
npm run test:watch  # watch mode
npm run coverage    # Jest with coverage report
npm run lint        # jshint src/js/*
npm run watch       # nodemon watching src/, auto-rebuilds on change
```

The built output (`rickshaw.js`, `rickshaw.min.js`, `rickshaw.css`, `rickshaw.min.css`) is committed to the repo root.

## Source Structure

All source lives under `src/js/`. Key modules:

| File | Purpose |
|---|---|
| `Rickshaw.Graph.js` | Core graph class — scales, layout stack, render loop |
| `Rickshaw.Graph.Renderer.js` | Base renderer class |
| `Rickshaw.Graph.Renderer.{Area,Line,LinePlot,Stack,Bar,ScatterPlot,Surface,DottedLine,Multi}.js` | Renderer implementations |
| `Rickshaw.Graph.Axis.{X,Y,Y.Scaled}.js` | Axis components |
| `Rickshaw.Graph.DragZoom.js` | Drag-to-zoom interaction |
| `Rickshaw.Graph.RangeSlider.Preview.js` | Range slider with preview graph |
| `Rickshaw.Graph.HoverDetail.js` / `HoverDetailStrict.js` | Tooltip/hover components |
| `Rickshaw.Color.Palette.js` | Color palette generation |
| `Rickshaw.Fixtures.Time.js` / `Time.Local.js` | Time tick formatters |
| `Rickshaw.Series.js` / `Series.FixedDuration.js` | Data series management |

## Dependency: D3

Current: **D3 v3.5.x** (`"d3": "^3.5.16"` in package.json). The last release of D3 v3 was 3.5.17 — there is no v3.7.

### D3 v7 Migration — What Would Need to Change

Migrating to D3 v7 is feasible (~1 day of work) but requires changes in three categories:

#### 1. Mechanical namespace flattening (find-and-replace)

| v3 call | v7 equivalent | Affected files |
|---|---|---|
| `d3.scale.linear()` | `d3.scaleLinear()` | Graph.js, Axis.Y.Scaled.js, HoverDetail.js, HoverDetailStrict.js, RangeSlider.Preview.js |
| `d3.svg.line()` | `d3.line()` | Renderer.Line.js, Renderer.LinePlot.js, Renderer.Surface.js, Renderer.Area.js |
| `d3.svg.area()` | `d3.area()` | Renderer.Stack.js, Renderer.Surface.js, Renderer.Area.js |
| `d3.layout.stack()` | `d3.stack()` | Graph.js, Renderer.Multi.js |
| `d3.time.format()` | `d3.timeFormat()` | Fixtures.Time.js, Fixtures.Time.Local.js |

#### 2. Axis constructor split (logic change)

`d3.svg.axis().orient(direction)` was replaced by separate constructors per orientation. Rickshaw uses a dynamic `this.orientation` variable, so a map is needed (`Axis.X.js:67`, `Axis.Y.js:90`):

```js
// v3
var axis = d3.svg.axis().scale(scale).orient(this.orientation);

// v7
const axisFn = { top: d3.axisTop, bottom: d3.axisBottom, left: d3.axisLeft, right: d3.axisRight };
var axis = axisFn[this.orientation](scale);
```

#### 3. `d3.event` removed in v7 (pervasive — 13 call sites)

`d3.event` was removed entirely in v7; handlers now receive the native browser event as the first argument. Affects:
- `Rickshaw.Graph.DragZoom.js` — 9 sites (lines 42, 64, 86–97)
- `Rickshaw.Graph.RangeSlider.Preview.js` — 4 sites (lines 347, 412, 413, 415)

Each handler needs `function(event, d)` signature and all `d3.event` refs replaced with `event`.

#### 4. `d3.stack()` data format change (logic change)

The stack layout's input/output format changed significantly in v4+. Needs careful refactoring in `Graph.js:188` and `Renderer.Multi.js:122`.

#### Unchanged in v7 (no migration needed)

`d3.select`, `d3.min`, `d3.max`, `d3.rgb`, `d3.interpolateHsl`, `d3.interpolateRgb`, `d3.interpolateNumber` — all still exist with the same API.

## Tests

Tests use Jest with `jest-environment-jsdom`. Test files live in `tests/`. Recent migration from nodeunit to Jest (see commit history). Run with `npm test`.
