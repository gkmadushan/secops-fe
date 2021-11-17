import React, { useState, useEffect, useRef } from 'react'
import InputV1 from '../input/InputV1'
import TextareaV1 from '../input/TextareaV1'
import { Modal } from "react-bootstrap";
import Axios from '../../hooks/useApi';
import CheckboxV1 from '../input/CheckboxV1';
import SelectV1 from '../input/SelectV1';
import { useQuery } from 'react-query';

async function getInventoryItem(id) {
    const { data } = await Axios.get('/v1/inventory/' + id);
    return data.data;
}

async function getInventoryItemVarients(id) {
    const { data } = await Axios.get('/v1/inventory/varients?item_id=' + id);
    return data.data;
}


async function createEnvironment(request, refetch = null) {
    const { data } = await Axios.post('/v1/environments', request);
    if (refetch !== null) {
        refetch();
    }
    return data;
}

function ViewInventoryVarient({ id, show, setShow, refetch = null }) {

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

    const { data: item } = useQuery(
        ['inventoryitem' + id],
        () => getInventoryItem(id),
        { staleTime: 5000 }
    )

    const { data: varients } = useQuery(
        ['inventoryitemvarients' + id],
        () => getInventoryItemVarients(id),
        { staleTime: 5000 }
    )

    if (item) {
        return (
            <Modal show={show} fullscreen={false} onHide={() => setShow(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Software Component {item.name} varients in use</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{item.description}</p>
                    <table>
                        {varients ? (
                            <>
                                <tr>
                                    <th width="10%">version</th>
                                    <th width="90%">notes</th>
                                </tr>
                                {varients.map((varient) => {
                                    return (<tr><td>{varient.version}</td><td>{varient.notes}</td></tr>)
                                })}
                            </>
                        ) : null}
                    </table>
                </Modal.Body>
            </Modal>
        )
    } else {
        return null
    }
}

export default ViewInventoryVarient
