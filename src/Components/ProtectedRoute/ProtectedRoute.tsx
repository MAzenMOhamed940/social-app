import type { ReactNode } from "react";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
if(localStorage.getItem("tkn")){

    return children

}

  return (
    <>

    <Navigate to="/login"/>
    </>
    
  )
}
