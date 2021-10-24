import React, { useEffect, useContext, useState } from "react";
import Layout from "../../layout";
import GlobalContext from "../../utils/GlobalContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Pagination from "../../components/Pagination";
import InputV1 from "../../components/input/InputV1";
import ButtonV1 from "../../components/input/ButtonV1";
import { toast } from 'react-toastify';
import CreateGroup from "../../components/forms/CreateGroup";
import UpdateGroup from "../../components/forms/UpdateGroup";
import { useQuery } from "react-query";
import qs from 'qs';
import Axios from '../../hooks/useApi';
import Confirm from "../../components/input/Confirm";

async function fetchGroups(page = 1, requestParams = []) {
  const queryString = qs.stringify(requestParams);
  const { data } = await Axios.get('/v1/groups?page=' + page + '&' + queryString)
  return data;
}

async function deleteGroup(id, callback) {
  const { data } = await Axios.delete('/v1/groups/' + id)
  callback();
  return data;
}


const tdConfig = { index: { align: 'right', width: '30px' }, name: { align: 'left' }, num_users: { align: 'center', width: '50px' }, num_envs: { align: 'center', width: '50px' } }
const headings = { index: '#', name: 'Name', num_users: 'Number of Users', num_envs: 'Number of Environments' }

export default function Groups() {
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
    ['users', page],
    () => fetchGroups(page, { "group": nameFilter }),
    { keepPreviousData: false, staleTime: 5000 }
  )


  const createGroupHandler = () => {
    setShowCreateGroup(true);
  }

  const updateGroupHandler = (e, id) => {
    e.preventDefault();
    setUpdateId(id);
    setShowUpdate(true);
  }

  const deleteGroupHandler = (id) => {
    setDeleteId(id);
    setShowDeleteConfirmation(true);
  }

  const deleteGroupCallback = () => {
    toast.promise(deleteGroup(deleteId, refetch), {
      pending: 'Processing',
      success: { render({ data }) { return `Success ${data}` } },
      error: 'Error'
    });
    setShowDeleteConfirmation(false);
  }

  useEffect(() => {
    global.update({ ...global, ...{ pageTitle: "Groups" } });
  }, []);

  useEffect(() => {
    refetch();
  }, [nameFilter]);

  return (
    <div>
      <h4>List of Groups <FontAwesomeIcon icon={['fas', 'users']} fixedWidth /></h4> <pre>Group Management functions.</pre>
      <div className="row">
        <div className="col-md-6">
          <h6>Filter by</h6>
          <InputV1 label="Group Name" value={nameFilter} setValue={setNameFilter} />
        </div>
        <div className="col-md-6">
          <h6>Actions</h6>
          <ButtonV1 onClick={createGroupHandler} label="Create New Group" shortcut="Ctrl + Shift + C" />
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
                    <a href="#" className="btn btn-outline-primary btn-sm" onClick={(e) => { updateGroupHandler(e, d.id) }}>Edit</a>&nbsp;
                    <a className="btn btn-outline-danger btn-sm" onClick={() => { deleteGroupHandler(d.id) }}>Delete</a>
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

      <CreateGroup show={showCreateGroup} setShow={setShowCreateGroup} refetch={refetch} />
      <UpdateGroup id={updateId} show={showUpdate} setShow={setShowUpdate} refetch={refetch} />
      <Confirm show={showDeleteConfirmation} setShow={setShowDeleteConfirmation} callback={deleteGroupCallback} />
    </div>
  )
}

Groups.getLayout = function getLayout(page) {
  return (
    <>
      <Layout>
        {page}
      </Layout>
    </>
  )
}
