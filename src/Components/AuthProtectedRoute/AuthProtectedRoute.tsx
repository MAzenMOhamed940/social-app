import type { ReactNode } from "react";
import { Navigate } from "react-router";

export default function AuthProtectedRoute({ children }: { children: ReactNode }) {
if(localStorage.getItem("tkn")){

    return <Navigate to="/posts"/>

}

  return (
    <>

    {children}
    </>
    
  )
}
