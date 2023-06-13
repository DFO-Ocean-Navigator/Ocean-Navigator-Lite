import React from "react";
import Form from "react-bootstrap/Form";

function SelectBox(props) {
  let options = null;
  if (props.options) {
    options = props.options.map((option) => {
      return (
        <option key={`option-${option.id}`} value={option.id}>
          {option.value}
        </option>
      );
    });
  }

  const disabled = !Array.isArray(props.options) || !props.options.length || props.disabled;

  return (
    <Form.Group className="selectbox" controlid={`formgroup-${props.id}-selectbox`} >
      <Form.Label className="label">{props.label}</Form.Label>
      <Form.Select
        name={props.name}
        onChange={(e) => {
          props.onChange(e.target.name, e.target.value);
        }}
        disabled={disabled}
        value={props.selected}
        className="form-select"
      >
        {options}
      </Form.Select>
    </Form.Group>
  );
}
export default SelectBox;
