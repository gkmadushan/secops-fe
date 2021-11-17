import React, { useState } from 'react'

function SelectV1({ label, shortcut, required = false, validationError = false, value, values, setValue = () => { console.log('Missing Set Value Prop') } }) {
    const generateOptionList = (values) => {
        let options = []
        if (values) {
            for (const option of values) {
                options.push({ "label": option.name, "checked": false, "id": option.id })
            }
            return options;
        }
        return []
    }
    const [options] = useState(generateOptionList(values));
    const handleChange = (e) => {
        setValue(e.target.value);
    }
    return (
        <div className="input-group mb-3">
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">{label} {shortcut ? <span className="code">({shortcut})</span> : null}</span>
                </div>
                <select value={value} onChange={(e) => { handleChange(e) }} className="form-control" id="inputGroupSelect01" required={required} onInvalid={(e) => { validationError ? e.target.setCustomValidity(validationError) : null }} onInput={(e) => { e.target.setCustomValidity("") }} >
                    <option value="">Choose...</option>
                    {options.map((option, index) => {
                        return <option key={index} value={option["id"]} selected={option["id"] === value ? true : false} >{option["label"]}</option>
                    })}
                </select>
            </div>
        </div>
    )
}

export default SelectV1
