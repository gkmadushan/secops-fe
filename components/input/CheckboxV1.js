import React from 'react'

function CheckboxV1({ label, value, setValue }) {
    const handleChange = (e) => {
        setValue(!value);
    }

    return (
        <div className="input-group mb-3 mt-3">
            <div className="input-group-prepend">
                <span className="input-group-text"><label for="filter_checkbox">{label}</label> &nbsp;<input id="filter_checkbox" type="checkbox" aria-label="Checkbox for following text input" onChange={e => handleChange(e)} checked={value} /></span>
            </div>
        </div>
    )
}

export default CheckboxV1
