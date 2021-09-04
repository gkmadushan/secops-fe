import React from 'react'

function InputV1({ label, shortcut, value }) {
    return (
        <div className="input-group mb-3">
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">{label} {shortcut ? <span className="code">({shortcut})</span> : null}</span>
                </div>
                <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" value={value} />
            </div>
        </div>
    )
}

export default InputV1
