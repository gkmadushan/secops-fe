import { range } from 'd3-array'
import React from 'react'

function Pagination({ num_pages, current_page, setPage }) {
    return (
        <nav aria-label="navigation">
            <ul className="pagination justify-content-left">
                <li className={["page-item", current_page === 1 ? "disabled" : ""].join(" ")}>
                    <a className="page-link" onClick={() => { setPage(1) }} tabIndex="-1">Previous</a>
                </li>
                {range(num_pages).map((menu, index) => {
                    return <li className={["page-item ", current_page === index + 1 ? "active" : null].join(" ")}><a className="page-link cursor-pointer" onClick={() => { setPage(index + 1) }}>{index + 1}</a></li>
                })}
                <li className={["page-item", current_page === num_pages ? "disabled" : ""].join(" ")}>
                    <a className="page-link" onClick={() => { setPage(num_pages) }}>Next</a>
                </li>
            </ul>
        </nav >
    )
}

export default Pagination
