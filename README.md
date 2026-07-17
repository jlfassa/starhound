# Velvet Atlas — Remaster

Reworked from the supplied Carmen-style prototype.

## Run
Open `index.html` in a browser. No build step is required.

## Files
- `index.html` — interface and warrant modal
- `data.js` — cities, suspects, clues and cases
- `game.js` — rebuilt game loop and state
- `style.css` — rebuilt responsive terminal UI

## Major changes
- Rebuilt the visual identity as a crime-bureau case terminal.
- Fixed route-clue logic so case routes are not blocked by each city's old `possible_clues` list.
- Removed the opening travel/teleport problem: cases now begin in their actual initial city.
- Added evidence board and live suspect filtering.
- Added route progress and visual time meter.
- Added difficulty-based destination decoy counts.
- Rebuilt warrant flow with live suspect database matching.
- Invalid warrants no longer instantly destroy the whole case.
- Added final target-zone logic and arrest authorization.
- Added persistent career statistics and warrant accuracy.
- Added keyboard Escape support for the warrant modal.
- Added responsive mobile/tablet layout and reduced-motion support.
- Preserved the original city, thief, clue and case database as the content base.


## 0.9 — CEREBRO DE FRONTERA
Tutorial CLIP-9 persistente/minimizable, hangar de lanzaderas, compra y selección de naves, salidas cortas con eventos, y capa responsive defensiva para escritorio/tablet/móvil.
