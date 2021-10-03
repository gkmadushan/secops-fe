import React from 'react'

function CheckboxV1({ label, value }) {
    return (
        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text"><label for="filter_checkbox">Show Active Only</label> &nbsp;<input id="filter_checkbox" type="checkbox" aria-label="Checkbox for following text input" /></span>
            </div>
        </div>
    )
}

export default CheckboxV1
