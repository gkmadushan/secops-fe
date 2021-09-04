import React from 'react'
import InputV1 from '../input/InputV1'
import TextareaV1 from '../input/TextareaV1'
import { Modal } from "react-bootstrap";

function CreateGroup({ show, setShow }) {
    return (
        <Modal show={show} fullscreen={false} onHide={() => setShow(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Create New Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputV1 label="Group Name" />
                <TextareaV1 label="Description" />
                <input className="btn btn-primary mt-2" type="button" value="Submit" />
            </Modal.Body>
        </Modal>
    )
}

export default CreateGroup
