import React, { useState } from 'react';

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table"

const CoordsPanel = (props) => {  
  const [ enteredLat, setEnteredLat ] = useState('');
  const [ enteredLon, setEnteredLon ] = useState('');
   
  const submitHandler = (e)=>{
    e.preventDefault();
    if (e.target[0].value.length > 0 & e.target[1].value.length >0) {
      props.updateCoords([props.coordinates.length +1, e.target[0].value, e.target[1].value]);
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

  const tableEntries = props.coordinates.map(coord => {
    return (
      <tr key={'entry_' + coord[0]}>
        <td>{coord[0]}</td>
        <td>{coord[1]}</td>
        <td>{coord[2]}</td>
      </tr>
    );
  });
  

  return (
    <div>
      <Card>
        <Card.Header>Coordinate Options</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Longitude</th>
                <th>Latitude</th>
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