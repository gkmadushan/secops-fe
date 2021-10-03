import React from 'react'
import Modal from 'react-bootstrap/Modal'

function Confirm({ show, setShow, callback }) {
    return (
        <div>
            <Modal show={show} fullscreen={false} onHide={() => setShow(false)} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Are you sure you want to delete?</label>
                    </div>
                    <input className="btn btn-danger mt-2" type="button" value="Confirm" onClick={callback} />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Confirm
