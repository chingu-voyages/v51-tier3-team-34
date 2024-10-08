import { createContext, useEffect, useState } from "react";

// Utility functions to manage session storage
const sessionStorageHelper = {
  get: (key) => {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set: (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
};

// Initialize the user and token from session storage
const getInitialUser = () => sessionStorageHelper.get("currentUser");
const getInitialToken = () => sessionStorageHelper.get("token");

const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    currentUser: getInitialUser(),
    token: getInitialToken(),
  });

  useEffect(() => {
    // Store both user and token in session storage when they change
    sessionStorageHelper.set("currentUser", auth.currentUser);
    sessionStorageHelper.set("token", auth.token);
  }, [auth]);

  const login = (data) => {
    setAuth({
      currentUser: data.user,
      token: data.accessToken,
    });
  };


  // spreading "..auth" - allow the properties of auth to be added directly to value
  return (
    <UserContext.Provider value={{ ...auth, login }}>  
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };


// const UserProvider = ({children}) => {
//     const [currentUser, setCurrentUser] = useState(getInitialUser);
//     const [token, setToken ] = useState(getInitialToken)

//     useEffect(() => {
//       sessionStorage.setItem("currentUser", JSON.stringify(currentUser))
//     }, [currentUser])

//     useEffect(() => {
//       sessionStorage.setItem("token", JSON.stringify(token))
//     }, [token])
  
//     const login = (data) => {
//       console.log("login from usecontext", data.accessToken)
//       setToken(data.accessToken)
//       setCurrentUser(data.user)
//     }
  
//     const logout = () => {
//       fetch("/api/logout", {
//         method: "DELETE",
//         })
//         .then(() => setCurrentUser(null))
//     }

//     return (
//         <UserContext.Provider 
//           value={{currentUser, login, logout}}>
//             { children }
//         </UserContext.Provider>
//       )
//   }
  
// export { UserContext, UserProvider }