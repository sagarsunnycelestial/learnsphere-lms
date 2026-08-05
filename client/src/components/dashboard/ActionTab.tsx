import { Button, Typography, Box, Dialog } from "@mui/material";
import { useAppDispatch } from "../../store/hooks";
import { userAddFormControl } from "../../store/slices/formSlice";

import { hasPermission } from "../../permissions/auth";
import { useAppSelector } from "../../store/hooks";
import AddIcon from "@mui/icons-material/Add";
import AddUserForm from "../forms/AddUserForm";
export default function ActionTab() {
  const user = useAppSelector((state) => state.auth.user);
  const isOpen = useAppSelector((state) => state.form.users.isUserAddFormOpen);
  const dispatch = useAppDispatch();
  function handleOpen() {
    dispatch(userAddFormControl({ mode:'add',
isUserAddFormOpen: true,
selectedUser: null}));
  }
  return (
    <Box
      sx={{
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

    <Dialog open={isOpen}>
     <AddUserForm />
    </Dialog>
  </Box>
    </Box>
  );
}
