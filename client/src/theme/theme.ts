import {createTheme} from '@mui/material/styles'


export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3B4A9E",
      light: "#EAEDFA",
    },
    success: {
      main: "#2E7D5B",
      light: "#E6F3EC",
    },
    error: {
      main: "#C0533F",
      light: "#FBEAE6",
    },
    background: {
      default: "#e7e7f2",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1B23",
      secondary: "#6E7180",
    },
    divider: "#EBEBF2",
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7B87D6",
      light: "#252A47",
    },
    success: {
      main: "#5FB98A",
      light: "#152C22",
    },
    error: {
      main: "#D97F68",
      light: "#331E19",
    },
    background: {
      default: "#14151F",
      paper: "#1C1E2B",
    },
    text: {
      primary: "#F2F2F6",
      secondary: "#8E90A3",
    },
    divider: "#282B3C",
  },
});