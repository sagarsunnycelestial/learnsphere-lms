import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@apollo/client/react';

import useUserCRUD from '../../hooks/useUserCRUD';
import { userAddFormControl, storeInfo } from '../../store/slices/formSlice';
import { useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { uploadImage } from '../../supabase/uploadImage';
import { FETCH_ROLES } from '../../graphql/queries/FetchRoles';
import { toast } from 'react-toastify';
import { newUserInfoToPDF } from '../../pdf-lib/pdfHandler';
import CircularProgress from '@mui/material/CircularProgress';
import { userSchema } from '../../validation/userSchema';
export default function AddUserForm() {
  const selectedUser = useAppSelector((state) => state.form.users.selectedUser);
  console.log('selected user:', selectedUser);
  const mode = useAppSelector((state) => state.form.users.mode);
  const publicUrl = useRef<string | null>(null);
  const isEditing = mode === 'edit';
  const [email, setEmail] = useState(selectedUser?.email ?? '');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    username?: string;
    collegeName?: string;
    email?: string;
    password?: string;
  }>({});
  const [password, setPassword] = useState('');
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [username, setUsername] = useState(selectedUser?.userName ?? '');
  const [collegeName, setCollegeName] = useState(selectedUser?.collegeName ?? '');
  const [role, setRole] = useState(selectedUser?.role ?? '');
  const dispatch = useAppDispatch();
  const { addNewUser, updateProfile } = useUserCRUD();
  const { data } = useQuery(FETCH_ROLES);
  const roles = data?.fetchRoles ?? [];
  async function handleSubmit() {
      const data = isEditing
    ? {
        username,
        collegeName,
        password,
        email,
      }
    : {
        username,
        collegeName,
        email,
      };

    const result = userSchema.safeParse(data)
    if(!result.success){
      const fieldErrors:{
    username?: string;
    collegeName?: string;
    email?: string;
    password?: string;
  } = {}
    result.error.issues.forEach((issue)=>{
      const field = issue.path[0] as 'username' | 'email' | 'password' | 'collegeName'
      fieldErrors[field] = issue.message
    })
    setErrors(fieldErrors)
    return
    }
    setLoading(true);
    let input;
    if (!isEditing) {
      input = {
        collegeName: collegeName,
        email: email,
        role: role,
        username: username,
      };
      try {
        const res = await addNewUser({ input });
        dispatch(
          storeInfo({
            email: res.registerUser.email,
            temp_password: res.registerUser.temp_password,
            didValueReceive: true,
          })
        );
        if (res.registerUser.email && res.registerUser.temp_password) {
          await newUserInfoToPDF({
            email: res.registerUser.email,
            temp_password: res.registerUser.temp_password,
          });
        }

        dispatch(
          userAddFormControl({
            isUserAddFormOpen: false,
            selectedUser: null,
          })
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
              ? err
              : 'Failed to create user';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        if (password) {
          const isValidPassword = password.length >= 4 && !password.includes(' ');

          if (!isValidPassword) {
            toast.error('Password must be at least 4 characters and cannot contain spaces');
            return;
          }
        }
        if (profileImg) {
          publicUrl.current = await uploadImage(profileImg);
        }

        input = {
          collegeName: collegeName,
          email: email,
          password: password,
          username: username,
          profile_image_path: publicUrl.current,
        };
        const res = await updateProfile({ input });
        if (res?.message) toast.success(res?.message);
        dispatch(
          userAddFormControl({
            isUserAddFormOpen: false,
            selectedUser: null,
          })
        );
      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    }
  }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    if (!['jpg', 'jpeg', 'webp', 'png'].includes(file.name.split('.')[1].toLowerCase())) {
      toast.error('Only Image files allowed');
      return;
    }
    setProfileImg(e.target.files[0]);
  }
  return (
    <Box
      sx={{
        width: 600,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          {isEditing ? 'Edit User' : 'Add User'}
        </Typography>

        <Button
          onClick={() =>
            dispatch(
              userAddFormControl({
                isUserAddFormOpen: false,
                selectedUser: null,
              })
            )
          }
          variant="outlined"
          sx={{
            textTransform: 'none',
          }}
        >
          Close
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          label="Username"
          helperText={errors.username || 'Username must be unique'}
          value={username}
          error={!!errors.username}
          onChange={(e) => {
            setErrors((prev)=>({...prev,username:''}))
            setUsername(e.target.value)}}
          required
          fullWidth
        />

        <TextField
          label="Email"
          value={email}
          helperText={errors.email}
          error= {!!errors.email}
          onChange={(e) => {
            setErrors((prev)=>({...prev,email:''}))
            setEmail(e.target.value)}}
          required
          fullWidth
        />
        {isEditing && (
          <TextField
            fullWidth
            type="password"
            label=" New Password"
            value={password}
            error={!!errors.password}
            helperText={errors.password}
            onChange={(e) => {
              setErrors((prev)=>({...prev,password:''}))
              setPassword(e.target.value)}}
          />
        )}

        <TextField
          label="College Name"
          value={collegeName}
          error={!!errors.collegeName}
          helperText={errors.collegeName}
          onChange={(e) => {
            setErrors((prev)=>({...prev,collegeName:''}))
            setCollegeName(e.target.value)}}
          required
          fullWidth
        />

        {!isEditing && (
          <FormControl fullWidth>
            <InputLabel id="role-label">User Role</InputLabel>

            <Select
              labelId="role-label"
              value={role}
              label="User Role"
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((item: { roleId: string; roleName: string }) => (
                <MenuItem key={item.roleId} value={item.roleId}>
                  {item.roleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {isEditing && (
          <Button
            variant="outlined"
            component="label"
            sx={{
              textTransform: 'none',
              justifyContent: 'flex-start',
            }}
          >
            {profileImg ? profileImg.name : 'Upload Profile Image'}
            <input hidden type="file" name="profile_image_path" onChange={handleImageChange} />
          </Button>
        )}
      </Box>
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        onClick={handleSubmit}
        sx={{
          textTransform: 'none',
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {loading ? (
          <CircularProgress size={22} color="inherit" />
        ) : isEditing ? (
          'Confirm Edit'
        ) : (
          'Submit'
        )}
      </Button>
    </Box>
  );
}
