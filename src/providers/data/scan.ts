/**
 * Virtual scan engine for client-side post-filter pagination.
 *
 * Used by system-users and reverse-search list modes, which need to scan the full
 * backend dataset, apply a local filter, and paginate the filtered virtual dataset.
 */

import { GetListResult, RaRecord } from "react-admin";

export const SYSTEM_USERS_SCAN_CHUNK_SIZE = 250;

export interface SystemUsersScanCacheEntry {
  // Whether the backend list has been fully scanned for this filter/sort combination.
  backendExhausted: boolean;
  // Raw backend offset already consumed while building the filtered virtual dataset.
  backendOffset: number;
  // Filtered users accumulated so later pages can reuse prior scan work.
  filteredRecords: RaRecord[];
}

export const systemUsersScanCache = new Map<string, SystemUsersScanCacheEntry>();
export const clearSystemUsersScanCache = () => systemUsersScanCache.clear();

export const reverseSearchScanCache = new Map<string, SystemUsersScanCacheEntry>();
export const clearReverseSearchScanCache = () => reverseSearchScanCache.clear();

/**
 * Build a stable cache key from any set of filter/sort parameters.
 * Callers are responsible for pre-filtering undefined values out of query params
 * before passing them in (e.g., using filterUndefined(query)).
 */
export const buildScanCacheKey = (params: Record<string, unknown>): string => JSON.stringify(params);

let _scanNotifier: ((key: string) => void) | null = null;

/**
 * Set the notification function called when a scan takes multiple requests.
 * Should be called once at app startup, e.g. from setDataProviderNotifier.
 */
export const setScanNotifier = (fn: ((key: string) => void) | null) => {
  _scanNotifier = fn;
};

export interface RunVirtualScanOpts {
  cache: Map<string, SystemUsersScanCacheEntry>;
  cacheKey: string;
  /** First record index (inclusive) of the desired page. */
  pageStart: number;
  /** Last record index (exclusive) of the desired page. */
  pageEnd: number;
  perPage: number;
  /** Fetch a page of raw records from the backend at the given offset/limit. */
  fetchPage: (
    offset: number,
    limit: number
  ) => Promise<{
    rawCount: number;
    records: RaRecord[];
    serverTotal: number;
  }>;
  /** Return true to include a record in the filtered virtual dataset. */
  filterFn: (record: RaRecord) => boolean;
  /** i18n key passed to the notifier after 3 consecutive loop requests. */
  notifyKey?: string;
  /** Maximum number of backend fetches per call (default: unlimited). */
  maxRequests?: number;
  /** Optional post-processor applied to the final page slice (e.g. MAS enrichment). */
  enrichList?: (records: RaRecord[]) => Promise<RaRecord[]>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function runVirtualScan(opts: RunVirtualScanOpts): Promise<GetListResult> {
  const { cache, cacheKey, pageStart, pageEnd, perPage, fetchPage, filterFn, notifyKey, maxRequests, enrichList } =
    opts;
  const nextPageThreshold = pageEnd + 1;
  const effectiveMaxRequests = maxRequests ?? Infinity;

  const cachedScan = cache.get(cacheKey);
  const scanState: SystemUsersScanCacheEntry = cachedScan || {
    backendExhausted: false,
    backendOffset: 0,
    filteredRecords: [],
  };

  let loopRequestCount = 0;
  while (
    !scanState.backendExhausted &&
    scanState.filteredRecords.length < nextPageThreshold &&
    loopRequestCount < effectiveMaxRequests
  ) {
    loopRequestCount++;
    if (loopRequestCount === 3 && notifyKey) {
      _scanNotifier?.(notifyKey);
    }

    const backendLimit = Math.max(perPage, SYSTEM_USERS_SCAN_CHUNK_SIZE);
    const { rawCount, records, serverTotal } = await fetchPage(scanState.backendOffset, backendLimit);
    const filteredData = records.filter(filterFn);
    scanState.filteredRecords.push(...filteredData);
    scanState.backendOffset += rawCount;
    scanState.backendExhausted = rawCount === 0 || scanState.backendOffset >= serverTotal || rawCount < backendLimit;
  }

  cache.set(cacheKey, scanState);

  let pagedData: RaRecord[] = scanState.filteredRecords.slice(pageStart, pageEnd);
  if (enrichList) {
    pagedData = await enrichList(pagedData);
  }

  const hasNextPage = scanState.backendExhausted
    ? scanState.filteredRecords.length > pageEnd
    : scanState.filteredRecords.length >= nextPageThreshold;

  return {
    data: pagedData as any[],
    total: scanState.backendExhausted ? scanState.filteredRecords.length : undefined,
    pageInfo: {
      hasPreviousPage: pageStart > 0,
      hasNextPage,
    },
  };
}
