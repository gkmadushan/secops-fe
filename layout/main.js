import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../utils/GlobalContext";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";

function main({ children }) {
  const queryClient = new QueryClient();
  const [state, setState] = useState({
    menuState: true,
    update,
  });

  function update(data) {
    setState(Object.assign({}, state, data));
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <GlobalContext.Provider value={state}>
          {children}
        </GlobalContext.Provider>
      </QueryClientProvider>
    </>
  );
}

export default main;
