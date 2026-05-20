# @plasius/item-crafting

[![npm version](https://img.shields.io/npm/v/@plasius/item-crafting.svg)](https://www.npmjs.com/package/@plasius/item-crafting)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Plasius-LTD/item-crafting/ci.yml?branch=main&label=build&style=flat)](https://github.com/Plasius-LTD/item-crafting/actions/workflows/ci.yml)
[![coverage](https://img.shields.io/codecov/c/github/Plasius-LTD/item-crafting)](https://codecov.io/gh/Plasius-LTD/item-crafting)
[![License](https://img.shields.io/github/license/Plasius-LTD/item-crafting)](./LICENSE)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-yes-blue.svg)](./CODE_OF_CONDUCT.md)
[![Security Policy](https://img.shields.io/badge/security%20policy-yes-orange.svg)](./SECURITY.md)
[![Changelog](https://img.shields.io/badge/changelog-md-blue.svg)](./CHANGELOG.md)

Apprenticeship-gated item-crafting access and authority boundary contracts for Plasius.

Apache-2.0. ESM + CJS builds. TypeScript types included.

## Installation

```bash
npm install @plasius/item-crafting
```

## Scope

`@plasius/item-crafting` owns the authority-side boundary for:

- apprenticeship-gated access state
- crafting discipline readiness
- workshop boundary metadata
- privacy-safe crafting work-order payloads and workshop throughput assumptions

## Demo

```bash
npm run build
node demo/example.mjs
```

## Usage

```ts
import {
  createItemCraftingAccessState,
  createItemCraftingWorkOrderRecord,
  defaultItemCraftingThroughputAssumptions,
  itemCraftingPrivacyScaleRollout,
} from "@plasius/item-crafting";

const state = createItemCraftingAccessState({
  apprenticeshipReady: true,
  discipline: "smithing",
  workshopTier: "local",
});

const workOrder = createItemCraftingWorkOrderRecord({
  crafterSubjectId: "crafter-sub-1",
  workshopId: "workshop-1",
  discipline: state.discipline,
  workshopTier: state.workshopTier,
  updatedAtIso: new Date().toISOString(),
});

console.log(itemCraftingPrivacyScaleRollout.featureFlagId);
console.log(defaultItemCraftingThroughputAssumptions.maxConcurrentWorkOrders);
console.log(workOrder.workshopId);
```

## Privacy And Scale Baseline

The package exports an inherited rollout descriptor for the cross-repo feature
flag `isekai.training-progression.privacy-scale.enabled`.

When that rollout is enabled, package consumers should prefer the minimal
`ItemCraftingWorkOrderRecord` contract:

- `crafterSubjectId` is the only player-linked identifier and is expected to be
  pseudonymous
- profile names, chat text, payment details, and free-form work notes are
  outside the package contract
- `itemCraftingFieldPolicies` documents the retention and sensitivity
  expectation for every exported work-order field
- `defaultItemCraftingThroughputAssumptions` publishes the validated workshop
  and crafting-event envelope used by the package docs and tests

## Governance

- ADRs: [docs/adrs](./docs/adrs)
- TDRs: [docs/tdrs](./docs/tdrs)
- Design notes: [docs/design](./docs/design)
