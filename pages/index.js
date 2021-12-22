import React, { useContext, useEffect } from "react";
import BarChart from "../components/charts/BarChart";
import Layout from "../layout";
import GlobalContext from "../utils/GlobalContext";
import { useQuery } from "react-query";
import Axios from "../hooks/useApi";

// const data = [
//   { year: 1980, efficiency: 24.3, sales: 8949000 },
//   { year: 1985, efficiency: 27.6, sales: 10979000 },
//   { year: 1990, efficiency: 28, sales: 9303000 },
// ];

async function fetchIssueSummaryDiagram() {
  const data = await Axios.get("/v1/issues/graphs");
  return data;
}

async function fetchScanSummaryDiagram() {
  const data = await Axios.get("/v1/scans/graphs");
  return data;
}

export default function Home() {
  const global = useContext(GlobalContext);

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
    // fetchIssueSummaryDiagram();
  }, []);

  return (
    <div className="row">
      {issueSummaryDiagram &&
        issueSummaryDiagram.data.map((diagram) => (
          <div className="col-md-5">
            <img src={"data:image/svg+xml;base64," + diagram} />
          </div>
        ))}
      {scanSummaryDiagram &&
        scanSummaryDiagram.data.map((diagram) => (
          <div className="col-md-10">
            <img src={"data:image/svg+xml;base64," + diagram} />
          </div>
        ))}
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
