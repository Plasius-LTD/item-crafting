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

export type HandoffRuntime = "browser" | "server" | "worker";

export type HandoffTransport = "in-process" | "http" | "queue";

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

export interface PortableHandoffHost {
  readonly hostId: string;
  readonly runtime: HandoffRuntime;
  readonly transport: HandoffTransport;
  readonly capabilityFlags: readonly string[];
}

export interface HandoffRetryPolicy {
  readonly timeoutMs: number;
  readonly maxAttempts: number;
  readonly retryableFailureCodes: readonly string[];
  readonly terminalFailureCodes: readonly string[];
}

export interface ItemCraftingHandoffContract {
  readonly handoffId: string;
  readonly apprenticeshipReady: boolean;
  readonly discipline: ItemCraftingDiscipline;
  readonly workshopTier: WorkshopTier;
  readonly sourceHost: PortableHandoffHost;
  readonly targetHost: PortableHandoffHost;
  readonly retryPolicy: HandoffRetryPolicy;
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

function freezeReadonlyArray<T>(items: readonly T[]): readonly T[] {
  return Object.freeze([...items]);
}

export function createItemCraftingAccessState(
  input: ItemCraftingAccessState
): ItemCraftingAccessState {
  if (!isItemCraftingDiscipline(input.discipline)) {
    throw new Error("discipline must be a supported item-crafting discipline");
  }

  if (!isWorkshopTier(input.workshopTier)) {
    throw new Error("workshopTier must be a supported workshop tier");
  }

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

function assertValidUpdatedAtIso(value: string): void {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.exec(
    value
  );

  if (!match || Number.isNaN(Date.parse(value))) {
    throw new Error("updatedAtIso must be an ISO-8601 timestamp");
  }

  const [, yearRaw, monthRaw, dayRaw, hourRaw, minuteRaw, secondRaw] = match;
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  const second = Number(secondRaw);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  if (
    month < 1
    || month > 12
    || day < 1
    || day > daysInMonth
    || hour > 23
    || minute > 59
    || second > 59
  ) {
    throw new Error("updatedAtIso must be an ISO-8601 timestamp");
  }
}

function assertNonEmptyStringArray(
  values: readonly string[],
  label: string,
): readonly string[] {
  if (!Array.isArray(values)) {
    throw new Error(`${label} must be an array of non-empty strings`);
  }

  for (const value of values) {
    assertNonEmptyString(value, `${label} entry`);
  }

  return freezeReadonlyArray(values);
}

function isHandoffRuntime(value: string): value is HandoffRuntime {
  return value === "browser" || value === "server" || value === "worker";
}

function isHandoffTransport(value: string): value is HandoffTransport {
  return value === "in-process" || value === "http" || value === "queue";
}

function assertNoExtraProperties(
  input: ItemCraftingWorkOrderRecord
): ItemCraftingWorkOrderRecord {
  return {
    crafterSubjectId: input.crafterSubjectId,
    workshopId: input.workshopId,
    discipline: input.discipline,
    workshopTier: input.workshopTier,
    updatedAtIso: input.updatedAtIso,
  };
}

export function createItemCraftingWorkOrderRecord(
  input: ItemCraftingWorkOrderRecord
): ItemCraftingWorkOrderRecord {
  assertNonEmptyString(input.crafterSubjectId, "crafterSubjectId");
  assertNonEmptyString(input.workshopId, "workshopId");
  assertNonEmptyString(input.updatedAtIso, "updatedAtIso");
  assertValidUpdatedAtIso(input.updatedAtIso);

  if (!isItemCraftingDiscipline(input.discipline)) {
    throw new Error("discipline must be a supported item-crafting discipline");
  }

  if (!isWorkshopTier(input.workshopTier)) {
    throw new Error("workshopTier must be a supported workshop tier");
  }

  return Object.freeze(assertNoExtraProperties(input));
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

export function createPortableHandoffHost(
  input: PortableHandoffHost
): PortableHandoffHost {
  assertNonEmptyString(input.hostId, "hostId");

  if (!isHandoffRuntime(input.runtime)) {
    throw new Error("runtime must be a supported handoff runtime");
  }

  if (!isHandoffTransport(input.transport)) {
    throw new Error("transport must be a supported handoff transport");
  }

  return Object.freeze({
    ...input,
    capabilityFlags: assertNonEmptyStringArray(
      input.capabilityFlags,
      "capabilityFlags",
    ),
  });
}

export function createHandoffRetryPolicy(
  input: HandoffRetryPolicy
): HandoffRetryPolicy {
  assertPositiveSafeInteger(input.timeoutMs, "timeoutMs");
  assertPositiveSafeInteger(input.maxAttempts, "maxAttempts");

  return Object.freeze({
    ...input,
    retryableFailureCodes: assertNonEmptyStringArray(
      input.retryableFailureCodes,
      "retryableFailureCodes",
    ),
    terminalFailureCodes: assertNonEmptyStringArray(
      input.terminalFailureCodes,
      "terminalFailureCodes",
    ),
  });
}

export function createItemCraftingHandoffContract(
  input: ItemCraftingHandoffContract
): ItemCraftingHandoffContract {
  assertNonEmptyString(input.handoffId, "handoffId");

  if (!isItemCraftingDiscipline(input.discipline)) {
    throw new Error("discipline must be a supported item-crafting discipline");
  }

  if (!isWorkshopTier(input.workshopTier)) {
    throw new Error("workshopTier must be a supported workshop tier");
  }

  return Object.freeze({
    ...input,
    sourceHost: createPortableHandoffHost(input.sourceHost),
    targetHost: createPortableHandoffHost(input.targetHost),
    retryPolicy: createHandoffRetryPolicy(input.retryPolicy),
  });
}
