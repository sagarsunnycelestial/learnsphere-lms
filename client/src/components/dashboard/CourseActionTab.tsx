import { Button, Typography, Box,Paper } from "@mui/material";
import { useAppDispatch } from "../../store/hooks";
import {useTheme} from "@mui/material";
import { hasPermission } from "../../permissions/auth";
import { useAppSelector } from "../../store/hooks";
import AddIcon from "@mui/icons-material/Add";

export default function CourseActionTab() {
    const theme = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  return (
    <Paper
    elevation={0}
      sx={{
         border:'1px solid',
      borderColor:theme.palette.background.paper,
      px:2,
      py:1,
        flexGrow: 1,
        display: "flex",
        justifyContent: "space-between",
        paddingBottom: 5,
      }}
    >
      <Box>

    <Typography
      variant="h5"
      sx={{
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
     
      Course Controls
    </Typography>
  </Box>

  <Box>
    {hasPermission(user, "create:lesson") && (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        // onClick={}
        sx={{
          px: 3.5,
          py: 1.5,
          borderRadius: 3,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
        }}
      >
        Add User
      </Button>
    )}
    {/* {hasPermission(user, "create:course") && (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={()=>dispatch(addCourseFormControl({mode:'add',isAddCourseFormOpen:true,selectedcourse:null}))}
        sx={{
          px: 3.5,
          py: 1.5,
          borderRadius: 3,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
        }}
      >
        Add Course
      </Button>
    )} */}

    {/* {mode==='add' && <Dialog open={isOpen}>
     <AddUserForm />
    </Dialog>} */}
  </Box>
    </Paper>
  );
}
