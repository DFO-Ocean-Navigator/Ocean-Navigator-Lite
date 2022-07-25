import React, { useState, useEffect } from 'react';

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table"

const CoordsPanel = (props) => {  
  const [ enteredLat, setEnteredLat ] = useState('');
  const [ enteredLon, setEnteredLon ] = useState('');
  const [ tableEntries, setTableEntries] = useState([]);

  useEffect(() => {
    setTableEntries(props.coordinates.map(coord => {
      return (
        <tr key={'entry_' + coord.id}>
          <td>{coord.row}</td>
          <td>{coord.lon}</td>
          <td>{coord.lat}</td>
          <td>
            <button className='removeCoord' onClick={()=>props.removeCoord(coord.id)}>X</button>
          </td>
        </tr>
      );
    }));
  }, [props.coordinates]);

  const submitHandler = (e)=>{
    e.preventDefault();
    if (e.target[0].value.length > 0 & e.target[1].value.length >0) {
      props.updateCoords({
        "row": props.coordinates.length + 1, 
        "lon": e.target[0].value, 
        "lat": e.target[1].value,
        "id": e.target[0].value + e.target[1].value    
      });
      setEnteredLat('');
      setEnteredLon('');
    }
  };
  
  const latChangeHandler = (e) => {
    setEnteredLat(parseFloat(e.target.value));
  };

  const lonChangeHandler = (e) => {
    setEnteredLon(parseFloat(e.target.value));
  };

  return (
    <div>
      <Card>
        <Card.Header>Coordinate Options</Card.Header>
        <Card.Body>
          <Table striped bordered size="sm">
            <thead>
              <tr>
                <th style={{width: '5%'}}>#</th>
                <th>Longitude</th>
                <th>Latitude</th>
                <th style={{width: '5%', borderColor: 'transparent'}}></th>
              </tr>
            </thead>
            <tbody>
              {tableEntries}
            </tbody>
          </Table>

          <form onSubmit={submitHandler}>
            <div style={{ display: "flex", justifyContent: "right" }}> 
              <label>Longitude:</label>
              <input
                type='number'
                min='-180'
                max='180'
                step='0.0001'
                value={enteredLon}
                onChange={lonChangeHandler}
              />
              <label>Latitude:</label>
              <input
                type='number'
                min='-90'
                max='90'
                step='0.0001'
                value={enteredLat}
                onChange={latChangeHandler}
              />
              <button type='button' onClick={props.clearCoords}>Clear</button>
              <button type='submit'>Add Coordinate</button>
            </div>
          </form>
          
        </Card.Body>
      </Card>
    </div>
  );  
};


export default CoordsPanel;