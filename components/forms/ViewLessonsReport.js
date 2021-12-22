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

async function getReport(id) {
  const { data } = await Axios.get("/v1/lessons/" + id);
  return data.data;
}

async function submitAction(id, request, refetch = null) {
  const { data } = await Axios.post("/v1/lessons", request);
  if (refetch !== null) {
    refetch();
  }
  return data;
}

function ViewLessonsReport({ id, show, setShow, refetch = null }) {
  const [report, setReport] = useState(
    "<h1>Lessons Learnt Report</h1><br/>Prepared by : .....<br/><br/><h3><strong>Problem Statement</strong></h3><p>.....<br/><br/></p><h3><strong>Steps to Fix</strong></h3><li>Step 1</li><li>Step 2</li><br/><br/><br/><br/><h3><strong>Links</strong></h3>"
  );
  const [titleState, setTitleState] = useState("");

  const { data: reportData, refetch: refetchReport } = useQuery(
    ["report" + id],
    () => getReport(id),
    {
      staleTime: 10,
    }
  );

  const handleChange = (content, delta, source, editor) => {
    setReport(editor.getHTML());
  };

  if (reportData) {
    return (
      <Modal
        show={show}
        fullscreen={false}
        onHide={() => setShow(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Lessons Learnt Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="row">
            <div className="col-md-12">
              <h6>Issue ID</h6>
              {/* <p>
                {issue.issue_id.map((id) => (
                  <li>
                    {id.type} -{" "}
                    <a href={id.URL} target="_blank">
                      {id.ref}
                    </a>
                  </li>
                ))}
              </p> */}
              <p>
                <InputV1
                  readonly
                  label="Title"
                  value={reportData.title}
                  setValue={setTitleState}
                />
              </p>
              <p>
                Notes{" "}
                <QuillNoSSRWrapper
                  value={reportData.description}
                  readOnly={true}
                  theme="snow"
                  className="wysiwyg"
                  onChange={handleChange}
                />
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  } else {
    return null;
  }
}

export default ViewLessonsReport;
