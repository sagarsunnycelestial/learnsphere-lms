import { Card, Chip, Typography, Button, Dialog, Avatar, Stack, Box, Divider } from '@mui/material';
import useFetchProfile from '../hooks/useFetchProfile';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { userAddFormControl } from '../store/slices/formSlice';
import AddUserForm from '../components/forms/AddUserForm';
import CircularProgress from '@mui/material/CircularProgress';
import ProfileBar from '../components/profile/ProfileBar';
export default function Profile() {
  const { data: profile, isLoading } = useFetchProfile();
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.form.users.mode);
  const isOpen = useAppSelector((state) => state.form.users.isUserAddFormOpen);
  function handleOpen() {
    const selectedUser = {
      userName: profile?.username,
      email: profile?.email,
      collegeName: profile?.collegeName,
    };
    dispatch(
      userAddFormControl({ mode: 'edit', isUserAddFormOpen: true, selectedUser: selectedUser })
    );
  }
  console.log(profile);
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress color="inherit" aria-label="Loading…" />
      </Box>
    );
  }
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'minmax(320px, 400px) minmax(0, 1fr)',
          },
          gap: { xs: 3, sm: 3, md: 5 },
          alignItems: 'flex-start',
         justifyItems: { xs: 'center', sm: 'stretch' },
          p: { xs: 1, sm: 2 },
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: 400,
            p: 4,

            borderRadius: 4,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 2,
            }}
          >
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              sx={{
                borderRadius: 2,
                px: 3,
              }}
            >
              Edit Profile
            </Button>
          </Box>

          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
            }}
          >
            <Avatar
              src={`${profile?.profile_image_path}`}
              alt={profile?.username}
              sx={{ width: 130, height: 130, borderRadius: 4 }}
            />

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {profile?.username}
            </Typography>

            <Chip label={profile?.role?.roleName} size="small" color="primary" variant="outlined" />
          </Stack>

          <Divider sx={{ my: 3 }} />
          <Stack spacing={2}>
            {[
              ['College', profile?.collegeName],
              ['Email', profile?.email],
              ['Role', profile?.role?.roleName],
              ['Courses', profile?.enrollments?.length ?? 0],
            ].map(([label, value]) => (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ color: 'text.secondary' }}>{label}</Typography>

                <Typography sx={{ fontSize: 18 }}>{value}</Typography>
              </Box>
            ))}
          </Stack>
        </Card>
        <ProfileBar />
      </Box>

      {mode === 'edit' && (
        <Dialog open={isOpen}>
          <AddUserForm />
        </Dialog>
      )}
    </>
  );
}
