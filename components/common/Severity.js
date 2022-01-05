import React from "react";

function Severity({ score }) {
  if (score > 0 && score < 4) {
    return <label className="p-1 alert-info">Low</label>;
  }

  if (score >= 4 && score < 7) {
    return <label className="p-1 alert-warning">Medium</label>;
  }

  if (score >= 7 && score < 9) {
    return <label className="p-1 alert-danger">High</label>;
  }

  if (score >= 9) {
    return <label className="p-1 alert-danger">Critical</label>;
  }
}

export default Severity;
