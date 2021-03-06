import React, { useContext, useEffect } from "react";
import Headers from "../components/Headers";
import LeftNav from "../components/LeftNav";
import GlobalContext from "../utils/GlobalContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Head from "next/head";

const loadUser = async () => {
  const userdata = await localStorage.getItem("userdata");
  return JSON.parse(userdata);
};

function index({ children }) {
  const router = useRouter();
  const global = useContext(GlobalContext);

  useEffect(() => {
    loadUser().then((obj) =>
      global.update({
        ...global,
        ...{ loggedIn: true, user: obj },
      })
    );
  }, []);

  return (
    <>
      <Head>
        <title>SecOps - Automated Vulnerablity Management System</title>
      </Head>
      <Headers />

      <div>
        <ToastContainer autoClose={8000} />
        <LeftNav />
        <div
          className={[
            "main-content",
            global.menuState ? "shrink-width" : "full-width",
          ].join(" ")}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default index;
