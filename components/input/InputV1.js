import React from "react";

function InputV1({
  type = "text",
  label,
  shortcut,
  required = false,
  readonly = false,
  pattern = false,
  validationError = false,
  value,
  setValue = () => {
    console.log("Missing Set Value Prop");
  },
  onFocus = () => {},
}) {
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
        <input
          id={label}
          type={type}
          readOnly={readonly}
          onFocus={onFocus}
          className="form-control"
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          onChange={(e) => {
            handleChange(e);
          }}
          value={value}
          required={required}
          onInvalid={(e) => {
            validationError
              ? e.target.setCustomValidity(validationError)
              : null;
          }}
          onInput={(e) => {
            e.target.setCustomValidity("");
          }}
          pattern={pattern}
        />
      </div>
    </div>
  );
}

export default InputV1;
