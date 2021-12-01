import React, { useEffect, useContext, useState } from "react";
import Layout from "../../layout";
import GlobalContext from "../../utils/GlobalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../../components/Pagination";
import InputV1 from "../../components/input/InputV1";
import ButtonV1 from "../../components/input/ButtonV1";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import qs from "qs";
import Axios from "../../hooks/useApi";
import Confirm from "../../components/input/Confirm";
import CheckboxV1 from "../../components/input/CheckboxV1";
import SelectV1 from "../../components/input/SelectV1";
import CreateResource from "../../components/forms/CreateResource";
import UpdateResource from "../../components/forms/UpdateResource";

async function getEnvironments() {
  const { data } = await Axios.get("/v1/environments?limit=" + 100);
  return data.data;
}

async function getResourceTypes() {
  const { data } = await Axios.get("/v1/resources/resource-types?limit=" + 100);
  return data.data;
}

async function scan(id, name) {
  let request = {};

  const { data, status, statusText } = await Axios.post(
    `/v1/resources/${id}/scan`,
    request
  );
  if (status > 400) {
    throw data.detail;
  } else {
    return data.data;
  }
}

async function fetchResources(page = 1, requestParams = []) {
  const queryString = qs.stringify(requestParams);
  const { data } = await Axios.get(
    "/v1/resources?page=" + page + "&" + queryString
  );
  return data;
}

async function deleteResource(id, callback) {
  const { data } = await Axios.delete("/v1/resources/" + id);
  callback();
  return data;
}

const tdConfig = {
  index: { align: "right", width: "30px" },
  name: { align: "left" },
  ipv4: { align: "left", width: "50px" },
  ipv6: { align: "left", width: "50px" },
  active: { align: "center", width: "50px" },
};
const headings = {
  index: "#",
  name: "Name",
  ipv4: "IPV4",
  ipv6: "IPV6",
  active: "Active",
};

