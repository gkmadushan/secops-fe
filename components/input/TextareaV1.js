import React from 'react'

function TextareaV1({ label, shortcut, value }) {
    return (
        <>
            <label>{label}</label>
            <textarea className="form-control" >{value}</textarea>
        </>
    )
}

export default TextareaV1
