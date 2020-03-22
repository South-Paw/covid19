import { fetchJson } from '../utils/fetch';

const CASES = `https://services9.arcgis.com/N9p5hsImWXAccRNI/arcgis/rest/services/Z7biAeD8PAkqgmWhxG2A/FeatureServer/1/query`;
const CASES_TIME = `https://services9.arcgis.com/N9p5hsImWXAccRNI/arcgis/rest/services/PmO6oUpJizhI0jM8pu3n/FeatureServer/0/query`;

const where = {
  all: `1=1`,
  confirmed: `(Confirmed > 0)`,
  active: `(Active > 0)`,
  recovered: `(Confirmed > 0) AND (Recovered <> 0)`,
  deaths: `(Confirmed > 0) AND (Deaths > 0)`,
};

const defaultQuery = {
  f: 'json',
  outFields: '*',
  returnGeometry: false,
};

const fieldQuery = (whereQuery: any, field: any) => ({
  ...defaultQuery,
  where: whereQuery,
  outStatistics: `[{"statisticType":"sum","onStatisticField":"${field}","outStatisticFieldName":"value"}]`,
});

const summaryQuery = (whereQuery: any) => ({
  ...defaultQuery,
  where: whereQuery,
  outStatistics: `[
    {"statisticType":"sum","onStatisticField":"Confirmed","outStatisticFieldName":"confirmed"},
    {"statisticType":"sum","onStatisticField":"Recovered","outStatisticFieldName":"recovered"},
    {"statisticType":"sum","onStatisticField":"Active","outStatisticFieldName":"active"},
    {"statisticType":"sum","onStatisticField":"Deaths","outStatisticFieldName":"deaths"}
  ]`,
});

const arrayQuery = (whereQuery: any, orderByFields?: any) => ({
  ...defaultQuery,
  where: whereQuery,
  orderByFields,
});

const getSingleValue = ({ features }: any) => (features && features[0] ? features[0].attributes.value : 0);

const getArrayValues = ({ features }: any) => features.map(({ attributes }: any) => ({ ...attributes }));

const getSummary = (arr: any[]) => {
  const { confirmed, recovered, active, deaths } = arr[0];
  return {
    confirmed,
    active,
    recovered,
    deaths,
    recoveryRate: +((recovered / confirmed) * 100).toFixed(1),
    mortalityRate: +((deaths / confirmed) * 100).toFixed(1),
  };
};

const calculateDailySummaries = (arr: any[]) => {
  return arr.map(({ Report_Date_String: reportDate, Total_Confirmed: confirmed, Total_Recovered: recovered }, id) => {
    const prev = arr[id - 1];
    const prevConfirmed = prev ? prev.Total_Confirmed : 0;
    const prevActive = prev ? prev.Total_Confirmed - prev.Total_Recovered : 0;
    const prevRecovered = prev ? prev.Total_Recovered : 0;

    const confirmedDelta = confirmed - prevConfirmed;
    const confirmedDeltaPercent = prev ? +((confirmedDelta / prevConfirmed) * 100).toFixed(1) : 0;

    const active = confirmed - recovered;
    const activeDelta = active - prevActive;
    const activeDeltaPercent = prev ? +((activeDelta / prevActive) * 100).toFixed(1) : 0;

    const recoveredDelta = recovered - prevRecovered;
    let recoveredDeltaPercent = prev ? +((recoveredDelta / prevRecovered) * 100).toFixed(1) : 0;

    if (recoveredDeltaPercent === Infinity) {
      recoveredDeltaPercent = 100;
    }

    return {
      reportDate,
      confirmed,
      confirmedDelta,
      confirmedDeltaPercent,
      active,
      activeDelta,
      activeDeltaPercent,
      recovered,
      recoveredDelta,
      recoveredDeltaPercent,
      totalRecoveryRate: +((recovered / confirmed) * 100).toFixed(1),
    };
  });
};

const lastUpdated = (arr: any[]) => {
  const { Last_Update: lastUpdate = new Date() } = arr[0];
  return new Date(lastUpdate).toLocaleString();
};

export const getTotalConfirmed = () => fetchJson(CASES, fieldQuery(where.confirmed, 'Confirmed')).then(getSingleValue);

export const getTotalRecovered = () => fetchJson(CASES, fieldQuery(where.recovered, 'Recovered')).then(getSingleValue);

export const getTotalActive = () => fetchJson(CASES, fieldQuery(where.active, 'Active')).then(getSingleValue);

export const getTotalDeaths = () => fetchJson(CASES, fieldQuery(where.deaths, 'Deaths')).then(getSingleValue);

export interface SummaryWorldWide {
  confirmed: number;
  active: number;
  recovered: number;
  deaths: number;
  recoveryRate: number;
  mortalityRate: number;
}

export const getSummaryWorldWide = () =>
  fetchJson(CASES, summaryQuery(where.all))
    .then(getArrayValues)
    .then(getSummary);

export const getSummaryForCountry = (country: string) =>
  fetchJson(CASES, summaryQuery(`${where.all} AND Country_Region='${country}'`))
    .then(getArrayValues)
    .then(getSummary);

export interface DailyCase {
  reportDate: any;
  confirmed: any;
  confirmedDelta: number;
  confirmedDeltaPercent: number;
  active: number;
  activeDelta: number;
  activeDeltaPercent: number;
  recovered: any;
  recoveredDelta: number;
  recoveredDeltaPercent: number;
  totalRecoveryRate: number;
}

export const getDailyCases = () =>
  fetchJson(CASES_TIME, arrayQuery(where.all, 'Report_Date_String asc'))
    .then(getArrayValues)
    .then(calculateDailySummaries);

export const getLastUpdated = () =>
  fetchJson(CASES, { ...arrayQuery(where.confirmed, 'Last_Update desc'), resultRecordCount: 1 })
    .then(getArrayValues)
    .then(lastUpdated);
