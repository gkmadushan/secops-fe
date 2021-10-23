import React, { useState, useEffect, useRef } from 'react'
import InputV1 from '../input/InputV1'
import TextareaV1 from '../input/TextareaV1'
import { Modal } from "react-bootstrap";
import SelectV1 from '../input/SelectV1';
import CheckboxGroupV1 from '../input/CheckboxGroupV1';
import Axios from '../../hooks/useApi';
import { useQuery } from "react-query";

async function createUser(request, refetch = null) {
    const { data } = await Axios.post('/v1/users', request);
    if (refetch !== null) {
        refetch();
    }
    return data;
}

async function getGroups() {
    const { data } = await Axios.get('/v1/groups?limit=' + 100);
    return data.data;
}

async function getRoles() {
    const { data } = await Axios.get('/v1/roles?limit=' + 100);
    return data.data;
}

function CreateUser({ show, setShow, refetch = null }) {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState(null)
    const [groups, setGroups] = useState(null)

    const handleCreateUser = (e) => {
        e.preventDefault();
        let request = { "email": email, "name": name, "role": role, "groups": groups };
        createUser(request, refetch);
        setShow(false);
    }

    const { data: groupOptions } = useQuery(
        ['groups'],
        () => getGroups(),
        { staleTime: 5000 }
    )

    const { data: roleOptions } = useQuery(
        ['roles'],
        () => getRoles(),
        { staleTime: 5000 }
    )

    return (
        <Modal show={show} fullscreen={false} onHide={() => setShow(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Register User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={(e) => { handleCreateUser(e) }} action="#">
                    <InputV1 type="email" label="Email" value={email} setValue={setEmail} required validationError="Invalid Email" pattern=".+@.+\..+" />
                    <InputV1 label="Name" value={name} setValue={setName} required validationError="Invalid Name" />
                    <SelectV1 label="Role" value={role} setValue={setRole} values={roleOptions} required validationError="Role is required" />
                    <CheckboxGroupV1 label="Groups" values={groupOptions} value={groups} setValue={setGroups} />
                    <input className="btn btn-primary mt-2" type="submit" value="Submit" />
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default CreateUser
