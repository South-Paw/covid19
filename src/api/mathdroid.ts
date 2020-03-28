import { fetchJson } from '../utils/fetch';

const BASE = 'https://covid19.mathdro.id';
const SUMMARY_API = `${BASE}/api`;
const DAILY_API = `${BASE}/api/daily`;

export interface Summary {
  confirmed: number;
  active: number;
  recovered: number;
  deaths: number;
  recoveryRate: number;
  mortalityRate: number;
}

const createSummary = (data: any) => {
  const { confirmed, recovered, deaths } = data;

  return {
    confirmed: confirmed.value,
    active: confirmed.value - recovered.value,
    recovered: recovered.value,
    deaths: deaths.value,
    recoveryRate: +((recovered.value / confirmed.value) * 100).toFixed(1),
    mortalityRate: +((deaths.value / confirmed.value) * 100).toFixed(1),
  };
};

export interface DailyCase {
  reportDate: string;
  confirmed: {
    total: number;
    delta: number;
    deltaPercent: number;
  };
  active: {
    total: number;
    delta: number;
    deltaPercent: number;
  };
  deaths: {
    total: number;
    delta: number;
    deltaPercent: number;
  };
}

const calculateDailySummaries = (arr: any[]): DailyCase[] => {
  return arr.map(({ reportDate, confirmed, recovered, deaths }, id) => {
    const prev = arr[id - 1];
    const prevConfirmed = prev ? prev.confirmed.total : 0;
    const prevActive = prev ? prev.confirmed.total - prev.recovered.total : 0;
    const prevRecovered = prev ? prev.recovered.total : 0;
    const prevDeaths = prev ? prev.deaths.total : 0;

    const confirmedDelta = confirmed.total - prevConfirmed;
    const confirmedDeltaPercent = prev ? +((confirmedDelta / prevConfirmed) * 100).toFixed(1) : 0;

    const active = confirmed.total - recovered.total;
    const activeDelta = active - prevActive;
    const activeDeltaPercent = prev ? +((activeDelta / prevActive) * 100).toFixed(1) : 0;

    const recoveredDelta = recovered.total - prevRecovered;
    let recoveredDeltaPercent = prev ? +((recoveredDelta / prevRecovered) * 100).toFixed(1) : 0;

    if (recoveredDeltaPercent === Infinity) {
      recoveredDeltaPercent = 100;
    }

    const deathsDelta = deaths.total - prevDeaths;
    const deathsDetlaPercent = prev ? +((deathsDelta / prevDeaths) * 100).toFixed(1) : 0;

    return {
      reportDate,
      confirmed: {
        total: confirmed.total,
        delta: confirmedDelta,
        deltaPercent: confirmedDeltaPercent,
      },
      active: {
        total: active,
        delta: activeDelta,
        deltaPercent: activeDeltaPercent,
      },
      recovered: {
        total: recovered.total,
        delta: recoveredDelta,
        deltaPercent: recoveredDeltaPercent,
      },
      deaths: {
        total: deaths.total,
        delta: deathsDelta,
        deltaPercent: deathsDetlaPercent,
      },
    };
  });
};

export const getLastUpdated = (): Promise<string> => fetchJson(SUMMARY_API).then(data => data.lastUpdate);

export const getSummary = () => fetchJson(SUMMARY_API).then(createSummary);

export const getDaily = () => fetchJson(DAILY_API).then(calculateDailySummaries);
