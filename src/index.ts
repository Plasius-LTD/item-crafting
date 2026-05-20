export interface PackageDescriptor {
  readonly packageName: string;
  readonly featureFlagId: string;
  readonly envPrefix: string;
  readonly summary: string;
}

export interface RolloutDescriptor {
  readonly featureFlagId: string;
  readonly envOverride: string;
  readonly rollbackPlan: string;
  readonly summary: string;
}

export type ItemCraftingDiscipline = "smithing" | "alchemy" | "tailoring";

export type WorkshopTier = "local" | "guild" | "academy";
export type ItemCraftingFieldSensitivity = "pseudonymous" | "internal";
export type ItemCraftingFieldRetention =
  | "authoritative-crafting"
  | "short-lived";

export interface ItemCraftingAccessState {
  readonly apprenticeshipReady: boolean;
  readonly discipline: ItemCraftingDiscipline;
  readonly workshopTier: WorkshopTier;
}

export interface ItemCraftingWorkOrderRecord {
  readonly crafterSubjectId: string;
  readonly workshopId: string;
  readonly discipline: ItemCraftingDiscipline;
  readonly workshopTier: WorkshopTier;
  readonly updatedAtIso: string;
}

export interface ItemCraftingFieldPolicy {
  readonly field: keyof ItemCraftingWorkOrderRecord;
  readonly sensitivity: ItemCraftingFieldSensitivity;
  readonly retention: ItemCraftingFieldRetention;
  readonly justification: string;
}

export interface ItemCraftingThroughputAssumptions {
  readonly maxConcurrentWorkOrders: number;
  readonly maxWorkshopDispatchesPerMinute: number;
  readonly maxCraftingEventsPerMinute: number;
}

export const ITEM_CRAFTING_PACKAGE = "@plasius/item-crafting";
export const ITEM_CRAFTING_ENV_PREFIX = "ITEM_CRAFTING";
export const ITEM_CRAFTING_FEATURE_FLAG_ID = "isekai.item-crafting.enabled";
export const ITEM_CRAFTING_PRIVACY_SCALE_FEATURE_FLAG_ID =
  "isekai.training-progression.privacy-scale.enabled";
export const ITEM_CRAFTING_PRIVACY_SCALE_ENV_OVERRIDE =
  "ITEM_CRAFTING_PRIVACY_SCALE_ENABLED";

export const packageDescriptor: PackageDescriptor = Object.freeze({
  packageName: ITEM_CRAFTING_PACKAGE,
  featureFlagId: ITEM_CRAFTING_FEATURE_FLAG_ID,
  envPrefix: ITEM_CRAFTING_ENV_PREFIX,
  summary:
    "Apprenticeship-gated item-crafting access and authority boundary contracts for Plasius.",
});

export const itemCraftingPrivacyScaleRollout: RolloutDescriptor = Object.freeze({
  featureFlagId: ITEM_CRAFTING_PRIVACY_SCALE_FEATURE_FLAG_ID,
  envOverride: ITEM_CRAFTING_PRIVACY_SCALE_ENV_OVERRIDE,
  rollbackPlan:
    "Disable the crafting privacy/scale rollout to fall back to the existing item-crafting access contract surface.",
  summary:
    "Rolls out minimal crafting work-order payloads and documented workshop throughput assumptions.",
});

export const itemCraftingFieldPolicies = Object.freeze<
  readonly ItemCraftingFieldPolicy[]
>([
  {
    field: "crafterSubjectId",
    sensitivity: "pseudonymous",
    retention: "authoritative-crafting",
    justification:
      "Stable pseudonymous subject identifier is required to attribute crafting authority without carrying profile names or contact data.",
  },
  {
    field: "workshopId",
    sensitivity: "internal",
    retention: "authoritative-crafting",
    justification:
      "Workshop identifier is the minimum routing key needed for apprenticeship and facility authority checks.",
  },
  {
    field: "discipline",
    sensitivity: "internal",
    retention: "authoritative-crafting",
    justification:
      "Crafting discipline is the minimal specialization state required to route work-order validation.",
  },
  {
    field: "workshopTier",
    sensitivity: "internal",
    retention: "authoritative-crafting",
    justification:
      "Workshop tier captures the smallest facility classification needed for authority and throughput constraints.",
  },
  {
    field: "updatedAtIso",
    sensitivity: "internal",
    retention: "short-lived",
    justification:
      "Update timestamp supports bounded ordering and replay protection for high-event crafting flows.",
  },
]);

export const defaultItemCraftingThroughputAssumptions: ItemCraftingThroughputAssumptions =
  Object.freeze({
    maxConcurrentWorkOrders: 4_000,
    maxWorkshopDispatchesPerMinute: 18_000,
    maxCraftingEventsPerMinute: 32_000,
  });

export function isItemCraftingDiscipline(
  value: string
): value is ItemCraftingDiscipline {
  return value === "smithing" || value === "alchemy" || value === "tailoring";
}

export function isWorkshopTier(value: string): value is WorkshopTier {
  return value === "local" || value === "guild" || value === "academy";
}

export function createItemCraftingAccessState(
  input: ItemCraftingAccessState
): ItemCraftingAccessState {
  return Object.freeze({ ...input });
}

function assertNonEmptyString(value: string, label: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertPositiveSafeInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive safe integer`);
  }
}

export function createItemCraftingWorkOrderRecord(
  input: ItemCraftingWorkOrderRecord
): ItemCraftingWorkOrderRecord {
  assertNonEmptyString(input.crafterSubjectId, "crafterSubjectId");
  assertNonEmptyString(input.workshopId, "workshopId");
  assertNonEmptyString(input.updatedAtIso, "updatedAtIso");

  if (!isItemCraftingDiscipline(input.discipline)) {
    throw new Error("discipline must be a supported item-crafting discipline");
  }

  if (!isWorkshopTier(input.workshopTier)) {
    throw new Error("workshopTier must be a supported workshop tier");
  }

  return Object.freeze({ ...input });
}

export function createItemCraftingThroughputAssumptions(
  input: ItemCraftingThroughputAssumptions
): ItemCraftingThroughputAssumptions {
  assertPositiveSafeInteger(
    input.maxConcurrentWorkOrders,
    "maxConcurrentWorkOrders"
  );
  assertPositiveSafeInteger(
    input.maxWorkshopDispatchesPerMinute,
    "maxWorkshopDispatchesPerMinute"
  );
  assertPositiveSafeInteger(
    input.maxCraftingEventsPerMinute,
    "maxCraftingEventsPerMinute"
  );

  return Object.freeze({ ...input });
}
