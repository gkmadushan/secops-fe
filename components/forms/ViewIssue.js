import React, { useState, useEffect, useRef } from "react";
import InputV1 from "../input/InputV1";
import TextareaV1 from "../input/TextareaV1";
import { Modal } from "react-bootstrap";
import Axios from "../../hooks/useApi";
import CheckboxV1 from "../input/CheckboxV1";
import SelectV1 from "../input/SelectV1";
import { useQuery } from "react-query";
import { useScore } from "../../hooks/useScore";
import ViewLessonsReport from "../forms/ViewLessonsReport";

async function getReport(id) {
  const { data } = await Axios.get("/v1/lessons/" + id);
  return data.data;
}

async function getIssue(id) {
  const { data } = await Axios.get("/v1/issues/" + id);
  return data.data;
}

async function getActionTypes() {
  const { data } = await Axios.get("/v1/action-types?limit=" + 100);
  return data.data;
}

async function getActionHistory(id) {
  const { data } = await Axios.get(
    "/v1/issue-actions?limit=" + 100 + "&issue_id=" + id
  );
  return data.data;
}

async function submitAction(id, request, refetch = null) {
  const { data } = await Axios.patch("/v1/issues/" + id, request);
  if (refetch !== null) {
    refetch();
  }
  return data;
}

function ViewIssue({ id, show, setShow, refetch = null, setShowReportView }) {
  const [note, setNote] = useState("");
  const [action, setAction] = useState("");
  const [showKb, setShowKb] = useState(false);

  const { data: actionHistory, refetch: refetchHistory } = useQuery(
    ["actionhistory" + id],
    () => getActionHistory(id),
    {
      staleTime: 10,
    }
  );

  const handleKbShow = (e) => {
    setShowKb(true);
  };

  const handleSubmitAction = (e) => {
    e.preventDefault();
    let request = {
      notes: note,
      action: action,
    };
    submitAction(id, request, refetch);
    setShow(false);
    const fixedAction = actionTypes.find((actionType) => {
      return actionType.code === "FIXED";
    });
    if (fixedAction.id === action) {
      setShowReportView(true);
    }
    setTimeout(() => refetchHistory(), 2000);
  };

  const { data: issue } = useQuery(["issues" + id], () => getIssue(id), {
    staleTime: 5000,
  });

  const { data: actionTypes } = useQuery(
    ["actiontypes"],
    () => getActionTypes(),
    {
      staleTime: 5000,
    }
  );

  if (issue) {
    return (
      <>
        <Modal
          show={show}
          fullscreen={true}
          onHide={() => setShow(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Issue {issue.title}{" "}
              {issue.remediation_script.length > 5 && (
                <span className="green-label">Automatic Fix Available</span>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="row">
              <div className="col-md-6">
                <h6>Last Updated</h6>
                <p>{new Date(issue.last_updated_at).toString()}</p>
                <h6>Detected on</h6>
                <p>{new Date(issue.detected_at).toString()}</p>
                {issue.resolved_at && (
                  <>
                    <h6>Resolved on</h6>
                    <p>{new Date(issue.resolved_at).toString()}</p>
                  </>
                )}
                {/* <h6>False Positive?</h6>
              <p>{issue.false_positive === 1 ? "Yes" : "No"}</p> */}
                <h6>Severity</h6>
                <p className={useScore(issue.score).color}>{issue.score}</p>
                <h6>References (CVE, CWE, OVAL references)</h6>
                <p>
                  {issue?.issue_id.map((id) => (
                    <li>
                      <a href={id.URL} target="_blank">
                        {id.type} - {id.ref}
                      </a>
                    </li>
                  ))}
                </p>
                <h6>Description</h6>
                <p>{issue.description}</p>
                <h6>Affected Resource</h6>
                <p>
                  <i>Environment</i>: {issue.environment.data.name} |{" "}
                  <i>Resource </i>: {issue.resource.data.name} (
                  {issue.resource.data.ipv6 +
                    " " +
                    issue.resource.data.ipv4 +
                    " / " +
                    issue.resource.data.os}
                  )
                </p>
                <hr />
                Action Type :{" "}
                <SelectV1
                  label="Action"
                  value={action}
                  setValue={setAction}
                  values={actionTypes}
                  required
                  nameField="name"
                  validationError="Group is required"
                />
                <p>
                  Notes
                  <textarea onChange={(e) => setNote(e.target.value)} rows={10}>
                    {note}
                  </textarea>
                </p>
                <input
                  className="btn btn-primary btn-sm mr-2"
                  onClick={(e) => handleSubmitAction(e)}
                  type="button"
                  value="Submit Action"
                />
              </div>
              <div className="col-md-6">
                <div className="p-2">
                  {issue.kb_ref && (
                    <p>
                      <a className="pointer" onClick={(e) => handleKbShow(e)}>
                        Click here to view Lesson learnt report
                      </a>
                    </p>
                  )}
                </div>
                <div className="action-history p-2">
                  <p className="text-primary">
                    <sub>
                      History events are ordered according the descending order
                      of the performed date/time
                    </sub>
                  </p>
                  <h6>Action History</h6>
                  {actionHistory &&
                    actionHistory.map((history, index) => (
                      <>
                        <i>{history.name}</i>
                        <br />
                        <label>
                          <sup>
                            user : {history.id} {history.created_at}
                          </sup>
                        </label>
                        <p>{history.notes}</p>
                        <hr />
                      </>
                    ))}
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {issue.kb_ref && (
          <ViewLessonsReport
            id={issue.kb_ref}
            show={showKb}
            setShow={setShowKb}
          />
        )}
      </>
    );
  } else {
    return null;
  }
}

export default ViewIssue;
