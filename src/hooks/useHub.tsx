import { useContext } from "react";
import { HubContext } from "../providers/HubContextProvider";

function useHub() {
  return useContext(HubContext);
}

export default useHub;
