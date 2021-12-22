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

async function getEnvironments() {
  const { data } = await Axios.get("/v1/environments?limit=" + 100);
  return data.data;
}

async function deleteEnvironment(id, callback) {
  const { data } = await Axios.delete("/v1/environments/" + id);
  callback();
  return data;
}

async function fetchScans(page = 1, requestParams = []) {
  const queryString = qs.stringify(requestParams);
  const { data } = await Axios.get(
    "/v1/reports?page=" + page + "&" + queryString
  );
  return data;
}

const tdConfig = {
  index: { align: "right", width: "30px" },
  environment: { align: "left" },
  resource: { align: "center" },
  ipv4: { align: "left", width: "80px" },
  ipv6: { align: "left", width: "80px" },
  os: { align: "center", width: "80px" },
  issues: { align: "center", width: "80px" },
};
const headings = {
  index: "#",
  environment: "Environment",
  resource: "Resource Name",
  ipv4: "IPV4",
  ipv6: "IPV6",
  os: "Operating System",
  issues: "Issue Count",
};

export default function Scans() {
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
  const [environment, setEnvironment] = useState(null);
  const [resource, setResource] = useState(null);

  const { data: environmentOptions } = useQuery(
    ["environments"],
    () => getEnvironments(),
    { staleTime: 5000 }
  );

  const { status, data, error, isFetching, refetch } = useQuery(
    ["scans", page],
    () =>
      fetchScans(page, {
        environment: environment,
        resource: resource,
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
    global.update({ ...global, ...{ pageTitle: "Scan Reports" } });
  }, []);

  useEffect(() => {
    refetch();
  }, [environment]);

  const limit = process.env.LIMIT;
  const total =
    data && data.meta && data.meta.total_records ? data.meta.total_records : 0;
  const current_page =
    data && data.meta && data.meta.current_page ? data.meta.current_page : 1;

  return (
    <div>
      <h4>
        List of Scan Reports{" "}
        <FontAwesomeIcon icon={["fas", "network-wired"]} fixedWidth />
      </h4>{" "}
      <pre>Scan report export functions.</pre>
      <div className="row">
        <div className="col-md-6">
          <h6>Filter by</h6>
          {environmentOptions ? (
            <SelectV1
              label="Environment"
              values={environmentOptions}
              value={environment}
              setValue={setEnvironment}
            />
          ) : null}
        </div>
        <div className="col-md-6"></div>
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
                      href={API_URL + "/v1/reports/scans/" + d.id}
                      target="_blank"
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Report
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
    </div>
  );
}

Scans.getLayout = function getLayout(page) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};
