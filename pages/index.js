import React, { useContext, useEffect } from "react";
import BarChart from "../components/charts/BarChart";
import Layout from "../layout";
import GlobalContext from "../utils/GlobalContext";

const data = [
  { year: 1980, efficiency: 24.3, sales: 8949000 },
  { year: 1985, efficiency: 27.6, sales: 10979000 },
  { year: 1990, efficiency: 28, sales: 9303000 },
]

export default function Home() {
  const global = useContext(GlobalContext);

  useEffect(() => {
    global.update({ ...global, ...{ pageTitle: "Dashboard" } });
  }, [])

  return (
    <div>
      <BarChart data={data} />
    </div>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <>
      <Layout>
        {page}
      </Layout>
    </>
  )
}