import React, { useState, useEffect, forwardRef } from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

import DailyCalendar from "./calendars/DailyCalendar.jsx";
import MonthlyCalendar from "./calendars/MonthlyCalendar.jsx";
import SeasonalCalendar from "./calendars/SeasonalCalendar.jsx";

const CustomToggle = forwardRef(({ children, onClick }, ref) => (
  <div
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </div>
));

function TimePicker(props) {
  const [timestamps, setTimestamps] = useState(props.timestamps);
  const [data, setData] = useState([]);
  const [map, setMap] = useState({});
  const [revMap, setRevMap] = useState({});
  const [dateHours, setDateHours] = useState([]);
  const [climatology, setClimatology] = useState(false);

  useEffect(() => {
    setTimestamps(props.timestamps);

    if (props.dataset.id && props.dataset.id.includes("climatology")) {
      setClimatology(true);
    }
  }, [props]);

  useEffect(() => {
    let newData = timestamps;

    if (props.min) {
      newData = newData.filter((item) => {
        return item.id > props.min;
      });
    }

    if (props.max) {
      newData = newData.filter((item) => {
        return item.id < props.max;
      });
    }

    let newMap = {};
    let newRevMap = {};
    for (let i = 0; i < newData.length; ++i) {
      const d1 = new Date(newData[i].value);
      const d2 = new Date(d1.getTime() + d1.getTimezoneOffset() * 60000);
      let d3 = d2;
      if (props.dataset.quantum !== "hour") {
        d3 = new Date(
          Date.UTC(
            d1.getUTCFullYear(),
            d1.getUTCMonth(),
            d1.getUTCDate(),
            0,
            0,
            0,
            0
          )
        );
      }
      newMap[newData[i].id] = d2;
      newRevMap[d3.toUTCString()] = newData[i].id;
    }

    if (props.dataset.quantum === "hour") {
      let currentTime = new Date(map[props.state]);
      let hours = getHoursForDate(currentTime, map);
      setDateHours(hours);
    }

    setData(newData);
    setMap(newMap);
    setRevMap(newRevMap);
  }, [timestamps, props.min, props.max]);

  const zeroPad = (num) => {
    return num.toString().padStart(2, "0");
  };

  const getHoursForDate = (currentDate, map) => {
    let hours = Object.entries(map).filter((date) => {
      return (
        date[1].getDate() === currentDate.getDate() &&
        date[1].getMonth() === currentDate.getMonth() &&
        date[1].getFullYear() === currentDate.getFullYear()
      );
    });

    return hours;
  };

  const getSeason = (time) => {
    // assumes timestamp is not on boundary
    let year = time.getFullYear();
    if (new Date(year - 1, 10, 30) <= time && time <= new Date(year, 1, 29)) {
      return climatology ? "Winter" : `${"Winter"} ${year - 1}`;
    } else if (new Date(year, 1, 29) <= time && time <= new Date(year, 3, 31)) {
      return climatology ? "Spring" : `${"Spring"} ${year}`;
    } else if (new Date(year, 4, 1) <= time && time <= new Date(year, 7, 31)) {
      return climatology ? "Summer" : `${"Summer"} ${year}`;
    } else {
      return climatology ? "Fall" : `${"Fall"} ${year}`;
    }
  };

  const getIndexFromTimestamp = (timestamp) => {
    return data.findIndex((ts) => {
      return ts.id === timestamp;
    });
  };

  const getTimestampFromIndex = (index) => {
    const keys = Object.keys(map);
    if (index < 0) {
      return parseInt(keys[keys.length + index]);
    }

    return parseInt(keys[index]);
  };

  const hourChanged = (e) => {
    props.onUpdate(props.id, e.target.value);
  };

  const handlePrevTime = () => {
    let currentIndex = getIndexFromTimestamp(props.state);
    if (currentIndex > 0) {
      props.onUpdate(props.id, getTimestampFromIndex(currentIndex - 1));
    }
  };

  const handleNextTime = () => {
    let currentIndex = getIndexFromTimestamp(props.state);
    if (currentIndex < data.length - 1) {
      props.onUpdate(props.id, getTimestampFromIndex(currentIndex + 1));
    }
  };

  const handleCalendarInteraction = (date) => {
    switch (props.dataset.quantum) {
      case "hour":
        let hours = getHoursForDate(date, map);
        setDateHours(hours);
        props.onUpdate(props.id, hours[hours.length - 1][0]);
        break;
      default:
        const utcDate = new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );
        props.onUpdate(props.id, revMap[utcDate.toUTCString()]);
        break;
    }
  };

  let buttonText = "";
  let calendar = null;
  if (Object.keys(map).length > 0) {
    let selectedDate = new Date(map[props.state]);
    switch (props.dataset.quantum) {
      case "hour":
      case "day":
        buttonText = selectedDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        calendar = (
          <DailyCalendar
            selected={selectedDate}
            availableDates={Object.values(map)}
            onUpdate={handleCalendarInteraction}
          />
        );
        break;
      case "month":
        buttonText = climatology
          ? selectedDate.toLocaleDateString(undefined, {
              month: "long",
            })
          : selectedDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            });

        calendar = (
          <MonthlyCalendar
            selected={selectedDate}
            availableDates={Object.values(map)}
            onUpdate={handleCalendarInteraction}
            climatology={climatology}
          />
        );
        break;
      case "year":
        buttonText = selectedDate.getUTCFullYear();
        break;
      case "season":
        buttonText = getSeason(selectedDate);

        calendar = (
          <SeasonalCalendar
            selected={selectedDate}
            availableDates={Object.values(map)}
            onUpdate={handleCalendarInteraction}
            climatology={climatology}
          />
        );
        break;
    }
  }

  let currentIndex = getIndexFromTimestamp(props.state);
  let hourDropdown = null;
  if (props.dataset.quantum === "hour") {
    let hours = dateHours;
    if (dateHours.length === 0) {
      let currentTime = new Date(map[props.state]);
      hours = getHoursForDate(currentTime, map);
    }

    const hourOptions = hours.map((date) => {
      return (
        <option key={date[0]} value={date[0]}>
          {zeroPad(date[1].getHours()) + ":00"}
        </option>
      );
    });

    hourDropdown = (
      <Form.Select
        className="hour-selector"
        onChange={hourChanged}
        value={props.state}
      >
        {hourOptions}
      </Form.Select>
    );
  }
  let dateSelector = (
    <div className="selector-container">
      <Button className="date-label">{buttonText}</Button>
    </div>
  );

  return (
    <InputGroup className="timepicker">
      <label className="timepicker-label">{props.title}</label>
      <Dropdown drop="down">
        <div className="button-container">
          <Button
            className="header-button"
            disabled={currentIndex === 0}
            onClick={handlePrevTime}
          >
            {" "}
            <ChevronLeft />
          </Button>
          <div className="dropdown-container">
            <Dropdown.Toggle as={CustomToggle}>{dateSelector}</Dropdown.Toggle>
            <Dropdown.Menu
              className="dropdown-menu"
              disabled={props.dataset.quantum === "year"}
            >
              {calendar}
            </Dropdown.Menu>
            {hourDropdown}
          </div>
          <Button
            className="header-button"
            disabled={currentIndex === data.length - 1}
            onClick={handleNextTime}
          >
            <ChevronRight />
          </Button>
        </div>
      </Dropdown>
    </InputGroup>
  );
}

export default TimePicker;
