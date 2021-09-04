import React from 'react'

function ButtonV1({ label, shortcut, onClick }) {
    return (
        <a href="#" className="btn btn-outline-primary" onClick={onClick}>{label} <span className="code">({shortcut})</span></a>
    )
}

export default ButtonV1
