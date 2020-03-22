import csvtojson from 'csvtojson';
import { CSVParseParam } from 'csvtojson/v2/Parameters';
import qs from 'qs';

export const fetchJson = (url: string, query?: { [key: string]: any }) =>
  new Promise((resolve: (data: any) => void, reject: (error: any) => void) => {
    const endpoint = `${url}${query ? `?${qs.stringify(query)}` : ''}`;
    fetch(endpoint)
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err));
  });

export const fetchCsv = (url: string, csvConfig: Partial<CSVParseParam>) =>
  new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.text())
      .then(csv =>
        csvtojson({ output: 'json', ...csvConfig })
          .fromString(csv)
          .then(json => resolve(json)),
      )
      .catch(err => reject(err));
  });
