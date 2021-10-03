import React, { useContext, useState } from "react";

function unauthenticated({ children }) {
    return (
        <>
            <div className="container">
                <div className={["d-flex", "justify-content-center"].join(" ")}>
                    {children}
                </div>
            </div>
        </>
    );
}

export default unauthenticated;
