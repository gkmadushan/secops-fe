import React, { useEffect, useContext } from "react";
import Image from 'next/image';
import Link from 'next/link'

import Logo from '../assets/images/logo.png';
import Menu from '../assets/images/menu.png';
import HideMenu from '../assets/images/collapse.png';
import GlobalContext from "../utils/GlobalContext";

function Headers() {
  const global = useContext(GlobalContext);
  const menuHandler = () => {
    global.update(...{
      menuState: !global.menuState,
    });
  }

  return (
    <header>
      <Image src={global.menuState ? HideMenu : Menu} onClick={menuHandler} className="pointer d-none d-md-block" />
      <Link href="/"><a className="no-gte"><Image src={Logo} alt="SecOps Robot - Logo" /></a></Link>
      <div className="page-title d-none d-md-block">{global.pageTitle}</div>
      <div className="user-menu d-none d-sm-block">
        <span>Logged in as Kasun</span>
        <a href="#">Inbox (<b>2</b>)</a>
        <Link href="/login"><a href="#">Logout</a></Link>
      </div>
    </header>
  );
}

export default Headers;
