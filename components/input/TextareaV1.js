import React from 'react'

function TextareaV1({ label, setValue, shortcut, value }) {
    const handleChange = (e) => {
        setValue(e.target.value);
    }
    return (
        <>
            <label>{label}</label>
            <textarea className="form-control" onChange={(e) => { handleChange(e) }}>{value}</textarea>
        </>
    )
}

export default TextareaV1
