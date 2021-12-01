import React, { useState, useEffect, useRef } from "react";
import InputV1 from "../input/InputV1";
import TextareaV1 from "../input/TextareaV1";
import { Modal } from "react-bootstrap";
import Axios from "../../hooks/useApi";
import CheckboxV1 from "../input/CheckboxV1";
import SelectV1 from "../input/SelectV1";
import { useQuery } from "react-query";
import { useScore } from "../../hooks/useScore";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

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
  const { data } = await Axios.post("/v1/lessons/" + id, request);
  if (refetch !== null) {
    refetch();
  }
  return data;
}

function LessonsReport({ id, title, ref, show, setShow, refetch = null }) {
  const [report, setReport] = useState(
    "<h1>Lessons Learnt Report</h1><br/>Prepared by : .....<br/><br/><h3><strong>Problem Statement</strong></h3><p>.....<br/><br/></p><h3><strong>Steps to Fix</strong></h3><li>Step 1</li><li>Step 2</li><br/><br/><br/><br/><h3><strong>Links</strong></h3>"
  );

  const { data: actionHistory, refetch: refetchHistory } = useQuery(
    ["actionhistory" + id],
    () => getActionHistory(id),
    {
      staleTime: 10,
    }
  );

  const handleSubmitAction = (e) => {
    e.preventDefault();
    let request = {
      issue_id: id,
      title: title,
      ref: ref,
    };
    submitAction(id, request, refetch);
    setShow(false);
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

  const handleChange = (content, delta, source, editor) => {
    setReport(editor.getHTML());
  };

  if (issue) {
    return (
      <Modal
        show={show}
        fullscreen={true}
        onHide={() => setShow(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Lessons Learnt Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="row">
            <div className="col-md-6">
              <h6>Issue ID</h6>
              <p>
                {issue.issue_id.map((id) => (
                  <li>
                    {id.type} -{" "}
                    <a href={id.URL} target="_blank">
                      {id.ref}
                    </a>
                  </li>
                ))}
              </p>
              <p>
                Notes{" "}
                <QuillNoSSRWrapper
                  value={report}
                  theme="snow"
                  className="wysiwyg"
                  onChange={handleChange}
                />
              </p>
              <input
                className="btn btn-primary btn-sm mr-2"
                onClick={(e) => handleSubmitAction(e)}
                type="button"
                value="Save Report"
              />
            </div>
            <div className="col-md-6 action-history">
              <p className="text-primary">
                <sub>
                  History events are ordered according the descending order of
                  the performed date/time
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
        </Modal.Body>
      </Modal>
    );
  } else {
    return null;
  }
}

export default LessonsReport;
