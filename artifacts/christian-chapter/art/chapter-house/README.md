# Chapter House asset source

Authored house for the public homepage. This is not the 11+ Learning Commons.

## Toolchain

- Blender **4.2 LTS** when available
- Node.js for the always-on authoring fallback

```bash
node scripts/build-chapter-house.mjs
```

If Blender is missing, the script still writes an authored GLB and designed posters. It never builds a runtime-procedural campus.

Set `BLENDER_BIN` if Blender is not in the usual macOS locations.

## Outputs

- `art/chapter-house/chapter-house.blend` when Blender ran
- `public/models/chapter-house.glb`
- `public/images/chapter-house/chapter-house-desktop.{svg,webp,avif}`
- `public/images/chapter-house/chapter-house-mobile.{svg,webp,avif}`

## Furnishings

Scanned / modelled furniture is CC0 from [Poly Haven](https://polyhaven.com):
sofa_03, ArmChair_01, WoodenTable_03, CoffeeTable_01, painted_wooden_chair_01,
wooden_bookshelf_worn, book_encyclopedia_set_01, vintage_oil_lamp, brass_vase_01,
potted_plant_02, painted_wooden_bench. Refresh with `pnpm assets:furnishings`.

## Art direction

- Domestic Christian Chapter house, not a church nave and not a school campus
- Symbolic still-life, not an open Sims room: door, table, books, path, garden, basin, lamp
- Ivory plaster, walnut, brass, evergreen planting, late-afternoon light
- No baked text. Destination labels stay HTML
- Named roots: `Threshold`, `Table`, `Library`, `Path`, `Garden`, `Courtyard`, `Membership`
