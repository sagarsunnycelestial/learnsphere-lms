import { useAppSelector } from "../../store/hooks"
import { Outlet } from "react-router"
import { Navigate } from "react-router"
import SideBar from "./SideBar"
export default function AuthLayout() {
 
  const user = useAppSelector((state)=> state.auth.user)

  if(user?.accessToken){
return (
  <SideBar>
    <Outlet />
    </SideBar>
  )
  }
  else{
  return <Navigate to="/" replace />;
  }
  
}
