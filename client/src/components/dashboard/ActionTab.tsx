import {
  Button,
  Typography,
  Box,
  Dialog,
  Paper,
  Stack,
  Avatar,
} from '@mui/material';
import { useAppDispatch } from '../../store/hooks';
import {
  addCourseFormControl,
  userAddFormControl,
} from '../../store/slices/formSlice';
import { useTheme } from '@mui/material';
import { hasPermission } from '../../permissions/auth';
import { useAppSelector } from '../../store/hooks';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddUserForm from '../forms/AddUserForm';

export default function ActionTab() {
  const theme = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const mode = useAppSelector((state) => state.form.users.mode);
  const isOpen = useAppSelector((state) => state.form.users.isUserAddFormOpen);
  const dispatch = useAppDispatch();

  function handleOpen() {
    dispatch(
      userAddFormControl({
        mode: 'add',
        isUserAddFormOpen: true,
        selectedUser: null,
      })
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: theme.palette.divider,
        borderRadius: 4,
        px: 3,
        py: 2.5,
        mb: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 44,
            height: 44,
          }}
        >
          <AdminPanelSettingsIcon />
        </Avatar>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            {user.role} Controls
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage users and courses
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.5}>
        {hasPermission(user, 'create:user') && (
          <Button
            variant="contained"
            startIcon={<PersonAddAlt1Icon />}
            onClick={handleOpen}
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              boxShadow: 'none',
            }}
          >
            Add User
          </Button>
        )}

        {hasPermission(user, 'create:course') && (
          <Button
            variant="outlined"
            startIcon={<MenuBookIcon />}
            onClick={() =>
              dispatch(
                addCourseFormControl({
                  mode: 'add',
                  isAddCourseFormOpen: true,
                  selectedcourse: null,
                })
              )
            }
            sx={{
              px: 3,
              py: 1.25,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            Add Course
          </Button>
        )}
      </Stack>

      {mode === 'add' && (
        <Dialog open={isOpen}>
          <AddUserForm />
        </Dialog>
      )}
    </Paper>
  );
}
