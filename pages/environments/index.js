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
import CreateEnvironment from "../../components/forms/CreateEnvironment";
import UpdateEnvironment from "../../components/forms/UpdateEnvironment";

const API_URL = process.env.API_URL;

async function getGroups() {
  const { data } = await Axios.get("/v1/groups?limit=" + 100);
  return data.data;
}

async function fetchEnvironments(page = 1, requestParams = []) {
  const queryString = qs.stringify(requestParams);
  const { data } = await Axios.get(
    "/v1/environments?page=" + page + "&" + queryString
  );
  return data;
}

async function deleteEnvironment(id, callback) {
  const { data } = await Axios.delete("/v1/environments/" + id);
  callback();
  return data;
}

const tdConfig = {
  index: { align: "right", width: "30px" },
  name: { align: "left" },
  // scan_start_time: { align: "left", width: "50px" },
  // scan_terminate_time: { align: "left", width: "50px" },
  active: { align: "center", width: "50px" },
};
const headings = {
  index: "#",
  name: "Name",
  // scan_start_time: "Scan Start",
  // scan_terminate_time: "Scan Terminate",
  active: "Active",
};

export default function Environments() {
  const global = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [page, setPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [group, setGroup] = useState(null);
  const [statusFilter, setStatusFilter] = useState(false);

  const { status, data, error, isFetching, refetch } = useQuery(
    ["environments", page],
    () =>
      fetchEnvironments(page, {
        name: nameFilter,
        status: statusFilter,
        group: group,
      }),
    { keepPreviousData: false, staleTime: 5000 }
  );

  const { data: groupOptions } = useQuery(["groups"], () => getGroups(), {
    staleTime: 5000,
  });

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

  const deleteEnvironmentCallback = () => {
    toast.promise(deleteEnvironment(deleteId, refetch), {
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
    global.update({ ...global, ...{ pageTitle: "Software Environments" } });
  }, []);

  useEffect(() => {
    refetch();
  }, [nameFilter, group, statusFilter]);

  const limit = process.env.LIMIT;
  const total =
    data && data.meta && data.meta.total_records ? data.meta.total_records : 0;
  const current_page =
    data && data.meta && data.meta.current_page ? data.meta.current_page : 1;

  return (
    <div>
      <h4>
        List of Software Environments{" "}
        <FontAwesomeIcon icon={["fas", "network-wired"]} fixedWidth />
      </h4>{" "}
      <pre>Environment Management functions.</pre>
      <div className="row">
        <div className="col-md-6">
          <h6>Filter by</h6>
          <InputV1 label="Name" value={nameFilter} setValue={setNameFilter} />
          {groupOptions ? (
            <SelectV1
              label="Group"
              values={groupOptions}
              value={group}
              setValue={setGroup}
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
            label="Create New Environment"
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
                  })}
                  <td width="250px" align="center">
                    <a
                      href={API_URL + "/v1/reports/environments/" + d.id}
                      target="_blank"
                      className="btn btn-outline-primary btn-sm mr-2"
                    >
                      Report
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
                      className="btn btn-outline-danger btn-sm"
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
      <CreateEnvironment
        show={showCreateGroup}
        setShow={setShowCreateGroup}
        refetch={refetch}
      />
      <UpdateEnvironment
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
    </div>
  );
}

Environments.getLayout = function getLayout(page) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};
