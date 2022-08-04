import React, { useState, useEffect } from 'react';

import DatasetPanel from './DatasetPanel';
import PlotPanel from './PlotPanel';
import CoordsPanel from './CoordsPanel';
import submitQuery from '../Remote/submitQuery';
import { GetPlot } from '../Remote/ONavRequests'

require("./scss/main.scss");

function ONavLite() {
  
  const [ plotType, setPlotType ] = useState('profile');
  const [ selectedDataset, setSelectedDataset ] = useState({});
  const [ selectedVariable, setSelectedVariable ] = useState({});
  const [ startTime, setStartTime ] = useState('');
  const [ endTime, setEndTime ] = useState('');
  const [ selectedDepth, setSelectedDepth ] = useState('');
  const [ coordinates, setCoordinates ] = useState([]);
  const [ query, setQuery ] = useState(''); 

  const queryOptions = {
    "type": plotType,
    "dataset": selectedDataset,
    "variable": selectedVariable,
    "startTime": startTime,
    "endTime": endTime,
    "depth": selectedDepth,
    "coords": coordinates
  }

  useEffect(() => {
    setQuery(submitQuery(queryOptions))
  }, [queryOptions])

  const removeCoord = (id) => {
    let coords = coordinates;

    const toRemove = coords.findIndex(coord => {
      return coord.id === id ? true : false;
    });

    coords.map(coord => {
      if (coord.row > coords[toRemove].row){
        coord.row -= 1
      }
    })

    coords.splice(toRemove, 1)

    setCoordinates([...coords])
  };

  const handleSubmit = () => {
    let fileName = plotType + '_' + selectedDataset.id + '_' + selectedVariable.id
    GetPlot(query, fileName)
  };

  return (
    <div>
      <DatasetPanel
        selectedDataset={selectedDataset.id}
        updateDataset={(ds)=>{setSelectedDataset(ds)}}
        updateVariable={(v)=>{setSelectedVariable(v)}}
      />
      <PlotPanel
        selectedDataset={selectedDataset.id}
        selectedVariable={selectedVariable.id}
        updatePlotType={(plotType) => {setPlotType(plotType)}}
        updateStartTime={(ts) => {setStartTime(ts)}}
        updateEndTime={(ts) => {setEndTime(ts)}}
        updateDepth={(depth) => {setSelectedDepth(depth)}}
      />
      <CoordsPanel
        coordinates={coordinates}
        updateCoords={(coords) => {setCoordinates(prevCoords => [...prevCoords, coords])}}
        clearCoords={() => {setCoordinates([])}}
        removeCoord={(idx) => removeCoord(idx)}
      />

      <div style={{justifyContent: "right" }}>
        <textarea id="queryurl" readOnly={true} rows="4" cols="50" wrap="hard" value={query}></textarea>
      </div>
      <div style={{display: "flex", justifyContent: "right" }}>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default ONavLite;
