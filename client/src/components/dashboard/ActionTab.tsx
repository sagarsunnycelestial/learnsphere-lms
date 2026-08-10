import { Button, Typography, Box, Dialog,Paper } from "@mui/material";
import { useAppDispatch } from "../../store/hooks";
import { userAddFormControl } from "../../store/slices/formSlice";
import {useTheme} from "@mui/material";
import { hasPermission } from "../../permissions/auth";
import { useAppSelector } from "../../store/hooks";
import AddIcon from "@mui/icons-material/Add";
import AddUserForm from "../forms/AddUserForm";
export default function ActionTab() {
    const theme = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const mode = useAppSelector(state=>state.form.users.mode)
  const isOpen = useAppSelector((state) => state.form.users.isUserAddFormOpen);
  const dispatch = useAppDispatch();
  function handleOpen() {
    dispatch(userAddFormControl({ mode:'add',
isUserAddFormOpen: true,
selectedUser: null}));
  }
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
     
      {user.role} Controls
    </Typography>
  </Box>

  <Box>
    {hasPermission(user, "create:user") && (
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
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

    {mode==='add' && <Dialog open={isOpen}>
     <AddUserForm />
    </Dialog>}
  </Box>
    </Paper>
  );
}
