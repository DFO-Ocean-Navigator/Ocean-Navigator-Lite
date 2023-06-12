import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

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

  const disabled = !Array.isArray(props.options) || !props.options.length;

  return (
    <Form.Group controlid={`formgroup-${props.id}-selectbox`} as={Col}>
      <Form.Label column>{props.label}</Form.Label>
      <Form.Select
        name={props.name}
        placeholder={disabled ? "Loading..." : props.placeholder}
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
