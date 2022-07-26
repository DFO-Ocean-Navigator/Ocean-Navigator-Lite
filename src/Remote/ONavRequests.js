import { cacheAdapterEnhancer } from "axios-extensions";

const axios = require("axios");
const FileDownload = require('js-file-download');

const url = "https://staging.oceansdata.ca/api/v1.0/"

const instance = axios.create({
  headers: {'Content-Type': 'application/json'},
  adapter: cacheAdapterEnhancer(axios.defaults.adapter)
});

export function GetDatasetsPromise() {
  return instance.get(
    url + "datasets/"
  );
}

export function GetVariablesPromise(dataset) {
  return instance.get(
    url + "variables/",
    {params: {
        dataset: dataset
      }
    }
  );
}

export function GetTimestampsPromise(dataset, variable) {
  return instance.get(
    url + "timestamps/",
    {
      params: {
        dataset: dataset,
        variable: variable
      }
    }
  );
}

export function GetDepthsPromise(dataset, variable) {
  return instance.get(
    url + "depth/",
    {
      params: {
        dataset: dataset,
        variable: variable,
        all: true,
      }
    }
  );
}

export function GetPlot(query, fileName) {
  return axios({
    url: query,
    method: 'GET',
    responseType: 'blob', 
  }).then((response) => {
      FileDownload(response.data, fileName + '.csv');
  });
}