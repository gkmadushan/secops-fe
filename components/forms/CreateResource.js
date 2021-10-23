import React, { useState, useEffect, useRef } from 'react'
import InputV1 from '../input/InputV1'
import TextareaV1 from '../input/TextareaV1'
import { Modal } from "react-bootstrap";
import Axios from '../../hooks/useApi';
import CheckboxV1 from '../input/CheckboxV1';
import SelectV1 from '../input/SelectV1';
import { useQuery } from 'react-query';

async function getEnvironments() {
    const { data } = await Axios.get('/v1/environments?limit=' + 100);
    return data.data;
}

async function getResourceTypes() {
    const { data } = await Axios.get('/v1/resources/resource-types?limit=' + 100);
    return data.data;
}

async function createResource(request, refetch = null) {
    const { data } = await Axios.post('/v1/resources', request);
    if (refetch !== null) {
        refetch();
    }
    return data;
}

function CreateResource({ show, setShow, refetch = null }) {

    const [name, setName] = useState("");
    const [active, setActive] = useState(false);
    const [environment, setEnvironment] = useState(null);
    const [resourceType, setResourceType] = useState(null);
    const [ipv4, setipv4] = useState("");
    const [ipv6, setipv6] = useState("");
    const [username, setUsername] = useState("");
    const [port, setPort] = useState(0);
    const [protocol, setProtocol] = useState("");
    const [password, setPassword] = useState("");


    const handleCreateResource = (e) => {
        e.preventDefault();
        let request = { "name": name, "environment": environment, "active": active, "resource_type": resourceType, "ipv4": ipv4, "ipv6": ipv6, "console_username": username, "port": port, "protocol": protocol, "password": password };
        createResource(request, refetch);
        setShow(false);
    }

    const { data: environmentOptions } = useQuery(
        ['environments'],
        () => getEnvironments(),
        { staleTime: 5000 }
    )

    const { data: resourceTypeOptions } = useQuery(
        ['resourcetypes'],
        () => getResourceTypes(),
        { staleTime: 5000 }
    )

    return (
        <Modal show={show} fullscreen={false} onHide={() => setShow(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Create Software Resource</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={(e) => { handleCreateResource(e) }} action="#">
                    <InputV1 label="Name" value={name} setValue={setName} required validationError="Invalid Name" />
                    <SelectV1 label="Resource Type" value={resourceType} setValue={setResourceType} values={resourceTypeOptions} required validationError="Resource type is required" />
                    <SelectV1 label="Environment" value={environment} setValue={setEnvironment} values={environmentOptions} required validationError="Environment is required" />
                    <InputV1 label="IPv4" value={ipv4} setValue={setipv4} pattern="((^|\.)((25[0-5]_*)|(2[0-4]\d_*)|(1\d\d_*)|([1-9]?\d_*))){4}_*$" validationError="Invalid IPv4 address" />
                    <InputV1 label="IPv6" value={ipv6} setValue={setipv6} pattern="((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))" validationError="Invalid IPv6 address" />
                    <InputV1 label="Console Username" value={username} setValue={setUsername} required validationError="Username is required" />
                    <InputV1 label="Console Password" value={password} setValue={setPassword} required validationError="Password is required" />
                    <InputV1 label="Port" value={port} setValue={setPort} required validationError="Port is required" />
                    <InputV1 label="Protocol" value={protocol} setValue={setProtocol} required validationError="Protocol is required" />
                    <CheckboxV1 label="Active" value={active} setValue={setActive} />

                    <input className="btn btn-primary mt-2" type="submit" value="Submit" />
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default CreateResource
