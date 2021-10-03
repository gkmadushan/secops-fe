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
import CheckboxV1 from "../../components/input/CheckboxV1";

const sampleData = [
  { index: 1, email: "test1@test.com", active: "Yes", role: { name: "Administrator" }, registered_at: "2021-09-04 12:32", name: "User 1" },
  { index: 2, email: "test2@test.com", active: "Yes", role: { name: "DevOps" }, registered_at: "2021-09-03 12:32", name: "User 2" },
  { index: 3, email: "test3@test.com", active: "Yes", role: { name: "DevOps" }, registered_at: "2021-09-02 10:12", name: "User 3" },
  { index: 4, email: "test4@test.com", active: "Yes", role: { name: "Security" }, registered_at: "2021-09-04 15:01", name: "User 4" },
  { index: 5, email: "test5@test.com", active: "Yes", role: { name: "Security" }, registered_at: "2021-09-03 12:04", name: "User 5" },
  { index: 6, email: "test6@test.com", active: "Yes", role: { name: "Security" }, registered_at: "2021-09-01 12:41", name: "User 6" },
  { index: 7, email: "test7@test.com", active: "Yes", role: { name: "Manager" }, registered_at: "2021-09-02 13:32", name: "User 7" },
  { index: 8, email: "test8@test.com", active: "Yes", role: { name: "Manager" }, registered_at: "2021-09-02 09:32", name: "User 8" },
  { index: 9, email: "test9@test.com", active: "Yes", role: { name: "DevOps" }, registered_at: "2021-09-04 09:32", name: "User 9" },
  { index: 10, email: "test10@test.com", active: "Yes", role: { name: "DevOps" }, registered_at: "2021-09-04 10:42", name: "User 10" },
]

const tdConfig = { index: { align: 'right', width: '30px' }, active: { width: '23px', align: 'center' }, name: { align: 'left' }, registered_at: { align: 'center' }, role: { align: 'center', key: 'name' }, email: { align: 'left' } }
const headings = { index: '#', email: 'Email', active: "Active", role: 'Role', registered_at: 'Registered Date/Time', name: "Name" }

export default function Environments() {
  const global = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  const createGroupHandler = () => {
    setShowCreate(true);
  }

  const updateGroupHandler = (id) => {
    setUpdateId(id);
    setShowUpdate(true);
  }

  const resolveAfter3Sec = new Promise(resolve => setTimeout(() => resolve("world"), 3000));
  const notify = () => toast.promise(resolveAfter3Sec, {
    pending: 'Processing',
    success: { render({ data }) { return `Success ${data}` } },
    error: 'Error'
  });

  useEffect(() => {
    global.update({ ...global, ...{ pageTitle: "Users" } });

    //Testing only
    setTimeout(() => {
      setLoading(false);
      setData(sampleData);
      setPagination(true);
    }, 5000);
  }, []);

  return (
    <div>
      <h4>Software Environments <FontAwesomeIcon icon={['fas', 'network-wired']} fixedWidth /></h4> <pre>Software Environments and Resources Management functions.</pre>
      <div className="row">
        <div className="col-md-6">
          <h6>Filter by</h6>
          <InputV1 label="Name" shortcut="Ctrl + Shift + F" />
          <SelectV1 label="Role" values={["Administrator", "DevOpsEngineer", "SecurityEngineer", "Master"]} />
          <CheckboxV1 label="Active" />
        </div>
        <div className="col-md-6">
          <h6>Actions</h6>
          <ButtonV1 onClick={createGroupHandler} label="Create New Environment" shortcut="Ctrl + Shift + C" />
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
                    return <td key={dataIndex + "_" + key} width={tdConfig[key] ? tdConfig[key].width : null} align={tdConfig[key] ? tdConfig[key].align : null}>{typeof d[key] === 'object' ? d[key][tdConfig[key]['key']] : d[key]}</td>
                  })}
                  <td width="250px" align="center">
                    <a href="#" className="btn btn-outline-primary btn-sm">Password Reset</a>&nbsp;
                    <a href="#" className="btn btn-outline-primary btn-sm" onClick={() => { updateGroupHandler(dataIndex) }}>Edit</a>&nbsp;
                    <a href="#" className="btn btn-outline-danger btn-sm" onClick={() => { setShowDeleteConfirmation(true) }}>Delete</a>
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
      <CreateUser show={showCreate} setShow={setShowCreate} />
      <UpdateUser id={updateId} show={showUpdate} setShow={setShowUpdate} data={sampleData} />
      <Confirm show={showDeleteConfirmation} setShow={setShowDeleteConfirmation} />
    </div>
  )
}

Environments.getLayout = function getLayout(page) {
  return (
    <>
      <Layout>
        {page}
      </Layout>
    </>
  )
}
