import React from 'react'
import InputV1 from '../input/InputV1'
import SelectV1 from '../input/SelectV1'
import { Modal } from "react-bootstrap";
import CheckboxGroupV1 from '../input/CheckboxGroupV1';

function UpdateUser({ id, show, setShow, data }) {
    return (
        <Modal show={show} fullscreen={false} onHide={() => setShow(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Register User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputV1 label="Email" />
                <InputV1 label="Name" />
                <SelectV1 label="Role" values={["Administrator", "DevOpsEngineer", "SecurityEngineer", "Master"]} />
                <CheckboxGroupV1 label="Groups" values={["Group 1", "Group 2", "Group 3", "Group 4"]} />
                <input className="btn btn-primary mt-2" type="button" value="Submit" />
            </Modal.Body>
        </Modal>
    )
}

export default UpdateUser
