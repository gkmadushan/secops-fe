import React from 'react'

function Pagination({ totalRecords, limit }) {
    return (
        <nav aria-label=" navigation ">
            <ul className="pagination justify-content-left">
                <li key={Math.random()} className="page-item disabled">
                    <a className="page-link" href="#" tabIndex="-1">Previous</a>
                </li>
                <li key={Math.random()} className="page-item"><a className="page-link" href="#">1</a></li>
                <li key={Math.random()} className="page-item"><a className="page-link" href="#">2</a></li>
                <li key={Math.random()} className="page-item"><a className="page-link" href="#">3</a></li>
                <li key={Math.random()} className="page-item">
                    <a className="page-link" href="#">Next</a>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination
