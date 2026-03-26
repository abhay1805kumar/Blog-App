import { createContext, useState } from "react";
// import { create } from "../../api/models/User";

export const UserContext=createContext({});

export function UserContextProvider({children}){
    const [userInfo,setUserInfo]=useState({});
    return (
        <UserContext.Provider value={{userInfo,setUserInfo}}>
            {children}
        </UserContext.Provider>
    );
}