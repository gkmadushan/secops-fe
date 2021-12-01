import React, { useState, useEffect, useRef } from "react";
import InputV1 from "../input/InputV1";
import TextareaV1 from "../input/TextareaV1";
import { Modal } from "react-bootstrap";
import Axios from "../../hooks/useApi";
import CheckboxV1 from "../input/CheckboxV1";
import SelectV1 from "../input/SelectV1";
import { useQuery } from "react-query";

async function getEnvironments() {
  const { data } = await Axios.get("/v1/environments?limit=" + 100);
  return data.data;
}

async function getResourceTypes() {
  const { data } = await Axios.get("/v1/resources/resource-types?limit=" + 100);
  return data.data;
}

async function updateResource(id, request, refetch = null) {
  const { data } = await Axios.put("/v1/resources/" + id, request);
  if (refetch !== null) {
    refetch();
  }
  return data;
}

async function getOs() {
  const { data } = await Axios.get("/v1/resources/os");
  return data.data;
}

async function testConnection(request, setResponse, setOs) {
  setResponse("Loading...");
  const { data } = await Axios.post("/v1/resources/connection-test", request);
  setResponse(data.detail ?? "Connection successful");
  setOs(data.osname ?? "");
  return data;
}

async function getResource(
  id,
  setName,
  setActive,
  setEnvironment,
  setResourceType,
  setipv4,
  setipv6,
  setUsername,
  setPort,
  setProtocol,
  setOs
) {
  const { data } = await Axios.get("/v1/resources/" + id);
  if (data && data.data) {
    if (data.data.name) {
      setName(data.data.name);
    }
    if (data.data.active) {
      setActive(data.data.active);
    }
    if (data.data.environment_id) {
      setEnvironment(data.data.environment_id);
    }
    if (data.data.resource_type_id) {
      setResourceType(data.data.resource_type_id);
    }
    if (data.data.ipv4) {
      setipv4(data.data.ipv4);
    }
    if (data.data.ipv6) {
      setipv6(data.data.ipv6);
    }
    if (data.data.console_username) {
      setUsername(data.data.console_username);
    }
    if (data.data.port) {
      setPort(data.data.port);
    }
    if (data.data.protocol) {
      setProtocol(data.data.protocol);
    }
    if (data.data.os) {
      setOs(data.data.os);
    } else {
      setOs("");
    }
  }
  return data.data;
}

function UpdateResource({ id, show, setShow, refetch = null }) {
  const [name, setName] = useState("");
  const [active, setActive] = useState(false);
  const [environment, setEnvironment] = useState(null);
  const [resourceType, setResourceType] = useState(null);
  const [ipv4, setipv4] = useState("");
  const [ipv6, setipv6] = useState("");
  const [username, setUsername] = useState("");
  const [port, setPort] = useState(22);
  const [protocol, setProtocol] = useState("");
  const [password, setPassword] = useState("");
  const [os, setOs] = useState("");
  const [connectionTestResponse, setConnectionTestResponse] = useState("");

  const handleUpdateResource = (e) => {
    e.preventDefault();
    let request = {
      name: name,
      environment: environment,
      active: active,
      resource_type: resourceType,
      ipv4: ipv4,
      ipv6: ipv6,
      console_username: username,
      port: port,
      protocol: protocol,
      password: password,
      os: os,
    };
    updateResource(id, request, refetch);
    setShow(false);
  };

  const handleTestConnection = (e) => {
    e.preventDefault();
    let request = {
      name: name,
      environment: environment,
      active: active,
      resource_type: resourceType,
      ipv4: ipv4,
      ipv6: ipv6,
      console_username: username,
      port: port,
      protocol: protocol,
      password: password,
      os: os,
    };
    testConnection(request, setConnectionTestResponse, setOs);
  };

  const { data: resourceData, isFetching } = useQuery(
    ["resource-" + id],
    () =>
      getResource(
        id,
        setName,
        setActive,
        setEnvironment,
        setResourceType,
        setipv4,
        setipv6,
        setUsername,
        setPort,
        setProtocol,
        setOs
      ),
    { staleTime: 5000, refetchOnMount: true }
  );

  const { data: environmentOptions } = useQuery(
    ["environments"],
    () => getEnvironments(),
    { staleTime: 5000 }
  );

  const { data: resourceTypeOptions } = useQuery(
    ["resourcetypes"],
    () => getResourceTypes(),
    { staleTime: 5000 }
  );

  const { data: osOptions } = useQuery(["os"], () => getOs(), {
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
        <Modal.Title>Update Software Resource</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          onSubmit={(e) => {
            handleUpdateResource(e);
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
          <SelectV1
            label="Resource Type"
            value={resourceType}
            setValue={setResourceType}
            values={resourceTypeOptions}
            required
            validationError="Resource type is required"
          />
          <SelectV1
            label="Environment"
            value={environment}
            setValue={setEnvironment}
            values={environmentOptions}
            required
            validationError="Environment is required"
          />
          <InputV1
            label="IPv4"
            value={ipv4}
            setValue={setipv4}
            pattern="((^|\.)((25[0-5]_*)|(2[0-4]\d_*)|(1\d\d_*)|([1-9]?\d_*))){4}_*$"
            validationError="Invalid IPv4 address"
          />
          <InputV1
            label="IPv6"
            value={ipv6}
            setValue={setipv6}
            pattern="((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))"
            validationError="Invalid IPv6 address"
          />
          <InputV1
            label="Console Username"
            value={username}
            setValue={setUsername}
            required
            validationError="Username is required"
          />
          <InputV1
            label="Console Password"
            type="password"
            value={password}
            setValue={setPassword}
          />
          <InputV1
            label="Port"
            value={port}
            setValue={setPort}
            required
            validationError="Port is required"
          />
          <InputV1
            label="Protocol"
            value={protocol}
            setValue={setProtocol}
            required
            validationError="Protocol is required"
          />
          <CheckboxV1 label="Active" value={active} setValue={setActive} />
          <input
            className="btn btn-outline-primary mr-2 mb-3"
            type="submit"
            value="Test Connection"
            onClick={(e) => {
              handleTestConnection(e);
            }}
          />
          {connectionTestResponse && (
            <div class="alert alert-primary">{connectionTestResponse}</div>
          )}
          <SelectV1
            label="Operating System"
            value={os}
            setValue={setOs}
            values={osOptions}
            shortcut=""
            nameField="os"
            idField="os"
            required={!os}
            validationError="Operating System Required"
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

export default UpdateResource;
