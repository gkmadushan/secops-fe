import React, { useEffect, useContext, useState } from "react";
import Layout from "../../layout";
import GlobalContext from "../../utils/GlobalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../../components/Pagination";
import InputV1 from "../../components/input/InputV1";
import ButtonV1 from "../../components/input/ButtonV1";
import { toast } from "react-toastify";
import CreateGroup from "../../components/forms/CreateGroup";
import UpdateGroup from "../../components/forms/UpdateGroup";
import { useQuery } from "react-query";
import qs from "qs";
import Axios from "../../hooks/useApi";
import Confirm from "../../components/input/Confirm";

async function fetch(page = 1, requestParams = []) {
  const queryString = qs.stringify(requestParams);
  const { data } = await Axios.get(
    "/v1/lessons?page=" + page + "&" + queryString
  );
  return data;
}

const tdConfig = {
  index: { align: "right", width: "30px" },
  title: { align: "left" },
};
const headings = {
  index: "#",
  title: "Title",
};

export default function KnowledgeBase() {
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

  const { status, data, error, isFetching, refetch } = useQuery(
    ["kb", page],
    () => fetch(page, { ref: nameFilter }),
    { keepPreviousData: false, staleTime: 5000 }
  );

  useEffect(() => {
    global.update({ ...global, ...{ pageTitle: "Lessons Learnt Reports" } });
  }, []);

  const limit = process.env.LIMIT;
  const total =
    data && data.meta && data.meta.total_records ? data.meta.total_records : 0;
  const current_page =
    data && data.meta && data.meta.current_page ? data.meta.current_page : 1;

  console.log(data);

  return (
    <div>
      <h4>
        List of Lessons Learnt Report
        <FontAwesomeIcon icon={["fas", "university"]} fixedWidth />
      </h4>
      <pre>Lessons Learnt Reports.</pre>
      <div className="row">
        <div className="col-md-6">
          <h6>Filter by</h6>
          <InputV1
            label="Reference ID"
            value={nameFilter}
            setValue={setNameFilter}
          />
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
                    console.log("DEBUG", headings);
                    return (
                      <td
                        key={dataIndex + "_" + key}
                        width={tdConfig[key] ? tdConfig[key].width : null}
                        align={tdConfig[key] ? tdConfig[key].align : null}
                      >
                        {d[key]}
                      </td>
                    );
                  })}
                  <td width="250px" align="center"></td>
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
      {/* <UpdateGroup
        id={updateId}
        show={showUpdate}
        setShow={setShowUpdate}
        refetch={refetch}
      /> */}
    </div>
  );
}

KnowledgeBase.getLayout = function getLayout(page) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};
