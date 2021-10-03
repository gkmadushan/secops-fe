import React, { useEffect, useContext, useState } from "react";
import Layout from "../../layout";
import GlobalContext from "../../utils/GlobalContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Pagination from "../../components/Pagination";
import InputV1 from "../../components/input/InputV1";
import ButtonV1 from "../../components/input/ButtonV1";
import { toast } from 'react-toastify';
import CreateUser from "../../components/forms/CreateUser";
import UpdateUser from "../../components/forms/UpdateUser";
import SelectV1 from "../../components/input/SelectV1";
import Confirm from "../../components/input/Confirm";
import Axios from '../../hooks/useApi';
import axios from "axios";
import { useQuery } from "react-query";

const tdConfig = { index: { align: 'right', width: '30px' }, active: { width: '23px', align: 'center' }, name: { align: 'left' }, registered_at: { align: 'center' }, role: { align: 'center', key: 'name' }, email: { align: 'left' } }
const headings = { index: '#', email: 'Email', active: "Active", role: 'Role', registered_at: 'Registered Date/Time', name: "Name" }

async function fetchUsers(page = 1, username = null, role = null, group = null) {
  const { data } = await Axios.get('user-service/v1/users?page=' + page)
  return data;
}

async function deleteUser(id, callback) {
  const { data } = await Axios.delete('user-service/v1/users/' + id)
  callback();
  return data;
}

async function getGroups() {
  const { data } = await Axios.get('user-service/v1/groups?limit=' + 100);
  return data.data;
}

async function getRoles() {
  const { data } = await Axios.get('user-service/v1/roles?limit=' + 100);
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

  const { status, data, error, isFetching, isPreviousData, refetch } = useQuery(
    ['users', page],
    () => fetchUsers(page),
    { keepPreviousData: false, staleTime: 5000 }
  )

  const { data: groupOptions } = useQuery(
    ['groups'],
    () => getGroups(),
    { staleTime: 5000 }
  )

  const { data: roleOptions } = useQuery(
    ['roles'],
    () => getRoles(),
    { staleTime: 5000 }
  )

  const createUserHandler = () => {
    setShowCreate(true);
  }

  const updateGroupHandler = (id) => {
    setUpdateId(id);
    setShowUpdate(true);
  }

  const deleteUserHandler = (id) => {
    setDeleteId(id);
    setShowDeleteConfirmation(true);
  }

  const deleteUserCallback = () => {
    toast.promise(deleteUser(deleteId, refetch), {
      pending: 'Processing',
      success: { render({ data }) { return `Success ${data}` } },
      error: 'Error'
    });
    setShowDeleteConfirmation(false);
  }

  useEffect(() => {
    global.update({ ...global, ...{ pageTitle: "Users" } });
  }, []);

  useEffect(() => {
    if (data && data.meta && data.meta.current_page && (data.meta.current_page > data.meta.num_pages)) {
      setPage(data.meta.num_pages);
    }
  }, [data, page]);

  useEffect(() => {
    refetch();
  }, [role, group, usernameFilter]);

  return (
    <div>
      <h4>List of Users <FontAwesomeIcon icon={['fas', 'user']} fixedWidth /></h4> <pre>User Management functions.</pre>

      <div className="row">
        <div className="col-md-6">
          <h6>Filter by</h6>
          <InputV1 label="User Name" shortcut="Ctrl + Shift + F" value={usernameFilter} setValue={setUsernameFilter} />
          {roleOptions ?
            <SelectV1 label="Role" value={role} setValue={setRole} values={roleOptions} setValue={setRole} /> : null}
          {groupOptions ?
            <SelectV1 label="Group" values={groupOptions} value={group} setValue={setGroup} /> : null}
        </div>
        <div className="col-md-6">
          <h6>Actions</h6>
          <ButtonV1 onClick={createUserHandler} label="Register User" shortcut="Ctrl + Shift + C" />
        </div>
      </div>
      <table className="table table-hover table-bordered">
        <caption>List of groups</caption>
        <thead>
          <tr key="heading">
            {Object.keys(headings).map((key) => {
              return <th key={key} className="text-center">{headings[key]}</th>
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
                    return <td key={dataIndex + "_" + key} width={tdConfig[key] ? tdConfig[key].width : null} align={tdConfig[key] ? tdConfig[key].align : null}>{typeof d[key] === 'object' ? d[key][tdConfig[key]['key']] : d[key]}</td>
                  })}
                  <td width="250px" align="center">
                    <a href="#" className="btn btn-outline-primary btn-sm">Password Reset</a>&nbsp;
                    <a href="#" className="btn btn-outline-primary btn-sm" onClick={() => { updateGroupHandler(dataIndex) }}>Edit</a>&nbsp;
                    <a className="btn btn-outline-danger btn-sm" onClick={() => { deleteUserHandler(d.id) }}>Delete</a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        ) : null}

        {!isFetching && !data ? (
          <tbody>
            <tr key="noresults">
              <td align="center" className="display-6" colSpan={Object.keys(headings).length + 1}>No Results</td>
            </tr>
          </tbody>
        ) : null}
      </table>

      {isFetching ? (
        <div className="text-center"><FontAwesomeIcon icon={['fas', 'circle-notch']} spin size="5x" /></div>
      ) : null}

      {data && data.meta && data.meta.num_pages > 0 ? (
        <Pagination num_pages={data.meta.num_pages} current_page={page} setPage={setPage} />
      ) : null}

      <CreateUser show={showCreate} setShow={setShowCreate} refetch={refetch} />
      {/* <UpdateUser id={updateId} show={showUpdate} setShow={setShowUpdate} data={sampleData} /> */}
      <Confirm show={showDeleteConfirmation} setShow={setShowDeleteConfirmation} callback={deleteUserCallback} />
    </div>
  )
}

Users.getLayout = function getLayout(page) {
  return (
    <>
      <Layout>
        {page}
      </Layout>
    </>
  )
}
