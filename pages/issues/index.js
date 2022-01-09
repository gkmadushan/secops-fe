import React, { useEffect, useContext, useState } from "react";
import Layout from "../../layout";
import GlobalContext from "../../utils/GlobalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../../components/Pagination";
import InputV1 from "../../components/input/InputV1";
import { useQuery } from "react-query";
import qs from "qs";
import Axios from "../../hooks/useApi";
import ViewIssue from "../../components/forms/ViewIssue";
import SelectV1 from "../../components/input/SelectV1";
import LessonsReport from "../../components/forms/LessonsReport";

async function fetchIssues(page = 1, requestParams = []) {
  const queryString = qs.stringify(requestParams);
  const { data } = await Axios.get(
    "/v1/issues?page=" + page + "&" + queryString
  );
  return data;
}

async function getResources() {
  const { data } = await Axios.get("/v1/resources?limit=" + 100);
  return data.data;
}

async function getStatusOptions() {
  const { data } = await Axios.get("/v1/issue-status?limit=" + 100);
  return data.data;
}

const tdConfig = {
  index: { align: "right", width: "30px" },
  title: { align: "left" },
  score: { align: "center", width: "100px" },
  detected_at: { align: "center" },
  false_positive: { align: "center", width: "100px", boolean: true },
  resolved_at: { align: "center", width: "100px" },
  issue_status: { align: "center" },
};
const headings = {
  index: "#",
  title: "Title",
  score: "Severity",
  //   cve: "CVE Number",
  detected_at: "Detected Date/Time",
  false_positive: "False Positive",
  resolved_at: "Resolved Date/Time",
  resource: "Resource",
  issue_status: "Issue Status",
};

export default function Issues() {
  const global = useContext(GlobalContext);
  const [page, setPage] = useState(1);
  const [titleFilter, setTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    "63a7d8d8-7fb7-476a-9354-1dff769b7a0f"
  );
  const [vendorFilter, setVendorFilter] = useState("");
  const [resourceFilter, setResourceFilter] = useState(null);
  const [issueIdFilter, setIssueIdFilter] = useState(null);
  const [falsePositiveFilter, setFalsePositiveFilter] = useState(null);
  const [scriptAvailableFilter, setScriptAvailableFilter] = useState(null);
  const [detectedAtFromFilter, setDetectedAtFromFilter] = useState("");
  const [detectedAtToFilter, setDetectedAtToFilter] = useState("");
  const [resolvedAtFromFilter, setResolvedAtFromFilter] = useState("");
  const [resolvedAtToFilter, setResolvedAtToFilter] = useState("");
  const [show, setShow] = useState(false);
  const [id, setId] = useState(null);
  const [showReportView, setShowReportView] = useState(false);

  const { status, data, error, isFetching, refetch } = useQuery(
    ["inventoryitems", page],
    () =>
      fetchIssues(page, {
        title: titleFilter,
        resource: resourceFilter,
        issue_status: statusFilter,
        issue_id: issueIdFilter,
        script_available: scriptAvailableFilter,
        false_positive: falsePositiveFilter,
        detected_at_from: detectedAtFromFilter,
        detected_at_to: detectedAtToFilter,
        resolved_at_from: resolvedAtFromFilter,
        resolved_at_to: resolvedAtToFilter,
      }),
    { keepPreviousData: false, staleTime: 5000 }
  );

  const { data: resourceOptions } = useQuery(
    ["resources"],
    () => getResources(),
    { staleTime: 5000 }
  );

  const { data: statusOptions } = useQuery(
    ["issue-status"],
    () => getStatusOptions(),
    { staleTime: 5000 }
  );

  const viewIssueHandler = (id, e) => {
    e.preventDefault();
    setId(id);
    setShow(true);
  };

  useEffect(() => {
    global.update({ ...global, ...{ pageTitle: "Issues" } });
  }, []);

  useEffect(() => {
    refetch();
  }, [
    titleFilter,
    resourceFilter,
    statusFilter,
    scriptAvailableFilter,
    falsePositiveFilter,
    detectedAtFromFilter,
    detectedAtToFilter,
    resolvedAtFromFilter,
    resolvedAtToFilter,
  ]);

  const limit = process.env.LIMIT;
  const total =
    data && data.meta && data.meta.total_records ? data.meta.total_records : 0;
  const current_page =
    data && data.meta && data.meta.current_page ? data.meta.current_page : 1;

  return (
    <div>
      <h4>
        Issues <FontAwesomeIcon icon={["fas", "users"]} fixedWidth />
      </h4>{" "}
      <pre>Issue Query functions.</pre>
      <div className="row">
        <div className="col-md-6">
          <h6>Filter by</h6>
          <InputV1
            label="Title"
            value={titleFilter}
            setValue={setTitleFilter}
          />
          {resourceOptions ? (
            <SelectV1
              label="Resource"
              values={resourceOptions}
              value={resourceFilter}
              setValue={setResourceFilter}
            />
          ) : null}
          {statusOptions ? (
            <SelectV1
              label="Status"
              values={statusOptions}
              value={statusFilter}
              setValue={setStatusFilter}
            />
          ) : null}
          <SelectV1
            label="Script Available"
            values={[
              { id: "0", name: "Not Available" },
              { id: "1", name: "Available" },
            ]}
            value={scriptAvailableFilter}
            setValue={setScriptAvailableFilter}
          />
          <SelectV1
            label="False Positive"
            values={[
              { id: "0", name: "No" },
              { id: "1", name: "Yes" },
            ]}
            value={falsePositiveFilter}
            setValue={setFalsePositiveFilter}
          />
        </div>
        <div className="col-md-6">
          <h6>&nbsp;</h6>
          <InputV1
            type="date"
            label="Detected Date (From)"
            value={detectedAtFromFilter}
            setValue={setDetectedAtFromFilter}
          />
          <InputV1
            type="date"
            label="Detected Date (To)"
            value={detectedAtToFilter}
            setValue={setDetectedAtToFilter}
          />
          <InputV1
            type="date"
            label="Resolved Date (From)"
            value={resolvedAtFromFilter}
            setValue={setResolvedAtFromFilter}
          />
          <InputV1
            type="date"
            label="Resolved Date (To)"
            value={resolvedAtToFilter}
            setValue={setResolvedAtToFilter}
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
                        {tdConfig[key] && tdConfig[key]["boolean"] == true
                          ? d[key] === 1
                            ? "Yes"
                            : "No"
                          : d[key]}
                      </td>
                    );
                  })}
                  <td width="250px" align="center">
                    <a
                      href="#"
                      className="btn btn-outline-primary btn-sm mr-2"
                      onClick={(e) => {
                        viewIssueHandler(d.id, e);
                      }}
                    >
                      View
                    </a>
                    &nbsp;
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
      {id ? (
        <ViewIssue
          id={id}
          show={show}
          setShow={setShow}
          refetch={refetch}
          setShowReportView={setShowReportView}
        />
      ) : null}
      <LessonsReport
        id={id}
        show={showReportView}
        setShow={setShowReportView}
      />
    </div>
  );
}

Issues.getLayout = function getLayout(page) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};
