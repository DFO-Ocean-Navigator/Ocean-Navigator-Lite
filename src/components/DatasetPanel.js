import React, { useState, useEffect } from 'react';

import Card from "react-bootstrap/Card";
import Dropdown from './UI/Dropdown';
import { GetDatasetsPromise, GetVariablesPromise} from '../Remote/OceanNavigator';


const DatasetPanel = (props) => {  

  const [datasets, setDatasets] = useState([]);
  const [variables, setVariables] = useState([]);

  useEffect(() => {
    GetDatasetsPromise().then(result => {
      setDatasets(result.data)
      props.updateDataset(result.data[0])
    });
  }, []);

  useEffect(() => {
    if (props.selectedDataset) {
      GetVariablesPromise(props.selectedDataset).then(result => {
        setVariables(result.data)
        props.updateVariable(result.data[0])
      });
    };
  }, [props.selectedDataset, props.selectedVariable]);

  const updateDataset = (datasetId) => {
    const dataset = datasets.filter(dataset => dataset.id === datasetId);
    props.updateDataset(dataset[0])
  };

  const updateVariable = (variableId) => {
    const variable = variables.filter(variable => variable.id === variableId);
    props.updateVariable(variable[0])
  };

  return (
    <div>
        <Card>
          <Card.Header>Dataset</Card.Header>
          <Card.Body style={{display: "flex"}}>
            <label>Dataset:</label>
            <Dropdown key='datasetDropdown' data={datasets} onChange={updateDataset}/>
            <label>Variable:</label>
            <Dropdown key='variableDropdown' data={variables} onChange={updateVariable}/>
          </Card.Body>
        </Card>
    </div>
  );  
};


export default DatasetPanel;