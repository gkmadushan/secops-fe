import React from 'react'
import InputV1 from '../input/InputV1'
import TextareaV1 from '../input/TextareaV1'
import { Modal } from "react-bootstrap";

function UpdateUser({ id, show, setShow, data }) {
    return (
        <Modal show={show} fullscreen={false} onHide={() => setShow(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Update User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputV1 label="Group Name" value={data[id] ? data[id].name : null} />
                <TextareaV1 label="Description" value={data[id] ? data[id].description : null} />
                <input className="btn btn-primary mt-2" type="button" value="Submit" />
            </Modal.Body>
        </Modal>
    )
}

export default UpdateUser
