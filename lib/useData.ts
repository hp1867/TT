'use client';

import { useEffect, useState } from 'react';

/** Fetch a collection from an API route, falling back to seed data for instant render. */
export function useCollection<T>(endpoint: string, fallback: T[]): T[] {
  const [data, setData] = useState<T[]>(fallback);
  useEffect(() => {
    let active = true;
    fetch(endpoint, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (active && Array.isArray(d) && d.length) setData(d as T[]);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [endpoint]);
  return data;
}

/** Fetch the site-settings object. */
export function useSite<T extends object>(fallback: T): T {
  const [site, setSite] = useState<T>(fallback);
  useEffect(() => {
    let active = true;
    fetch('/api/site', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (active && d && typeof d === 'object') setSite({ ...fallback, ...d });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return site;
}
