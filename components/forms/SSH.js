import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import CheckboxGroupV1 from "../input/CheckboxGroupV1";

function SSH({ show, setShow, callback }) {
  const [input, setInput] = useState("> connecting....");
  const handleHide = () => {
    setShow(false);
    setTimeout(() => {
      setInput("> connected\n$ ");
    }, 10000);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      setInput("");
      e.target.focus();
    }
  };

  return (
    <div>
      <Modal show={show} fullscreen={false} onHide={handleHide} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Shell</Modal.Title>
        </Modal.Header>
        <Modal.Body className="shell">
          <textarea
            spellCheck={false}
            onKeyDown={(e) => handleEnter(e)}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default SSH;
