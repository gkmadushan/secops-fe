import Layout from "../layout";
import "../styles/globals.scss";
import "../styles/variables.scss";
import "bootstrap/dist/css/bootstrap.css";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

config.autoAddCss = false


function MyApp({ Component, pageProps }) {


  const getLayout = Component.getLayout || Layout

  return getLayout(
    <Component {...pageProps} />
  );
}

export default MyApp;
