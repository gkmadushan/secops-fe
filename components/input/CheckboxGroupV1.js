import React, { useState, useEffect } from "react";

function CheckboxGroupV1({ label, values, setValue, value }) {
  const generateOptionList = (values) => {
    let options = [];
    if (values) {
      for (const option of values) {
        if (value && value.filter((val) => val.id == option.id).length > 0) {
          options.push({ label: option.name, checked: true, id: option.id });
        } else {
          options.push({ label: option.name, checked: false, id: option.id });
        }
      }
      return options;
    }
    return [];
  };
  const [options, setOptions] = useState(generateOptionList(values));
  const handleChange = async (e) => {
    let selected = [];
    let index = e.target.getAttribute("data-index");
    options[index]["checked"] = !options[index]["checked"];
    await options.forEach((option) => {
      option.checked ? selected.push(option.id) : null;
    });
    setOptions(options);
    setValue(selected);
  };

  return (
    <div>
      <label>
        <strong>Select {label}</strong>
      </label>
      <hr />
      <div className="form-group">
        {options.map((option, index) => {
          return (
            <div className="form-check form-check-inline">
              <input
                className="form-check-input cursor-pointer"
                checked={option["checked"]}
                key={option["label"] + index}
                type="checkbox"
                id={option["id"] + "chkbox"}
                value={option["id"]}
                data-index={index}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
              <label
                className="form-check-label cursor-pointer"
                key={"label" + option["label"] + index}
                htmlFor={option["id"] + "chkbox"}
              >
                {option["label"]}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CheckboxGroupV1;
