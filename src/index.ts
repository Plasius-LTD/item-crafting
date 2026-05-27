export interface PackageDescriptor {
  readonly packageName: string;
  readonly featureFlagId: string;
  readonly envPrefix: string;
  readonly summary: string;
}

export type ItemCraftingDiscipline = "smithing" | "alchemy" | "tailoring";

export type WorkshopTier = "local" | "guild" | "academy";

export type HandoffRuntime = "browser" | "server" | "worker";

export type HandoffTransport = "in-process" | "http" | "queue";

export interface ItemCraftingAccessState {
  readonly apprenticeshipReady: boolean;
  readonly discipline: ItemCraftingDiscipline;
  readonly workshopTier: WorkshopTier;
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

export const packageDescriptor: PackageDescriptor = Object.freeze({
  packageName: ITEM_CRAFTING_PACKAGE,
  featureFlagId: ITEM_CRAFTING_FEATURE_FLAG_ID,
  envPrefix: ITEM_CRAFTING_ENV_PREFIX,
  summary:
    "Apprenticeship-gated item-crafting access and authority boundary contracts for Plasius.",
});

function freezeReadonlyArray<T>(items: readonly T[]): readonly T[] {
  return Object.freeze([...items]);
}

export function createItemCraftingAccessState(
  input: ItemCraftingAccessState
): ItemCraftingAccessState {
  return Object.freeze({ ...input });
}

export function createPortableHandoffHost(
  input: PortableHandoffHost
): PortableHandoffHost {
  return Object.freeze({
    ...input,
    capabilityFlags: freezeReadonlyArray(input.capabilityFlags),
  });
}

export function createHandoffRetryPolicy(
  input: HandoffRetryPolicy
): HandoffRetryPolicy {
  return Object.freeze({
    ...input,
    retryableFailureCodes: freezeReadonlyArray(input.retryableFailureCodes),
    terminalFailureCodes: freezeReadonlyArray(input.terminalFailureCodes),
  });
}

export function createItemCraftingHandoffContract(
  input: ItemCraftingHandoffContract
): ItemCraftingHandoffContract {
  return Object.freeze({
    ...input,
    sourceHost: createPortableHandoffHost(input.sourceHost),
    targetHost: createPortableHandoffHost(input.targetHost),
    retryPolicy: createHandoffRetryPolicy(input.retryPolicy),
  });
}
