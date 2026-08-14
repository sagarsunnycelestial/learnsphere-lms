import { Button, Box, Card, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAppDispatch } from '../store/hooks';
import { apolloClient } from '../graphql/apolloClient';
import { refreshUser } from '../store/slices/authSlice';
import { REFRESH_QUERY } from '../graphql/queries/RefreshQuery';
import { useState } from 'react';
import LMSlogo from '../assets/LMSlogo.png';
import CircularProgress from '@mui/material/CircularProgress';
const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const from = location.state?.from;
  useEffect(() => {
    async function refreshToken() {
      try {
        const response = await apolloClient.query({
          query: REFRESH_QUERY,
          fetchPolicy: 'network-only',
        });

        if (!response.data?.refreshEndpoint) {
          setRefreshFailed(true);
          return;
        }

        const { accessToken, role, profile_image_path } = response.data.refreshEndpoint;

        dispatch(
          refreshUser({
            accessToken,
            role,
            isAuthenticated: true,
            profile_image_path,
          })
        );

        if (from) {
          navigate(from.pathname + from.search + from.hash, { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } catch {
        setRefreshFailed(true);
      } finally {
        setCheckingAuth(false);
      }
    }

    refreshToken();
  }, [dispatch, navigate, from]);
  if (checkingAuth && !refreshFailed) {
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: '10%',
        bgcolor: '',
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: 450,
          borderRadius: 4,
          p: 4,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          boxShadow: '0px 2px 6px ',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box
            component="img"
            src={LMSlogo}
            alt="Company Logo"
            sx={{
              width: 160,
              p: 0,
              objectFit: 'contain',
            }}
          />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4">Welcome to LearnSphere</Typography>

            <Typography
              sx={{
                mt: 1,
                color: 'text.secondary',
                fontSize: 15,
              }}
            >
              A Learning Management System
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate('auth/login')}>
            Go to Login
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
export default HomePage;
