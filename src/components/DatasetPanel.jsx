import React, { useState, useEffect } from "react";

import Card from "react-bootstrap/Card";
import {
  GetDatasetsPromise,
  GetVariablesPromise,
  GetDepthsPromise,
  GetTimestampsPromise,
} from "../remote/ONavRequests";

import SelectBox from "./SelectBox.jsx";

const DatasetPanel = (props) => {
  const [availableDatasets, setAvailableDatasets] = useState([]);
  const [dataset, setDataset] = useState(props.dataset);
  const [datasetVariables, setDatasetVariables] = useState([]);
  const [datasetDepths, setDatasetDepths] = useState([]);

  useEffect(() => {
    GetDatasetsPromise().then((result) => {
      setAvailableDatasets(result.data);
    });
  }, []);

  useEffect(() => {
    if (availableDatasets.length > 0) {
      changeDataset(dataset.id, dataset.variable);
    }
  }, [availableDatasets]);

  useEffect(() => {
    props.updateDataset("dataset", dataset);
  }, [dataset]);

  const changeDataset = (newDataset, currentVariable) => {
    const currentDataset = availableDatasets.filter((d) => {
      return d.id === newDataset;
    })[0];

    const quantum = currentDataset.quantum;
    const model_class = currentDataset.model_class;

    GetVariablesPromise(newDataset).then(
      (variableResult) => {
        let newVariable = currentVariable;
        let newVariableScale = dataset.variable_scale;
        let variable_range = {};
        variable_range[newVariable] = null;
        const variableIds = variableResult.data.map((v) => {
          return v.id;
        });

        if (!variableIds.includes(currentVariable)) {
          newVariable = variableResult.data[0].id;
          newVariableScale = variableResult.data[0].scale;
          variable_range[newVariable] = null;
        }

        GetTimestampsPromise(newDataset, newVariable).then(
          (timeResult) => {
            const timeData = timeResult.data;
            props.updateTimestamps(timeData);
            let newTime = timeData[timeData.length - 1].id;
            let newStarttime =
              timeData.length > 20
                ? timeData[timeData.length - 20].id
                : timeData[0].id;

            if (
              props.mountedDataset &&
              props.mountedDataset.id === newDataset
            ) {
              newTime =
                props.mountedDataset.time > 0
                  ? props.mountedDataset.time
                  : newTime;
              newStarttime =
                props.mountedDataset.startTime > 0
                  ? props.mountedDataset.startTime
                  : newStarttime;
            }

            GetDepthsPromise(newDataset, newVariable).then(
              (depthResult) => {
                setDataset({
                  id: newDataset,
                  model_class: model_class,
                  quantum: quantum,
                  time: newTime,
                  depth: 0,
                  starttime: newStarttime,
                  variable: newVariable,
                  variable_scale: newVariableScale,
                  variable_range: variable_range,
                  quiverVariable: "None",
                });
                setDatasetVariables(variableResult.data);
                setDatasetDepths(depthResult.data);
              },
              (error) => {
                console.error(error);
              }
            );
          },
          (error) => {
            console.error(error);
          }
        );
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const changeVariable = (newVariable) => {
    if (datasetDepths.length === 0) {
      GetDepthsPromise(dataset.id, newVariable).then((depthResult) => {
        setDatasetDepths(depthResult.data);
      });
    }

    let newDataset = {};

    const variable = datasetVariables.find((v) => v.id === newVariable);
    let newVariableRange = {};
    newVariableRange[newVariable] = null;

    newDataset = {
      variable: newVariable,
      variable_scale: variable.scale,
      variable_range: newVariableRange,
      variable_two_dimensional: variable.two_dimensional,
    };

    setDataset((prevDataset) => {
      return { ...prevDataset, ...newDataset };
    });
  };

  const updateDataset = (key, value) => {
    if (nothingChanged(key, value)) {
      return;
    }

    if (datasetChanged(key)) {
      changeDataset(value, dataset.variable);
      return;
    }

    if (variableChanged(key)) {
      changeVariable(value);
      return;
    }

    let newDataset = { ...dataset, [key]: value };
    setDataset(newDataset);
  };

  const nothingChanged = (key, value) => {
    return dataset[key] === value;
  };

  const datasetChanged = (key) => {
    return key === "dataset";
  };

  const variableChanged = (key) => {
    return key === "variable";
  };

  let datasetSelector = (
    <SelectBox
      key="dataset"
      name="dataset"
      label="Dataset"
      options={availableDatasets}
      onChange={updateDataset}
      selected={dataset.id}
    />
  );

  let variableSelector = (
    <SelectBox
      key="variable"
      name="variable"
      label="Variable"
      options={datasetVariables}
      onChange={updateDataset}
      selected={dataset.variable}
    />
  );

  let depthSelector = null;
  if (
    datasetDepths &&
    datasetDepths.length > 0 &&
    !dataset.variable_two_dimensional
  ) {
    depthSelector = (
      <SelectBox
        key="depth"
        name="depth"
        label="Depth"
        options={datasetDepths}
        onChange={updateDataset}
        selected={
          datasetDepths.filter((d) => {
            let depth = parseInt(dataset.depth);
            if (isNaN(depth)) {
              // when depth == "bottom" or "all"
              depth = dataset.depth;
            }

            return d.id === depth;
          })[0].id
        }
      />
    );
  }

  return (
    <div>
      <Card>
        <Card.Header>Dataset</Card.Header>
        <Card.Body style={{ display: "flex" }}>
          {datasetSelector}
          {variableSelector}
          {depthSelector}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DatasetPanel;
