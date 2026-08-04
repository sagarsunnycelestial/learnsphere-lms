import { lightTheme,darkTheme } from "./theme/theme";
import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {ToastContainer} from 'react-toastify'
import { useAppSelector } from "./store/hooks";
import { RouterProvider } from "react-router"
import router from "./router"
export default function App() {
  const mode = useAppSelector(state=>state.theme.theme)
  const theme = mode === 'light'?lightTheme : darkTheme;
    useEffect(()=>{
    localStorage.setItem("theme",mode)
  },[mode])
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <RouterProvider router={router} />
    </ThemeProvider>
   
  )
}

