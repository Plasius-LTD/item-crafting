# Item-Crafting Privacy And Scale Baseline

## Goal

Define the minimal crafting work-order payload and validated workshop
throughput assumptions exported by `@plasius/item-crafting`.

## Contract Additions

- `ItemCraftingWorkOrderRecord` exposes only the pseudonymous crafter subject,
  workshop identifier, discipline, workshop tier, and update timestamp.
- `itemCraftingFieldPolicies` documents the sensitivity, retention, and
  justification for every work-order field.
- `itemCraftingPrivacyScaleRollout` publishes the inherited
  `isekai.training-progression.privacy-scale.enabled` control and local env
  override.
- `defaultItemCraftingThroughputAssumptions` and
  `createItemCraftingThroughputAssumptions` document and validate the expected
  envelope for concurrent work orders, workshop dispatches, and crafting-event
  throughput.

## Exclusions

- profile names, payment details, and free-form work notes
- storage or queue implementation details
- workshop UI or gameplay presentation logic
