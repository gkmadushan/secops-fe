import React from 'react'
import InputV1 from '../input/InputV1'
import TextareaV1 from '../input/TextareaV1'
import { Modal } from "react-bootstrap";
import SelectV1 from '../input/SelectV1';

function CreateUser({ show, setShow }) {
    return (
        <Modal show={show} fullscreen={false} onHide={() => setShow(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Register User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputV1 label="Email" />
                <InputV1 label="Name" />
                <SelectV1 label="Role" values={["Administrator", "DevOpsEngineer", "SecurityEngineer", "Master"]} />
                <SelectV1 label="Role" values={["Administrator", "DevOpsEngineer", "SecurityEngineer", "Master"]} />
                <TextareaV1 label="Description" />
                <input className="btn btn-primary mt-2" type="button" value="Submit" />
            </Modal.Body>
        </Modal>
    )
}

export default CreateUser
