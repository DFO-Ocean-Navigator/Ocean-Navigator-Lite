import React from "react";

const Dropdown = (props) => {
  const formOptions = props.data.map((data) => (
    <option key={data.id} value={data.id}>
      {data.value}
    </option>
  ));

  const handleChange = (e) => {
    props.onChange(e.target.value);
  };

  return (
    <form>
      <select onChange={handleChange}>{formOptions}</select>
    </form>
  );
};

export default Dropdown;
