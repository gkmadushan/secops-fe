import React from 'react'

function SelectV1({ label, shortcut, values }) {
    return (
        <div className="input-group mb-3">
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">{label} {shortcut ? <span className="code">({shortcut})</span> : null}</span>
                </div>
                <select class="form-control" id="inputGroupSelect01">
                    <option selected>Choose...</option>
                    {values.map((value, index) => {
                        return <option value={index}>{value}</option>
                    })}
                </select>
            </div>
        </div>
    )
}

export default SelectV1
