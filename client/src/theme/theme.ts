import {createTheme} from '@mui/material/styles'


export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4F5DED",
      light: "#EEF0FE",
    },
    success: {
      main: "#1E9E5A",
      light: "#E4F7EC",
    },
    error: {
      main: "#E1543A",
      light: "#FDEAE6",
    },
    background: {
      default: "#F5F6FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#12131A",
      secondary: "#7C7F8E",
    },
    divider: "#EEF0F5",
  },
});
 
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6D7BFF",
      light: "#242840",
    },
    success: {
      main: "#4ADE8A",
      light: "#123423",
    },
    error: {
      main: "#FF7A5C",
      light: "#3A1B18",
    },
    background: {
      default: "#12141F",
      paper: "#1B1E2E",
    },
    text: {
      primary: "#F5F6FA",
      secondary: "#9295AB",
    },
    divider: "#272B3F",
  },
});