import React, { useState, useEffect, useRef } from 'react'
import InputV1 from '../input/InputV1'
import TextareaV1 from '../input/TextareaV1'
import { Modal } from "react-bootstrap";
import Axios from '../../hooks/useApi';
import { group } from 'd3-array';
import CheckboxV1 from '../input/CheckboxV1';
import SelectV1 from '../input/SelectV1';
import { useQuery } from 'react-query';

async function getGroups() {
    const { data } = await Axios.get('/v1/groups?limit=' + 100);
    return data.data;
}


async function createEnvironment(request, refetch = null) {
    const { data } = await Axios.post('/v1/environments', request);
    if (refetch !== null) {
        refetch();
    }
    return data;
}

function CreateEnvironment({ show, setShow, refetch = null }) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("")
    const [deleted, setDeleted] = useState(false);
    const [scanStartTime, setScanStartTime] = useState("00:00")
    const [scanTerminateTime, setScanTerminateTime] = useState("00:00")
    const [group, setGroup] = useState(null);
    const [active, setActive] = useState(false);

    const handleCreateEnvironment = (e) => {
        e.preventDefault();
        let request = { "name": name, "description": description, "deleted": deleted, "scan_start_time": scanStartTime, "scan_terminate_time": scanTerminateTime, "group": group, "active": active };
        createEnvironment(request, refetch);
        setShow(false);
    }

    const { data: groupOptions } = useQuery(
        ['groups'],
        () => getGroups(),
        { staleTime: 5000 }
    )

    return (
        <Modal show={show} fullscreen={false} onHide={() => setShow(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Create Software Environment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={(e) => { handleCreateEnvironment(e) }} action="#">
                    <InputV1 label="Name" value={name} setValue={setName} required validationError="Invalid Name" />
                    <TextareaV1 label="Description" value={description} setValue={setDescription} />
                    <CheckboxV1 label="Active" value={active} setValue={setActive} />
                    <InputV1 type='time' label="Scan Schedule Start Time" value={scanStartTime} setValue={setScanStartTime} required validationError="Invalid Time format" />
                    <InputV1 type='time' label="Scan Terminate Time" value={scanTerminateTime} setValue={setScanTerminateTime} validationError="Invalid Time format" />
                    <SelectV1 label="Group" value={group} setValue={setGroup} values={groupOptions} required validationError="Group is required" />

                    <input className="btn btn-primary mt-2" type="submit" value="Submit" />
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default CreateEnvironment
