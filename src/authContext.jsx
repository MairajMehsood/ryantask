import React, { useReducer } from "react";
import MkdSDK from "./utils/MkdSDK";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        role: action.payload.role,
        token: action.payload.token,
        user: action.payload,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

let sdk = new MkdSDK();

export const tokenExpireError = (dispatch, errorMessage) => {
  const role = localStorage.getItem("role");
  if (errorMessage === "TOKEN_EXPIRED") {
    dispatch({
      type: "LOGOUT",
    });
    window.location.href = "/" + role + "/login";
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        let resp = await sdk.check();

        console.log('resp', resp)
        if (resp.message === "TOKEN_EXPIRED" || resp.message === "UNAUTHORIZED") {
          tokenExpireError(dispatch, 'TOKEN_EXPIRED');
        }
      } catch (error) {
        console.log('errror', error)
        tokenExpireError(dispatch, 'TOKEN_EXPIRED');
      }
    };
    const intervalId = setInterval(checkTokenValidity,  60 * 1000);
    return () => clearInterval(intervalId);
  }, [state]);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
