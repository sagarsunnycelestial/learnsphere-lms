import { Card, Box, Typography, TextField, Button } from "@mui/material";
// import auth from "../assets/auth.webp";
// import MyLogo from "../assets/HR-logo.webp";
import {z} from 'zod'
import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { loginThunk } from "../store/thunks/loginThunk";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  // console.log(auth);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogin = async () => {
if (!email || !password) {
    toast.error("Please enter both email and password");
    return;
  }
const loginSchema = z.object({
  email: z.email("Pleaser enter a valid email"),
  password: z.string().min(1,"Password is required")
});
const result = loginSchema.safeParse({email,password});
if(!result.success){
  toast.error(result.error.issues[0].message);
  return
}
  try {
    setLoading(true);
    await dispatch(loginThunk({ email, password }))
    navigate("/home");
  } catch(err) {
    toast.error(err as string)
  } finally {
    setLoading(false);
  }
  };
  return (
    <Box
      sx={{
        // backgroundImage: `url(${auth})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: 450,
          borderRadius: 4,
          p: 4,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            component="img"
            // src={MyLogo}
            alt="Company Logo"
            sx={{
              width: 120,
              objectFit: "contain",
            }}
          />

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
            >
              Welcome Back
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "text.secondary",
                fontSize: 15,
              }}
            >
              Sign in to access your employee profile
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{
              mt: 1,
              py: 1.2,
              borderRadius: 2,
              
            }}
          >
            {loading? 'Signing In...' : 'Login'}
          </Button>

        </Box>
        <Typography
          sx={{
            mt: 1,
            fontSize: 13,
          }}
        >
          Humanly HR Management System
        </Typography>
      </Card>
    </Box>
  );
}
