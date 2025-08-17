import { createContext, useContext } from "react";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export default AppContext;
