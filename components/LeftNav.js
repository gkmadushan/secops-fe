import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "../styles/LeftNav.module.scss";
import GlobalContext from "../utils/GlobalContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LeftNav() {
  const global = useContext(GlobalContext);
  const router = useRouter();
  const [menu, setMenu] = useState([]);
  const menuConfig = useRef(process.env.menuConfig);
  const [user, setUser] = useState(null);

  function setActiveMenu() {
    let menuStructure = menuConfig.current;

    if (menuStructure) {
      //setting all menu items to inactive state
      let menu = menuStructure.map((m) => {
        m.active = false;
        return m;
      });
      //finding the index of active menu item from the router path matched with menu uri
      let activeMenuIndex = menuStructure.findIndex(
        (m) => m.uri === router.asPath
      );
      //setting current uri belonging index to active
      menu[activeMenuIndex].active = true;
      setMenu(menu);
    }
  }

  useEffect(() => {
    setActiveMenu();
  }, [router]);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("userdata")));
  }, []);

  const userRole = user?.role;

  return (
    <div className={[styles.leftNav].join(" ")}>
      <ul>
        {menu.length > 0 && user.role
          ? menu.map(
              ({ name, uri, active, icon, role }) =>
                role.includes(userRole) && (
                  <li key={uri}>
                    <Link href={uri}>
                      <a className={active ? styles.active : null} uri={uri}>
                        <FontAwesomeIcon icon={["fas", icon]} fixedWidth />
                        {active && !global.menuState ? "|" : ""} {name}
                      </a>
                    </Link>
                  </li>
                )
            )
          : null}
      </ul>
    </div>
  );
}

export default LeftNav;
