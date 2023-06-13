import React, { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import ToggleButton from "react-bootstrap/ToggleButton";

import DatasetPanel from "./DatasetPanel.jsx";
import CoordinatesPanel from "./CoordinatesPanel.jsx";
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
  const [outputFormat, setOutputFormat] = useState("csv");
  const [dataset, setDataset] = useState(DATASET_DEFAULTS);
  const [coordinates, setCoordinates] = useState([]);
  const [query, setQuery] = useState("");

  const radios = [
    { name: "Profile", value: "profile" },
    { name: "Virtual Mooring", value: "timeseries" },
    { name: "Transect", value: "transect" },
    { name: "Area", value: "map" },
  ];

  const queryOptions = {
    dataset,
    coords: coordinates,
    plotType: plotType,
    outputFormat: outputFormat,
  };

  useEffect(() => {
    setQuery(submitQuery(queryOptions));
  }, [queryOptions]);

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

  const handleRadio = (e) => {
    let type = e.currentTarget.value;
    setPlotType(type);
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
        plotType={plotType}
      />
      <CoordinatesPanel
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
        />
      </div>
      <div className="buttons-container">
        <div className="radios-container">
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              name="radio"
              value={radio.value}
              checked={plotType === radio.value}
              onChange={handleRadio}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </div>

        <div className="submit-container">
          <Form.Select
            className="option-select"
            onChange={(e) => setOutputFormat(e.target.value)}
          >
            <option>csv</option>
            <option>png</option>
          </Form.Select>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default OceanNavigatorLite;
