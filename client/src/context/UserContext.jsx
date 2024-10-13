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

  const logout = () => {
    setAuth({
      currentUser: null,
      token: null,
    });
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("token");
  };

  // spreading "..auth" - allow the properties of auth to be added directly to value
  return (
    <UserContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

// We do not have time for this, but nice to have for security.
//3. Optional Backend Logout (Token Invalidation)
// Token invalidation: You typically don't need to handle anything on the backend for JWT-based logout because JWT is stateless.
// However, if you want to explicitly "invalidate" a token (e.g., by blacklisting it or tracking it in a database), you'd need to
// implement a token blacklist mechanism on the backend. This is optional but can add another layer of security,
// especially for sensitive applications.
