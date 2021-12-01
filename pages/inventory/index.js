import React, { useEffect, useContext, useState } from "react";
import Layout from "../../layout";
import GlobalContext from "../../utils/GlobalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../../components/Pagination";
import InputV1 from "../../components/input/InputV1";
import { useQuery } from "react-query";
import qs from "qs";
import Axios from "../../hooks/useApi";
import ViewInventoryVarient from "../../components/forms/ViewInventoryVarients";

async function fetchInventoryItems(page = 1, requestParams = []) {
  const queryString = qs.stringify(requestParams);
  const { data } = await Axios.get(
    "/v1/inventory?page=" + page + "&" + queryString
  );
  return data;
}

const tdConfig = {
  index: { align: "right", width: "30px" },
  name: { align: "left" },
  code: { align: "center", width: "100px" },
  vendor: { align: "center" },
  contact: { align: "center", width: "100px" },
};
const headings = {
  index: "#",
  name: "Name",
  code: "CPE/Code",
  vendor: "Vendor",
  contact: "Contact",
};

export default function Inventory() {
  const global = useContext(GlobalContext);
  const [page, setPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [codeFilter, setCodeFilter] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [show, setShow] = useState(false);
  const [id, setId] = useState(null);

  const { status, data, error, isFetching, refetch } = useQuery(
    ["inventoryitems", page],
    () =>
      fetchInventoryItems(page, {
        name: nameFilter,
        code: codeFilter,
        vendor: vendorFilter,
      }),
    { keepPreviousData: false, staleTime: 5000 }
  );

  const viewInventoryVarientHandler = (id, e) => {
    e.preventDefault();
    setId(id);
    setShow(true);
  };

  useEffect(() => {
    global.update({ ...global, ...{ pageTitle: "Software Inventory" } });
  }, []);

  useEffect(() => {
    refetch();
  }, [nameFilter, codeFilter, vendorFilter]);

  const limit = process.env.LIMIT;
  const total =
    data && data.meta && data.meta.total_records ? data.meta.total_records : 0;
  const current_page =
    data && data.meta && data.meta.current_page ? data.meta.current_page : 1;

  return (
    <div>
      <h4>
        Software Inventory{" "}
        <FontAwesomeIcon icon={["fas", "users"]} fixedWidth />
      </h4>{" "}
      <pre>Inventory Query functions.</pre>
      <div className="row">
        <div className="col-md-6">
          <h6>Filter by</h6>
          <InputV1
            label="Software Name"
            value={nameFilter}
            setValue={setNameFilter}
          />
          <InputV1
            label="CPE / Code"
            value={codeFilter}
            setValue={setCodeFilter}
          />
          <InputV1
            label="Vendor Name"
            value={vendorFilter}
            setValue={setVendorFilter}
          />
        </div>
        {/* <div className="col-md-6">
                    <h6>Actions</h6>
                    <ButtonV1 onClick={createGroupHandler} label="Create New Group" shortcut="Ctrl + Shift + C" />
                </div> */}
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
                      href="#"
                      className="btn btn-outline-primary btn-sm"
                      onClick={(e) => {
                        viewInventoryVarientHandler(d.id, e);
                      }}
                    >
                      View Varients
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
        <ViewInventoryVarient
          id={id}
          show={show}
          setShow={setShow}
          refetch={refetch}
        />
      ) : null}
    </div>
  );
}

Inventory.getLayout = function getLayout(page) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};
