import React from 'react'

function InputV1({ type = "text", label, shortcut, required = false, pattern = false, validationError = false, value, setValue = () => { console.log('Missing Set Value Prop') } }) {
    const handleChange = (e) => {
        setValue(e.target.value);
    }

    return (
        <div className="input-group mb-3">
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">{label} {shortcut ? <span className="code">({shortcut})</span> : null}</span>
                </div>
                <input type={type} className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" onChange={(e) => { handleChange(e) }} value={value} required={required} onInvalid={(e) => { validationError ? e.target.setCustomValidity(validationError) : null }} onInput={(e) => { e.target.setCustomValidity("") }} pattern={pattern} />
            </div>
        </div>
    )
}

export default InputV1
