import React, { useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";

import Logo from "../assets/images/logo.png";
import { useRouter } from "next/router";
import GlobalContext from "../utils/GlobalContext";
import Axios from "../hooks/useApi";

async function logout() {
  await Axios.post("/oauth/revoke");
}

function Headers() {
  const global = useContext(GlobalContext);
  const router = useRouter();

  const menuHandler = () => {
    global.update(
      ...{
        menuState: !global.menuState,
      }
    );
  };

  const handleLogout = (e) => {
    logout();
    router.push("/login");
  };

  return (
    <header>
      {/* <Image src={global.menuState ? HideMenu : Menu} onClick={menuHandler} className="pointer d-none d-md-block" /> */}
      <Link href="/">
        <a className="no-gte">
          <Image src={Logo} alt="SecOps Robot - Logo" />
        </a>
      </Link>
      <div className="page-title d-none d-md-block">{global.pageTitle}</div>
      <div className="user-menu d-none d-sm-block">
        <span>Logged in as {global?.user?.name}</span>
        {/* <a href="#">
          Inbox (
          <b>{global && global.notifications ? global.notifications : 0}</b>)
        </a> */}
        <span className="pointer" onClick={(e) => handleLogout(e)}>
          Logout
        </span>
      </div>
    </header>
  );
}

export default Headers;
