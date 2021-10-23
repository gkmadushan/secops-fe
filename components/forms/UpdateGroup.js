import React, { useState, useEffect, useRef } from 'react'
import InputV1 from '../input/InputV1'
import TextareaV1 from '../input/TextareaV1'
import { Modal } from "react-bootstrap";
import SelectV1 from '../input/SelectV1';
import CheckboxGroupV1 from '../input/CheckboxGroupV1';
import Axios from '../../hooks/useApi';
import { useQuery } from "react-query";

async function updateGroup(id, request, refetch = null, refetchDetails = null) {
    const { data } = await Axios.put('/v1/groups/' + id, request);
    if (refetch !== null) {
        refetch();
    }
    if (refetchDetails !== null) {
        refetchDetails();
    }
    return data;
}

async function getGroup(id, setName, setDescription) {
    const { data } = await Axios.get('/v1/groups/' + id);
    if (data && data.data) {
        if (data.data.name) {
            setName(data.data.name)
        }
        if (data.data.description) {
            setDescription(data.data.description)
        }
    }
    return data.data;
}

function UpdateGroup({ id, show, setShow, refetch = null }) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("")

    const { data: groupData, isFetching, refetch: refetchDetails } = useQuery(
        ['group-' + id],
        () => getGroup(id, setName, setDescription),
        { staleTime: 5000, refetchOnMount: true }
    )

    const handleUpdateGroup = (e) => {
        e.preventDefault();
        let request = { "name": name, "description": description };
        updateGroup(id, request, refetch, refetchDetails);
        setShow(false);
    }

    return (
        <Modal show={show} fullscreen={false} onHide={() => setShow(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Update User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isFetching ? <h3>Loading...</h3> : (
                    < form onSubmit={(e) => { handleUpdateGroup(e) }} action="#">
                        <InputV1 label="Name" value={name} setValue={setName} required validationError="Invalid Name" />
                        <TextareaV1 label="Description" value={description} setValue={setDescription} />
                        <input className="btn btn-primary mt-2" type="submit" value="Submit" />
                    </form>)}
            </Modal.Body>
        </Modal >
    )
}

export default UpdateGroup
