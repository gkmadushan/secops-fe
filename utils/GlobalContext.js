import React from 'react'

const GlobalContext = React.createContext({
    menuState: true,
    update: (date) => { }
});

export default GlobalContext
