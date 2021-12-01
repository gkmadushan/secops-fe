import React from "react";
import Modal from "react-bootstrap/Modal";

function Confirm({ show, setShow, callback, label = "Delete" }) {
  return (
    <div>
      <Modal
        show={show}
        fullscreen={false}
        onHide={() => setShow(false)}
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm {label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Are you sure you want to {label}?</label>
          </div>
          <input
            className="btn btn-danger mt-2"
            type="button"
            value="Confirm"
            onClick={callback}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Confirm;
