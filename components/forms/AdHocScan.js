import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import CheckboxGroupV1 from "../input/CheckboxGroupV1";

function AdHocScan({ show, setShow, callback }) {
  const [autofix, setAutofix] = useState(false);
  const [normal, setNormal] = useState(false);

  return (
    <div>
      <Modal
        show={show}
        fullscreen={false}
        onHide={() => setShow(false)}
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm AdHoc Scan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-2">
            <p>Are you sure you want to perform AdHoc scan now?</p>
            <p>
              Possible side effects{" "}
              <ul>
                <li>Slowness in the environment</li>
                <li>Violation of agreed maintainance window</li>
                <li>Automatic fixes might limit required functions</li>
                <li>Alarms can be triggered by the monitoring systems</li>
              </ul>
            </p>
            <p>
              <input
                id="autofix"
                type="checkbox"
                value={autofix}
                disabled={normal}
                onChange={(e) => setAutofix(e.target.checked)}
              />
              <label for="autofix" className="pointer">
                {" "}
                &nbsp;&nbsp;Yes, Apply automatic remediations{" "}
              </label>
            </p>
            <p>
              <input
                id="normal"
                type="checkbox"
                value={normal}
                disabled={autofix}
                onChange={(e) => setNormal(e.target.checked)}
              />
              <label for="normal" className="pointer">
                {" "}
                &nbsp;&nbsp;Yes, Perform regular scan{" "}
              </label>
            </p>
          </div>
          {(normal || autofix) && (
            <input
              className="btn btn-danger mt-2"
              type="button"
              value="Confirm"
              onClick={() => callback(autofix)}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdHocScan;
