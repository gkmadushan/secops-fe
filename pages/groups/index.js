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

const sampleData = [
  { index: 1, name: "Group 1", description: "Test Description", num_users: 3, num_envs: 1 },
  { index: 2, name: "Group 2", description: "Test Description", num_users: 1, num_envs: 0 },
  { index: 3, name: "Group 3", description: "Test Description", num_users: 0, num_envs: 0 },
  { index: 3, name: "Group 4", description: "Test Description", num_users: 0, num_envs: 0 },
  { index: 3, name: "Group 5", description: "Test Description", num_users: 0, num_envs: 0 },
  { index: 3, name: "Group 6", description: "Test Description", num_users: 0, num_envs: 0 },
  { index: 3, name: "Group 7", description: "Test Description", num_users: 0, num_envs: 0 },
  { index: 3, name: "Group 8", description: "Test Description", num_users: 0, num_envs: 0 },
  { index: 3, name: "Group 9", description: "Test Description", num_users: 0, num_envs: 0 },
  { index: 3, name: "Group 10", description: "Test Description", num_users: 0, num_envs: 0 },
]

const tdConfig = { index: { align: 'right', width: '30px' }, name: { align: 'left' }, num_users: { align: 'center', width: '50px' }, num_envs: { align: 'center', width: '50px' } }
const headings = { index: '#', name: 'Name', num_users: 'Number of Users', num_envs: 'Number of Environments' }

export default function Groups() {
  const global = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showUpdateGroup, setShowUpdateGroup] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  const createGroupHandler = () => {
    setShowCreateGroup(true);
  }

  const updateGroupHandler = (id) => {
    setUpdateId(id);
    setShowUpdateGroup(true);
  }

  const resolveAfter3Sec = new Promise(resolve => setTimeout(() => resolve("world"), 3000));
  const notify = () => toast.promise(resolveAfter3Sec, {
    pending: 'Processing',
    success: { render({ data }) { return `Success ${data}` } },
    error: 'Error'
  });

  useEffect(() => {
    global.update({ ...global, ...{ pageTitle: "Groups" } });

    //Testing only
    setTimeout(() => {
      setLoading(false);
      setData(sampleData);
      setPagination(true);
    }, 5000);
  }, []);

  return (
    <div>
      <h4>List of Groups <FontAwesomeIcon icon={['fas', 'users']} fixedWidth /></h4> <pre>Group Management functions.</pre>
      <div className="row">
        <div className="col-md-6">
          <h6>Filter by</h6>
          <InputV1 label="Group Name" shortcut="Ctrl + Shift + F" />
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
        {data ? (
          <tbody>
            {data.map((d, dataIndex) => {
              return (
                <tr key={dataIndex}>
                  {Object.keys(d).map((key) => {
                    return <td key={dataIndex + "_" + key} width={tdConfig[key] ? tdConfig[key].width : null} align={tdConfig[key] ? tdConfig[key].align : null}>{d[key]}</td>
                  })}
                  <td width="200px" align="center">
                    <a href="#" className="btn btn-outline-primary btn-sm" onClick={() => { updateGroupHandler(dataIndex) }}>Edit</a>&nbsp;
                    <a href="#" className="btn btn-outline-danger btn-sm">Delete</a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        ) : null}

        {!loading && !data ? (
          <tbody>
            <tr key="noresults">
              <td align="center" className="display-6" colSpan={Object.keys(headings).length + 1}>No Results</td>
            </tr>
          </tbody>
        ) : null}
      </table>

      {loading ? (
        <div className="text-center"><FontAwesomeIcon icon={['fas', 'circle-notch']} spin size="5x" /></div>
      ) : null}

      {pagination ? (
        <Pagination />
      ) : null}

      <button onClick={notify}>Notify!</button>
      <CreateGroup show={showCreateGroup} setShow={setShowCreateGroup} />
      <UpdateGroup id={updateId} show={showUpdateGroup} setShow={setShowUpdateGroup} data={sampleData} />
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
