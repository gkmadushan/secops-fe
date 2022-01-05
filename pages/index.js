import React, { useContext, useEffect, useState } from "react";
import BarChart from "../components/charts/BarChart";
import Layout from "../layout";
import GlobalContext from "../utils/GlobalContext";
import { useQuery } from "react-query";
import Axios from "../hooks/useApi";
import Severity from "../components/common/Severity";

async function fetchIssueSummaryDiagram() {
  const data = await Axios.get("/v1/issues/graphs");
  return data;
}

async function fetchScanSummaryDiagram() {
  const data = await Axios.get("/v1/scans/graphs");
  return data;
}

async function fetchCve() {
  const data = await Axios.get("/v1/cve");
  return data;
}

export default function Home() {
  const global = useContext(GlobalContext);

  const { data: cveData } = useQuery(["cve"], () => fetchCve(), {
    staleTime: 5000,
  });

  const { data: issueSummaryDiagram } = useQuery(
    ["issue-summary-diagram"],
    () => fetchIssueSummaryDiagram(),
    { staleTime: 5000 }
  );

  const { data: scanSummaryDiagram } = useQuery(
    ["scan-summary-diagram"],
    () => fetchScanSummaryDiagram(),
    { staleTime: 5000 }
  );

  useEffect(() => {
    global.update({ ...global, ...{ pageTitle: "Dashboard" } });
  }, []);

  return (
    // <div className="row">
    //   {issueSummaryDiagram &&
    //     issueSummaryDiagram.data &&
    //     issueSummaryDiagram.data.map((diagram) => (
    //       <div className="col-md-5">
    //         <img src={"data:image/svg+xml;base64," + diagram} />
    //       </div>
    //     ))}
    //   {scanSummaryDiagram &&
    //     scanSummaryDiagram?.data?.map((diagram) => (
    //       <div className="col-md-10">
    //         <img src={"data:image/svg+xml;base64," + diagram} />
    //       </div>
    //     ))}
    // </div>
    <div class="timeline">
      {cveData?.data?.data?.map((cve, index) => (
        <div
          class={["container-tl ", index % 2 == 0 ? "left" : "right"].join(" ")}
        >
          <div class="content">
            <h2>{cve.publish_date}</h2>
            {cve?.list?.map((cveInfo) => (
              <>
                <h6>
                  {cveInfo.cve} <Severity score={cveInfo.score} />
                </h6>
                <p>{cveInfo.description}</p>
                <p>
                  <a href={cveInfo.url} target="_blank">
                    {cveInfo.url}
                  </a>
                </p>
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
