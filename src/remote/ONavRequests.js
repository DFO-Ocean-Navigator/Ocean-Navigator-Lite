import { cacheAdapterEnhancer } from "axios-extensions";

const axios = require("axios");
const FileDownload = require("js-file-download");

const url = "https://www.oceannavigator.ca/api/v2.0/";

const instance = axios.create({
  headers: { "Content-Type": "application/json" },
});

export function GetDatasetsPromise() {
  return instance.get(url + "datasets");
}

export function GetVariablesPromise(dataset) {
  return instance.get(url + `dataset/${dataset}/variables`, {
    params: {
      dataset: dataset,
    },
  });
}

export function GetTimestampsPromise(dataset, variable) {
  return instance.get(url + `dataset/${dataset}/${variable}/timestamps`, {
    params: {
      dataset: dataset,
      variable: variable,
    },
  });
}

export function GetDepthsPromise(dataset, variable) {
  return instance.get(url + `dataset/${dataset}/${variable}/depths`, {
    params: {
      dataset: dataset,
      variable: variable,
      all: true,
    },
  });
}

export function GetPlot(query, fileName, setShowDownloading) {
  return axios({
    url: query,
    method: "GET",
    responseType: "blob",
  }).then((response) => {
    FileDownload(response.data, fileName);
    setShowDownloading(false);
  });
}
