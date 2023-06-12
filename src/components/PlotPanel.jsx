import React, { useState, useEffect } from "react";

import Card from "react-bootstrap/Card";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from "./UI/Dropdown.jsx";
import { GetTimestampsPromise, GetDepthsPromise } from "../remote/ONavRequests";

const PlotPanel = (props) => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [timestamps, setTimestamps] = useState([]);
  const [depths, setDepths] = useState([]);
  const [hasDepth, setHasDepth] = useState(false);

  useEffect(() => {
    if (props.selectedVariable) {
      GetTimestampsPromise(props.selectedDataset, props.selectedVariable).then(
        (result) => {
          setTimestamps(result.data);
          props.updateStartTime(result.data[0].id);
          props.updateEndTime(result.data[0].id);
        }
      );
      GetDepthsPromise(props.selectedDataset, props.selectedVariable).then(
        (result) => {
          setDepths(result.data);
          if (result.data[0]) {
            props.updateDepth(result.data[0].id);
          } else {
            props.updateDepth([]);
          }
        }
      );
    }
  }, [props.selectedDataset, props.selectedVariable]);

  useEffect(() => {
    if (
      props.selectedVariable &&
      depths.length === 0 &&
      (selectedTab === "profile" || selectedTab === "transect")
    ) {
      setSelectedTab("timeseries");
    }
    setHasDepth(depths.length > 0);
  }, [depths]);

  const handleTabChange = (tabId) => {
    setSelectedTab(tabId);
    props.updatePlotType(tabId);
  };

  const updateStartTime = (timestamp) => {
    props.updateStartTime(timestamp);
  };

  const updateEndTime = (timestamp) => {
    props.updateEndTime(timestamp);
  };

  const updateDepth = (depth) => {
    props.updateDepth(depth);
  };

  const starTimeDropdown = (
    <div key="startTime">
      <label>Start Time:</label>
      <Dropdown
        key="startTimeDropdown"
        data={timestamps}
        onChange={updateStartTime}
      />
    </div>
  );
  const endTimeDropdown = (
    <div key="endTime">
      <label>End Time:</label>
      <Dropdown
        key="endTimeDropdown"
        data={timestamps}
        onChange={updateEndTime}
      />
    </div>
  );
  const depthsDropdown = hasDepth ? (
    <div key="depth">
      <label>Depth:</label>
      <Dropdown key="depthsDropdown" data={depths} onChange={updateDepth} />
    </div>
  ) : null;

  let selectors = [];
  switch (selectedTab) {
    case "profile":
    case "transect":
      selectors = [starTimeDropdown];
      break;
    case "timeseries":
      selectors = [starTimeDropdown, endTimeDropdown, depthsDropdown];
      break;
    case "map":
      selectors = [starTimeDropdown, depthsDropdown];
      break;
  }

  const inputs = (
    <div key="optionsDiv" style={{ display: "flex" }}>
      {selectors}
    </div>
  );

  return (
    <div>
      <Card>
        <Card.Header>Plot Options</Card.Header>
        <Card.Body>
          <Tabs
            key="plotTabs"
            defaultActiveKey={"profile"}
            activeKey={selectedTab}
            onSelect={handleTabChange}
          >
            <Tab
              key="profile"
              eventKey="profile"
              title="Profile"
              disabled={!hasDepth}
            >
              {inputs}
            </Tab>
            <Tab key="ts" eventKey="timeseries" title="Virtual Mooring">
              {inputs}
            </Tab>
            <Tab
              key="transect"
              eventKey="transect"
              title="Transect"
              disabled={!hasDepth}
            >
              {inputs}
            </Tab>
            <Tab key="map" eventKey="map" title="Area">
              {inputs}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PlotPanel;
