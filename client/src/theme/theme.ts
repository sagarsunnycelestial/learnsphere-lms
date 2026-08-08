import { createTheme } from '@mui/material/styles'

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3D4FA8",
      light: "#EDF0FB",
    },
    success: {
      main: "#2E8564",
      light: "#E5F4EC",
    },
    error: {
      main: "#C85A45",
      light: "#FCEBE7",
    },
    background: {
      default: "#EEF0F7",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1D1E2A",
      secondary: "#6B6E82",
    },
    divider: "#E4E6F0",
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8992DE",
      light: "#282E52",
    },
    success: {
      main: "#68C295",
      light: "#173327",
    },
    error: {
      main: "#E08A72",
      light: "#3A211B",
    },
    background: {
      default: "#12131C",
      paper: "#1B1D2B",
    },
    text: {
      primary: "#F4F4F8",
      secondary: "#9497AC",
    },
    divider: "#1e223e",
  },
});