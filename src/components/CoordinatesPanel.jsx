import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

const CoordinatesPanel = (props) => {
  const [enteredLat, setEnteredLat] = useState("");
  const [enteredLon, setEnteredLon] = useState("");
  const [tableEntries, setTableEntries] = useState([]);
  const fileForm = useRef(null);
  const fileInput = useRef(null);

  useEffect(() => {
    setTableEntries(
      props.coordinates.map((coord) => {
        return (
          <tr key={"entry_" + coord.id}>
            <td>{coord.row}</td>
            <td>{coord.lat}</td>
            <td>{coord.lon}</td>
            <td>
              <button
                className="removeCoord"
                onClick={() => props.removeCoord(coord.id)}
              >
                X
              </button>
            </td>
          </tr>
        );
      })
    );
  }, [props.coordinates]);

  const submitHandler = (e) => {
    e.preventDefault();
    if ((e.target[0].value.length > 0) & (e.target[1].value.length > 0)) {
      props.updateCoords({
        row: props.coordinates.length + 1,
        lat: e.target[0].value,
        lon: e.target[1].value,
        id: `${props.coordinates.length + 1}-${e.target[0].value}-${
          e.target[1].value
        }`,
      });
      setEnteredLat("");
      setEnteredLon("");
    }
  };

  const latChangeHandler = (e) => {
    setEnteredLat(parseFloat(e.target.value));
  };

  const lonChangeHandler = (e) => {
    setEnteredLon(parseFloat(e.target.value));
  };

  const handleUpload = () => {
    fileInput.current.click();
  };

  const parseCSV = (e) => {
    if (e.target.files.length == 1) {
      const file = e.target.files[0];

      Papa.parse(file, {
        dynamicTyping: true,
        skipEmptyLines: true,
        header: true,
        complete: function (results) {
          // Convert everything to lowercase
          const fields_lowered = results.meta.fields.map(function (f) {
            return f.toLowerCase().trim();
          });

          function findKey(names) {
            for (let i = 0; i < names.length; i++) {
              const index = fields_lowered.indexOf(names[i]);
              if (index > -1) {
                return results.meta.fields[index];
              }
            }
            return -1;
          }

          const lat = findKey(["latitude", "lat"]);
          const lon = findKey(["longitude", "lon"]);
          if (lat == -1 || lon == -1) {
            alert(
                "Error: Could not find latitude or longitude column in file: "
              ) + file.name;
            return;
          }

          const points = results.data.map(function (point) {
            point[lat] = point[lat] > 90 ? 90 : point[lat];
            point[lat] = point[lat] < -90 ? -90 : point[lat];
            point[lon] = point[lon] > 180 ? point[lon] - 360 : point[lon];
            point[lon] = point[lon] < -180 ? 360 + point[lon] : point[lon];
            return [point[lat], point[lon]];
          });

          for (let idx in points) {
            props.updateCoords({
              row: props.coordinates.length + parseInt(idx) + 1,
              lat: points[idx][0].toString(),
              lon: points[idx][1].toString(),
              id: `${props.coordinates.length + 1}-${points[idx][0]}-${
                points[idx][1]
              }`,
            });
          }
        },
      });

      fileForm.current.reset();
    }
  };

  return (
    <div>
      <Card>
        <Card.Header>Coordinate Options</Card.Header>
        <Card.Body>
          <div className="coordinates-table">
            <Table striped bordered size="sm">
              <thead>
                <tr>
                  <th className="idx-col">#</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th className="button-col" />
                </tr>
              </thead>
              <tbody>{tableEntries}</tbody>
            </Table>
          </div>

          <form onSubmit={submitHandler}>
            <div className="coords-form">
              <label>Latitude:</label>
              <input
                type="number"
                min="-90"
                max="90"
                step="0.0001"
                value={enteredLat}
                onChange={latChangeHandler}
              />
              <label>Longitude:</label>
              <input
                type="number"
                min="-180"
                max="180"
                step="0.0001"
                value={enteredLon}
                onChange={lonChangeHandler}
              />
              <button type="button" onClick={props.clearCoords}>
                Clear
              </button>
              <button type="submit">Add Coordinate</button>
              <button className="plot-button" onClick={handleUpload}>
                {"Upload CSV"}
              </button>
            </div>
          </form>
        </Card.Body>
      </Card>
      <form ref={fileForm}>
        <input
          type="file"
          style={{ display: "none" }}
          onChange={parseCSV}
          ref={fileInput}
          accept=".csv,.CSV"
        />
      </form>
    </div>
  );
};

export default CoordinatesPanel;
