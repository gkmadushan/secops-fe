import React, { useContext, useEffect } from "react";
import Headers from "../components/Headers";
import LeftNav from "../components/LeftNav";
import GlobalContext from "../utils/GlobalContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

function index({ children }) {
  const router = useRouter();
  const global = useContext(GlobalContext);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus === "TRUE") {
      global.update({ ...global, ...{ loggedIn: true } });
    } else {
      // router.push('/login')
    }
  }, []);

  return (
    <>
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
