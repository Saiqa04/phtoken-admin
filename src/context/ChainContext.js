import { useQuery } from "@apollo/client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { GET_CHAINS } from "../services/graphql";


const ChainContext = createContext();

export const ChainContextProvider = ({children}) => {

    const {loading, data} = useQuery(GET_CHAINS);
    const [chains, setChains] = useState([]);

    useEffect(() => {
        setChains(data?.Chains);
    },[data])

    return(
        <ChainContext.Provider value={{chains}}>
            {children}
        </ChainContext.Provider>
    );
}

export const useChainContext = () => useContext(ChainContext);