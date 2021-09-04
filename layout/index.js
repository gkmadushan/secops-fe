import React, { useContext, useState } from "react";
import Headers from "../components/Headers";
import LeftNav from "../components/LeftNav";
import GlobalContext from "../utils/GlobalContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function index({ children }) {
  const [state, setState] = useState({
    menuState: true,
    update
  });

  function update(data) {
    setState(Object.assign({}, state, data));
  }

  const resolveAfter3Sec = new Promise(resolve => setTimeout(() => resolve("world"), 3000));



  return (
    <>
      <GlobalContext.Provider value={state}>
        <Headers />

        <div>
          <ToastContainer autoClose={8000} />
          <LeftNav />
          <div className={["main-content", state.menuState ? "shrink-width" : "full-width"].join(" ")}>
            {children}
          </div>
        </div>
      </GlobalContext.Provider>
    </>
  );
}

export default index;
