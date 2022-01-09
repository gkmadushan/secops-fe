import React, { useState, useEffect, useRef } from "react";
import InputV1 from "../input/InputV1";
import TextareaV1 from "../input/TextareaV1";
import { Modal } from "react-bootstrap";
import Axios from "../../hooks/useApi";
import { group } from "d3-array";
import CheckboxV1 from "../input/CheckboxV1";
import SelectV1 from "../input/SelectV1";
import { useQuery } from "react-query";

async function getGroups() {
  const { data } = await Axios.get("/v1/groups?limit=" + 100);
  return data.data;
}

async function getFrequency() {
  const { data } = await Axios.get("/v1/resources/frequencies");
  return data.data;
}

async function getEnvironment(
  id,
  setName,
  setDescription,
  setScanStartTime,
  setScanTerminateTime,
  setGroup,
  setActive,
  setFrequency
) {
  const { data } = await Axios.get("/v1/environments/" + id);
  if (data && data.data) {
    if (data.data.name) {
      setName(data.data.name);
    } else {
      setName("");
    }
    if (data.data.description) {
      setDescription(data.data.description);
    } else {
      setDescription("");
    }
    if (data.schedule.data.start) {
      setScanStartTime(data.schedule.data.start);
    } else {
      setScanStartTime("00:00");
    }
    if (data.schedule.data.terminate) {
      setScanTerminateTime(data.schedule.data.terminate);
    } else {
      setScanTerminateTime("00:00");
    }
    if (data.data.group_id) {
      setGroup(data.data.group_id);
    } else {
      setGroup("");
    }
    if (data.data.active) {
      setActive(data.data.active);
    } else {
      setActive(false);
    }
    if (data.schedule.data.frequency) {
      setFrequency(data.schedule.data.frequency);
    } else {
      setFrequency("");
    }
  }
  return data.data;
}

async function updateEnvironment(id, request, refetch = null) {
  const { data } = await Axios.put("/v1/environments/" + id, request);
  if (refetch !== null) {
    refetch();
  }
  return data;
}

function UpdateEnvironment({ id, show, setShow, refetch = null }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [scanStartTime, setScanStartTime] = useState("00:00");
  const [scanTerminateTime, setScanTerminateTime] = useState("00:00");
  const [group, setGroup] = useState(null);
  const [active, setActive] = useState(false);
  const [frequency, setFrequency] = useState("");

  const handleUpdateEnvironment = (e) => {
    e.preventDefault();
    let request = {
      name: name,
      description: description,
      deleted: deleted,
      scan_start_time: scanStartTime,
      scan_terminate_time: scanTerminateTime,
      group: group,
      active: active,
      frequency: frequency,
    };
    updateEnvironment(id, request, refetch);
    setShow(false);
  };

  const { data: frequencyOptions } = useQuery(
    ["frequency"],
    () => getFrequency(),
    {
      staleTime: 1,
    }
  );

  const {
    data: environmentData,
    isFetching,
    refetch: refetchDetails,
  } = useQuery(
    ["group-" + id],
    () =>
      getEnvironment(
        id,
        setName,
        setDescription,
        setScanStartTime,
        setScanTerminateTime,
        setGroup,
        setActive,
        setFrequency
      ),
    { staleTime: 5000, refetchOnMount: true }
  );

  const { data: groupOptions } = useQuery(["groups"], () => getGroups(), {
    staleTime: 5000,
  });

  return (
    <Modal
      show={show}
      fullscreen={false}
      onHide={() => setShow(false)}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Software Environment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          onSubmit={(e) => {
            handleUpdateEnvironment(e);
          }}
          action="#"
        >
          <InputV1
            label="Name"
            value={name}
            setValue={setName}
            required
            validationError="Invalid Name"
          />
          <TextareaV1
            label="Description"
            value={description}
            setValue={setDescription}
          />
          <CheckboxV1 label="Active" value={active} setValue={setActive} />
          <SelectV1
            label="Group"
            value={group}
            setValue={setGroup}
            values={groupOptions}
            required
            validationError="Group is required"
          />
          <h5>Scan Schedule</h5>
          <hr />
          <SelectV1
            label="Frequency"
            value={frequency}
            setValue={setFrequency}
            values={frequencyOptions}
            required
            validationError="Frequency is required"
          />
          <InputV1
            type="time"
            label="Scan Schedule Start Time"
            value={scanStartTime}
            setValue={setScanStartTime}
            required
            validationError="Invalid Time format"
          />
          <InputV1
            type="time"
            label="Scan Terminate Time"
            value={scanTerminateTime}
            setValue={setScanTerminateTime}
            validationError="Invalid Time format"
          />

          <input
            className="btn btn-primary mt-2"
            type="submit"
            value="Submit"
          />
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateEnvironment;
