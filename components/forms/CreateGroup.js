import React, { useState, useEffect, useRef } from 'react'
import InputV1 from '../input/InputV1'
import TextareaV1 from '../input/TextareaV1'
import { Modal } from "react-bootstrap";
import Axios from '../../hooks/useApi';

async function createGroup(request, refetch = null) {
    const { data } = await Axios.post('/v1/groups', request);
    if (refetch !== null) {
        refetch();
    }
    return data;
}

function CreateGroup({ show, setShow, refetch = null }) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("")

    const handleCreateGroup = (e) => {
        e.preventDefault();
        let request = { "name": name, "description": description };
        createGroup(request, refetch);
        setShow(false);
    }

    return (
        <Modal show={show} fullscreen={false} onHide={() => setShow(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Create Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={(e) => { handleCreateGroup(e) }} action="#">
                    <InputV1 label="Name" value={name} setValue={setName} required validationError="Invalid Name" />
                    <TextareaV1 label="Description" value={description} setValue={setDescription} />
                    <input className="btn btn-primary mt-2" type="submit" value="Submit" />
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default CreateGroup
