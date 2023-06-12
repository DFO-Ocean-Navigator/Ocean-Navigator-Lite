import React, { useState, useEffect } from "react";

import Card from "react-bootstrap/Card";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import TimePicker from "./TimePicker.jsx";

const PlotPanel = (props) => {
  const [selectedTab, setSelectedTab] = useState("profile");

  useEffect(() => {
    if (props.dataset.variable_two_dimensional) {
      setSelectedTab("timeseries");
    }
  }, [props.dataset]);

  const handleTabChange = (tabId) => {
    setSelectedTab(tabId);
    props.updatePlotType(tabId);
  };

  let timeSelector = null;
  if (props.dataset.time > 0 && selectedTab === "timeseries") {
    timeSelector = (
      <div className="timeSelector-div">
        <TimePicker
          key="starttime"
          id="starttime"
          state={props.dataset.starttime}
          title={"Start Time (UTC)"}
          onUpdate={props.updateDataset}
          max={props.dataset.time}
          dataset={props.dataset}
          timestamps={props.timestamps}
        />
        <TimePicker
          key="time"
          id="time"
          state={props.dataset.time}
          title={"End Time (UTC)"}
          onUpdate={props.updateDataset}
          min={props.dataset.starttime}
          dataset={props.dataset}
          timestamps={props.timestamps}
        />
      </div>
    );
  } else if (props.dataset.time > 0) {
    timeSelector = (
      <div className="timeSelector-div">
        <TimePicker
          key="time"
          id="time"
          state={props.dataset.time}
          onUpdate={props.updateDataset}
          title={"Time (UTC)"}
          dataset={props.dataset}
          timestamps={props.timestamps}
        />
      </div>
    );
  }

  const hasDepth = props.dataset.variable_two_dimensional !== true;

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
              {timeSelector}
            </Tab>
            <Tab key="ts" eventKey="timeseries" title="Virtual Mooring">
              {timeSelector}
            </Tab>
            <Tab
              key="transect"
              eventKey="transect"
              title="Transect"
              disabled={!hasDepth}
            >
              {timeSelector}
            </Tab>
            <Tab key="map" eventKey="map" title="Area">
              {timeSelector}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PlotPanel;
