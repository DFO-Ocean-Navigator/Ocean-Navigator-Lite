import React, { useState, useEffect } from "react";

import DatasetPanel from "./DatasetPanel.jsx";
import PlotPanel from "./PlotPanel.jsx";
import CoordsPanel from "./CoordsPanel.jsx";
import submitQuery from "../remote/SubmitQuery";
import { GetPlot } from "../remote/ONavRequests";

const DATASET_DEFAULTS = Object.freeze({
  id: "giops_day",
  attribution: "",
  quantum: "day",
  depth: 0,
  time: -1,
  starttime: -1,
  variable: "votemper",
  quiverVariable: "None",
  variable_scale: [-5, 30],
  variable_two_dimensional: false,
});

function OceanNavigatorLite() {
  const [plotType, setPlotType] = useState("profile");
  const [dataset, setDataset] = useState(DATASET_DEFAULTS);
  const [timestamps, setTimestamps] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [query, setQuery] = useState("");

  // const queryOptions = {
  //   type: plotType,
  //   dataset: dataset,
  //   variable: variable,
  //   startTime: startTime,
  //   endTime: endTime,
  //   depth: selectedDepth,
  //   coords: coordinates,
  // };

  // useEffect(() => {
  //   setQuery(submitQuery(queryOptions));
  // }, [queryOptions]);

  const updateDataset = (key, value) => {
    switch (key) {
      case "dataset":
        setDataset(value);
        break;
      default:
        setDataset((prevDataset) => {
          return {
            ...prevDataset,
            [key]: value,
          };
        });
    }
  };

  const updateTimestamps = (newTimestamps) => {
    setTimestamps(newTimestamps);
  };

  const removeCoord = (id) => {
    let coords = coordinates;

    const toRemove = coords.findIndex((coord) => {
      return coord.id === id ? true : false;
    });

    coords.map((coord) => {
      if (coord.row > coords[toRemove].row) {
        coord.row -= 1;
      }
    });

    coords.splice(toRemove, 1);

    setCoordinates([...coords]);
  };

  const handleSubmit = () => {
    let fileName = plotType + "_" + dataset.id + "_" + dataset.variable;
    GetPlot(query, fileName);
  };

  return (
    <div className="onav-lite">
      <DatasetPanel
        dataset={dataset}
        updateDataset={updateDataset}
        updateTimestamps={updateTimestamps}
      />
      <PlotPanel
        dataset={dataset}
        timestamps={timestamps}
        updateDataset={updateDataset}
        updatePlotType={(newPlotType) => {
          setPlotType(newPlotType);
        }}
      />
      <CoordsPanel
        coordinates={coordinates}
        updateCoords={(coords) => {
          setCoordinates((prevCoords) => [...prevCoords, coords]);
        }}
        clearCoords={() => {
          setCoordinates([]);
        }}
        removeCoord={(idx) => removeCoord(idx)}
      />

      <div className="query-container">
        <textarea
          id="queryurl"
          readOnly={true}
          rows="4"
          cols="50"
          wrap="hard"
          value={query}
        ></textarea>
      </div>
      <div className="submit-container">
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default OceanNavigatorLite;