export default function Resources() {
  const global = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [group, setGroup] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(true);
  const [ipv4Filter, setIpv4Filter] = useState("");
  const [ipv6Filter, setIpv6Filter] = useState("");
  const [resourceTypeFilter, setResourceTypeFilter] = useState(null);
  const [environment, setEnvironment] = useState(null);
  const [resourceType, setResourceType] = useState(null);
  const [showAdhocScanConfirmation, setShowAdhocScanConfirmation] =
    useState(false);
  const [scanId, setScanId] = useState(null);
  const [resourceName, setResourceName] = useState("");

  const { status, data, error, isFetching, refetch } = useQuery(
    ["resources", page],
    () =>
      fetchResources(page, {
        name: nameFilter,
        status: statusFilter,
        environment: environment,
        resource_type: resourceType,
        ipv4: ipv4Filter,
        ipv6: ipv6Filter,
        resource_type: resourceTypeFilter,
      }),
    { keepPreviousData: false, staleTime: 5000 }
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

  const createGroupHandler = () => {
    setShowCreateGroup(true);
  };

  const updateEnvironmentHandler = (e, id) => {
    e.preventDefault();
    setUpdateId(id);
    setShowUpdate(true);
  };

  const deleteGroupHandler = (id) => {
    setDeleteId(id);
    setShowDeleteConfirmation(true);
  };

  const adhocScanHandler = (e, id, name) => {
    e.preventDefault();
    setScanId(id);
    setResourceName(name);
    setShowAdhocScanConfirmation(true);
  };

  const adhocScanCallback = () => {
    toast.promise(scan(scanId, resourceName), {
      pending: "Scanning resource '" + resourceName + "'",
      success: {
        render({ data }) {
          return `Scan Completed`;
        },
      },
      error: {
        render({ data }) {
          return `Error ${data}`;
        },
      },
    });
    setShowAdhocScanConfirmation(false);
  };

  const deleteEnvironmentCallback = () => {
    toast.promise(deleteResource(deleteId, refetch), {
      pending: "Processing",
      success: {
        render({ data }) {
          return `Success ${data}`;
        },
      },
      error: "Error",
    });
    setShowDeleteConfirmation(false);
  };

  useEffect(() => {
    global.update({ ...global, ...{ pageTitle: "Resources" } });
  }, []);

  useEffect(() => {
    refetch();
  }, [
    nameFilter,
    environment,
    statusFilter,
    resourceType,
    ipv4Filter,
    ipv6Filter,
    resourceTypeFilter,
  ]);

  const limit = process.env.LIMIT;
  const total =
    data && data.meta && data.meta.total_records ? data.meta.total_records : 0;
  const current_page =
    data && data.meta && data.meta.current_page ? data.meta.current_page : 1;

  return (
    <div>
      <h4>
        List of Resources{" "}
        <FontAwesomeIcon icon={["fas", "server"]} fixedWidth />
      </h4>{" "}
      <pre>Resource Management functions.</pre>
      <div className="row">
        <div className="col-md-6">
          <h6>Filter by</h6>
          <InputV1 label="Name" value={nameFilter} setValue={setNameFilter} />
          <InputV1 label="IPv4" value={ipv4Filter} setValue={setIpv4Filter} />
          <InputV1 label="IPv6" value={ipv6Filter} setValue={setIpv6Filter} />

          {resourceTypeOptions ? (
            <SelectV1
              label="Resource type"
              values={resourceTypeOptions}
              value={resourceTypeFilter}
              setValue={setResourceTypeFilter}
            />
          ) : null}
          {environmentOptions ? (
            <SelectV1
              label="Environments"
              values={environmentOptions}
              value={environment}
              setValue={setEnvironment}
            />
          ) : null}
          <CheckboxV1
            label="Filter active items "
            value={statusFilter}
            setValue={setStatusFilter}
          />
        </div>
        <div className="col-md-6">
          <h6>Actions</h6>
          <ButtonV1
            onClick={createGroupHandler}
            label="Create New Resource"
            shortcut="Ctrl + Shift + C"
          />
        </div>
      </div>
      <table className="table table-hover table-bordered">
        <caption>
          Showing{" "}
          {total - (current_page - 1) * limit > limit
            ? limit
            : total - (current_page - 1) * limit}{" "}
          out of {total}
        </caption>
        <thead>
          <tr key="heading">
            {Object.keys(headings).map((key) => {
              return (
                <th key={key} className="text-center">
                  {headings[key]}
                </th>
              );
            })}
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        {data && data.data ? (
          <tbody>
            {data.data.map((d, dataIndex) => {
              return (
                <tr key={dataIndex}>
                  {Object.keys(headings).map((key) => {
                    try {
                      return (
                        <td
                          key={dataIndex + "_" + key}
                          width={tdConfig[key] ? tdConfig[key].width : null}
                          align={tdConfig[key] ? tdConfig[key].align : null}
                        >
                          {typeof d[key] === "object"
                            ? d[key][tdConfig[key]["key"]]
                            : d[key]}
                        </td>
                      );
                    } catch {
                      return (
                        <td
                          key={dataIndex + "_" + key}
                          width={tdConfig[key] ? tdConfig[key].width : null}
                          align={tdConfig[key] ? tdConfig[key].align : null}
                        ></td>
                      );
                    }
                  })}
                  <td width="250px" align="center">
                    <a
                      href="#"
                      className="btn btn-outline-primary btn-sm mr-2"
                      onClick={(e) => {
                        adhocScanHandler(e, d.id, d.name);
                      }}
                    >
                      Adhoc Scan
                    </a>
                    <a
                      href="#"
                      className="btn btn-outline-primary btn-sm mr-2"
                      onClick={(e) => {
                        updateEnvironmentHandler(e, d.id);
                      }}
                    >
                      Edit
                    </a>
                    <a
                      className="btn btn-outline-danger btn-sm mr-2"
                      onClick={() => {
                        deleteGroupHandler(d.id);
                      }}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        ) : null}

        {!isFetching && !data ? (
          <tbody>
            <tr key="noresults">
              <td
                align="center"
                className="display-6"
                colSpan={Object.keys(headings).length + 1}
              >
                No Results
              </td>
            </tr>
          </tbody>
        ) : null}
      </table>
      {isFetching ? (
        <div className="text-center">
          <FontAwesomeIcon icon={["fas", "circle-notch"]} spin size="5x" />
        </div>
      ) : null}
      {data && data.meta && data.meta.num_pages > 0 ? (
        <Pagination
          num_pages={data.meta.num_pages}
          current_page={page}
          setPage={setPage}
        />
      ) : null}
      <CreateResource
        show={showCreateGroup}
        setShow={setShowCreateGroup}
        refetch={refetch}
      />
      <UpdateResource
        id={updateId}
        show={showUpdate}
        setShow={setShowUpdate}
        refetch={refetch}
      />
      <Confirm
        show={showDeleteConfirmation}
        setShow={setShowDeleteConfirmation}
        callback={deleteEnvironmentCallback}
      />
      <Confirm
        show={showAdhocScanConfirmation}
        setShow={setShowAdhocScanConfirmation}
        callback={adhocScanCallback}
        label="Perform Adhoc Scan"
      />
    </div>
  );
}

Resources.getLayout = function getLayout(page) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};
