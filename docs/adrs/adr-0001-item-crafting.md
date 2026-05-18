# ADR-0001: Item Crafting Package Boundary

## Status

Accepted

## Context

Item crafting needs an apprenticeship-gated authority boundary outside the Player System guidance layer.

## Decision

`@plasius/item-crafting` will own item-crafting access contracts and authority-side readiness metadata.

## Consequences

- Item-crafting authority stays explicit.
- Apprenticeship-derived access can be reused by host runtimes.
- Future crafting execution logic has a package home.
