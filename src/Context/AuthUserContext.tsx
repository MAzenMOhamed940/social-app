import { createContext, useEffect, useState, type ReactNode } from "react";
import { gaetuserData } from "../Pages/Login/Login";

type UserData = {
  data: {
    user: {
      _id : string;
      name: string;
      email: string;
      photo: string;
    };
  };
};

type UserTokenContextType = {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
};

export const UserTokenContext = createContext<UserTokenContextType | null>(
  null,
);

export default function AuthUserContext({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(function () {
    if (localStorage.getItem("tkn")) {
      gaetuserData().then(function (data) {
        setUserData(data);
      });
    }
  }, []);

  return (
    <UserTokenContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserTokenContext.Provider>
  );
}
