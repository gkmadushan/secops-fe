import React, { useState } from "react";

function SelectV1({
  label,
  shortcut,
  required = false,
  validationError = false,
  value,
  values,
  setValue = () => {
    console.log("Missing Set Value Prop");
  },
  nameField = "name",
  idField = "id",
}) {
  const generateOptionList = (values) => {
    let options = [];
    if (values) {
      for (const option of values) {
        options.push({
          label: option[nameField],
          checked: option.checked ?? false,
          id: option[idField],
        });
      }
      return options;
    }
    return [];
  };
  const [options] = useState(generateOptionList(values));
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <div className="input-group mb-3">
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text" id="inputGroup-sizing-default">
            {shortcut ? <span className="code">({shortcut})</span> : null}
            {label}
            {required && <sup class="required">&#9733;</sup>}
          </span>
        </div>
        <select
          id={label}
          value={value}
          onChange={(e) => {
            handleChange(e);
          }}
          className="form-control"
          id="inputGroupSelect01"
          required={required}
          onInvalid={(e) => {
            validationError
              ? e.target.setCustomValidity(validationError)
              : null;
          }}
          onInput={(e) => {
            e.target.setCustomValidity("");
          }}
        >
          <option value="">Choose...</option>
          {options.map((option, index) => {
            return (
              <option
                key={index}
                value={option["id"]}
                selected={option["id"] === value ? true : false}
              >
                {option["label"]}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

export default SelectV1;
