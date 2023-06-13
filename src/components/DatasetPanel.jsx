import React, { useState, useEffect } from "react";

import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";

import {
  GetDatasetsPromise,
  GetVariablesPromise,
  GetDepthsPromise,
  GetTimestampsPromise,
} from "../remote/ONavRequests";

import SelectBox from "./SelectBox.jsx";
import TimePicker from "./TimePicker.jsx";

const DatasetPanel = (props) => {
  const [availableDatasets, setAvailableDatasets] = useState([]);
  const [dataset, setDataset] = useState(props.dataset);
  const [datasetVariables, setDatasetVariables] = useState([]);
  const [datasetDepths, setDatasetDepths] = useState([]);
  const [datasetTimestamps, setDatasetTimestamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);

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

    setLoading(true);
    setLoadingPercent(10);

    const quantum = currentDataset.quantum;
    const model_class = currentDataset.model_class;

    GetVariablesPromise(newDataset).then(
      (variableResult) => {
        setLoadingPercent(33);
        let newVariable = currentVariable;
        let newVariableScale = dataset.variable_scale;
        let variable_range = {};
        variable_range[newVariable] = null;
        let variable_two_dimensional = null;
        const variableIds = variableResult.data.map((v) => {
          return v.id;
        });

        if (!variableIds.includes(currentVariable)) {
          newVariable = variableResult.data[0].id;
          newVariableScale = variableResult.data[0].scale;
          variable_two_dimensional = variableResult.data[0].two_dimensional;
          variable_range[newVariable] = null;
        } else {
          let variable_data = variableResult.data.filter((v) => {
            return v.id === currentVariable;
          });
          variable_two_dimensional = variable_data[0].two_dimensional;
        }

        GetTimestampsPromise(newDataset, newVariable).then(
          (timeResult) => {
            setLoadingPercent(66);
            const timeData = timeResult.data;
            setDatasetTimestamps(timeData);
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
                setLoadingPercent(90);
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
                  variable_two_dimensional: variable_two_dimensional,
                });
                setDatasetVariables(variableResult.data);
                setDatasetDepths(depthResult.data);

                if (
                  variable_two_dimensional &&
                  (props.plotType === "profile" || props.plotType === "transect")
                ) {
                  props.updatePlotType("timeseries");
                }

                setLoadingPercent(100);
                setLoading(false);
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

    if (
      variable.two_dimensional &&
      (props.plotType === "profile" || props.plotType === "transect")
    ) {
      props.updatePlotType("timeseries");
    }
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
  depthSelector = (
    <SelectBox
      key="depth"
      name="depth"
      label="Depth"
      options={datasetDepths}
      onChange={updateDataset}
      disabled={dataset.variable_two_dimensional}
      selected={
        datasetDepths.length > 0
          ? datasetDepths.filter((d) => {
              let depth = parseInt(dataset.depth);
              if (isNaN(depth)) {
                // when depth == "bottom" or "all"
                depth = dataset.depth;
              }

              return d.id === depth;
            })[0].id
          : 0
      }
    />
  );

  let timeSelector = null;
  if (dataset.time > 0 && props.plotType === "timeseries") {
    timeSelector = (
      <div className="timeselector-container">
        <TimePicker
          key="starttime"
          id="starttime"
          state={dataset.starttime}
          title={"Start Time (UTC)"}
          onUpdate={props.updateDataset}
          max={dataset.time}
          dataset={dataset}
          timestamps={datasetTimestamps}
        />
        <TimePicker
          key="time"
          id="time"
          state={props.dataset.time}
          title={"End Time (UTC)"}
          onUpdate={props.updateDataset}
          min={props.dataset.starttime}
          dataset={props.dataset}
          timestamps={datasetTimestamps}
        />
      </div>
    );
  } else if (props.dataset.time > 0) {
    timeSelector = (
      <div className="timeselector-container">
        <TimePicker
          key="time"
          id="time"
          state={props.dataset.time}
          onUpdate={props.updateDataset}
          title={"Time (UTC)"}
          dataset={props.dataset}
          timestamps={datasetTimestamps}
        />
      </div>
    );
  }

  return (
    <>
      <Card>
        <Card.Header>Dataset Options</Card.Header>
        <Card.Body>
          {datasetSelector}
          {variableSelector}
          {depthSelector}
          {timeSelector}
        </Card.Body>
      </Card>
      <Modal show={loading} backdrop size="sm" dialogClassName="loading-modal">
        <Modal.Header>
          <Modal.Title>Loading...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProgressBar now={loadingPercent} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DatasetPanel;
