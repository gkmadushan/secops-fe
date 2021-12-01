import React, { useEffect, useContext, useState } from "react";
import Layout from "../../layout";
import GlobalContext from "../../utils/GlobalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../../components/Pagination";
import InputV1 from "../../components/input/InputV1";
import ButtonV1 from "../../components/input/ButtonV1";
import { toast } from "react-toastify";
import CreateUser from "../../components/forms/CreateUser";
import UpdateUser from "../../components/forms/UpdateUser";
import SelectV1 from "../../components/input/SelectV1";
import Confirm from "../../components/input/Confirm";
import Axios from "../../hooks/useApi";
import { useQuery } from "react-query";
import qs from "qs";

const tdConfig = {
  index: { align: "right", width: "30px" },
  active: { width: "23px", align: "center" },
  name: { align: "left" },
  created_at: { align: "center" },
  role: { align: "center", key: "name" },
  email: { align: "left" },
};
const headings = {
  index: "#",
  email: "Email",
  active: "Active",
  role: "Role",
  created_at: "Registered Date/Time",
  name: "Name",
};

async function fetchUsers(page = 1, requestParams = []) {
  const queryString = qs.stringify(requestParams);
  const { data } = await Axios.get(
    "/v1/users?page=" + page + "&" + queryString
  );
  return data;
}

async function deleteUser(id, callback) {
  const { data } = await Axios.delete("/v1/users/" + id);
  callback();
  return data;
}

async function sendPasswordRecoveryEmail(id) {
  const { data } = await Axios.post("/v1/users/" + id + "/reset-password");
  return data;
}

async function getGroups() {
  const { data } = await Axios.get("/v1/groups?limit=" + 100);
  return data.data;
}

async function getRoles() {
  const { data } = await Axios.get("/v1/roles?limit=" + 100);
  return data.data;
}

export default function Users() {
  const global = useContext(GlobalContext);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const [group, setGroup] = useState(null);
  const [role, setRole] = useState(null);
  const [usernameFilter, setUsernameFilter] = useState("");

  const { status, data, error, isFetching, refetch } = useQuery(
    ["users", page],
    () => fetchUsers(page, { email: usernameFilter, role: role, group: group }),
    { keepPreviousData: false, staleTime: 5000 }
  );

  const { data: groupOptions } = useQuery(["groups"], () => getGroups(), {
    staleTime: 5000,
  });

  const { data: roleOptions } = useQuery(["roles"], () => getRoles(), {
    staleTime: 5000,
  });

  const createUserHandler = () => {
    setShowCreate(true);
  };

  const updateUserHandler = (e, id) => {
    e.preventDefault();
    setUpdateId(id);
    setShowUpdate(true);
  };

  const deleteUserHandler = (id) => {
    setDeleteId(id);
    setShowDeleteConfirmation(true);
  };

  const deleteUserCallback = () => {
    toast.promise(deleteUser(deleteId, refetch), {
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

  const handleSendPasswordReset = (e, id) => {
    e.preventDefault();
    toast.promise(sendPasswordRecoveryEmail(id), {
      pending: "Processing",
      success: {
        render({ data }) {
          return `Password recovery email sent`;
        },
      },
      error: "Unable to send password recovery email",
    });
  };

  useEffect(() => {
    global.update({ ...global, ...{ pageTitle: "Users" } });
  }, []);

  useEffect(() => {
    refetch();
  }, [role, group, usernameFilter]);

  const limit = process.env.LIMIT;
  const total =
    data && data.meta && data.meta.total_records ? data.meta.total_records : 0;
  const current_page =
    data && data.meta && data.meta.current_page ? data.meta.current_page : 1;

  return (
    <div>
      <h4>
        List of Users <FontAwesomeIcon icon={["fas", "user"]} fixedWidth />
      </h4>{" "}
      <pre>User Management functions.</pre>
      <div className="row">
        <div className="col-md-6">
          <h6>Filter by</h6>
          <InputV1
            label="User Name"
            value={usernameFilter}
            setValue={setUsernameFilter}
          />
          {roleOptions ? (
            <SelectV1
              label="Role"
              value={role}
              setValue={setRole}
              values={roleOptions}
              setValue={setRole}
            />
          ) : null}
          {groupOptions ? (
            <SelectV1
              label="Group"
              values={groupOptions}
              value={group}
              setValue={setGroup}
            />
          ) : null}
        </div>
        <div className="col-md-6">
          <h6>Actions</h6>
          <ButtonV1
            onClick={createUserHandler}
            label="Register User"
            shortcut="Ctrl + Shift + C"
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
                        handleSendPasswordReset(e, d.id);
                      }}
                    >
                      Password Reset
                    </a>
                    &nbsp;
                    <a
                      href="#"
                      className="btn btn-outline-primary btn-sm"
                      onClick={(e) => {
                        updateUserHandler(e, d.id);
                      }}
                    >
                      Edit
                    </a>
                    &nbsp;
                    <a
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        deleteUserHandler(d.id);
                      }}
                    >
                      Delete
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
      <CreateUser show={showCreate} setShow={setShowCreate} refetch={refetch} />
      <UpdateUser
        id={updateId}
        show={showUpdate}
        setShow={setShowUpdate}
        refetch={refetch}
      />
      <Confirm
        show={showDeleteConfirmation}
        setShow={setShowDeleteConfirmation}
        callback={deleteUserCallback}
      />
    </div>
  );
}

Users.getLayout = function getLayout(page) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};
