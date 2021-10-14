import React, { useState, useEffect, useRef } from 'react'
import InputV1 from '../input/InputV1'
import TextareaV1 from '../input/TextareaV1'
import { Modal } from "react-bootstrap";
import SelectV1 from '../input/SelectV1';
import CheckboxGroupV1 from '../input/CheckboxGroupV1';
import Axios from '../../hooks/useApi';
import { useQuery } from "react-query";

async function updateUser(id, request, refetch = null, refetchDetails = null) {
    const { data } = await Axios.put('user-service/v1/users/' + id, request);
    if (refetch !== null) {
        refetch();
    }
    if (refetchDetails !== null) {
        refetchDetails();
    }
    return data;
}

async function getGroups() {
    const { data } = await Axios.get('user-service/v1/groups?limit=' + 100);
    return data.data;
}

async function getRoles() {
    const { data } = await Axios.get('user-service/v1/roles?limit=' + 100);
    return data.data;
}

async function getUser(id, setEmail, setName, setRole, setGroups) {
    const { data } = await Axios.get('user-service/v1/users/' + id);
    if (data && data.data) {
        if (data.data.email) {
            setEmail(data.data.email)
        }
        if (data.data.name) {
            setName(data.data.name)
        }
        if (data.data.role_id) {
            setRole(data.data.role_id)
        }
        if (data.data.groups) {
            setGroups(data.data.groups)
        }

    }
    return data.data;
}

function UpdateUser({ id, show, setShow, refetch = null }) {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState(null)
    const [groups, setGroups] = useState(null)

    const { data: userData, isFetching, refetch: refetchDetails } = useQuery(
        ['user-' + id],
        () => getUser(id, setEmail, setName, setRole, setGroups),
        { staleTime: 5000, refetchOnMount: true }
    )

    const handleUpdateUser = (e) => {
        e.preventDefault();
        let request = { "email": email, "name": name, "role": role, "groups": groups };
        updateUser(id, request, refetch, refetchDetails);
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
                <Modal.Title>Update User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isFetching ? <h3>Loading...</h3> : (
                    < form onSubmit={(e) => { handleUpdateUser(e) }} action="#">
                        <InputV1 type="email" label="Email" value={email} readonly={true} />
                        <InputV1 label="Name" value={name} setValue={setName} required validationError="Invalid Name" />
                        <SelectV1 label="Role" value={role} setValue={setRole} values={roleOptions} required validationError="Role is required" />
                        <CheckboxGroupV1 label="Groups" values={groupOptions} value={groups} setValue={setGroups} />
                        <input className="btn btn-primary mt-2" type="submit" value="Submit" />
                    </form>)}
            </Modal.Body>
        </Modal >
    )
}

export default UpdateUser
