import React from 'react'

function ButtonV1({ label, shortcut, onClick }) {
    return (
        <a className="btn btn-outline-primary" onClick={onClick}>{label} <span className="code">({shortcut})</span></a>
    )
}

export default ButtonV1
