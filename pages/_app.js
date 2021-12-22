import Layout from "../layout/main";
import "../styles/globals.scss";
import "../styles/variables.scss";
import "bootstrap/dist/css/bootstrap.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

library.add(fas);
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  const [state, setState] = useState({
    menuState: true,
    testKey: "test",
    update,
  });

  function update(data) {
    setState(Object.assign({}, state, data));
  }

  const getLayout = Component.getLayout || Layout;

  return <Layout>{getLayout(<Component {...pageProps} />)}</Layout>;
}

export default MyApp;
