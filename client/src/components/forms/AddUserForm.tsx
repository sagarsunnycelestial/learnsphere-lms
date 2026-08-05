import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import useUserCRUD from "../../hooks/useUserCRUD";
import { userAddFormControl,storeInfo} from "../../store/slices/formSlice";
import { useRef, useState } from "react";
import { useAppSelector,useAppDispatch } from "../../store/hooks";
import { uploadImage } from "../../supabase/uploadImage";
export default function AddUserForm() {
  const selectedUser = useAppSelector(state=>state.form.users.selectedUser)
  const mode = useAppSelector(state=>state.form.users.mode)
  const publicUrl = useRef<string | null>(null)
  const isEditing = mode === 'edit'
  const [email,setEmail] = useState(selectedUser?.email ?? '')
   const [profileImg, setProfileImg] = useState<File | null>(null);
  const [username,setUsername] = useState(selectedUser?.username ?? '')
  const [collegeName,setCollegeName] = useState(selectedUser?.collegeName ?? '')
  const [role,setRole] = useState(selectedUser?.role ?? 'Student');
  const dispatch = useAppDispatch()
  const {addNewUser} = useUserCRUD()
 async function handleSubmit(){
    let input;
    if(!isEditing){
      input = {
      collegeName:collegeName,
      email:email,
      role:role,
      username:username
    }
    const res = await addNewUser({input})
    dispatch(storeInfo({email:res.}))
    }
    else{
      if(profileImg){
        publicUrl.current = await uploadImage(profileImg)
      }
    input = {
      collegeName:collegeName,
      email:email,
      role:role,
      username:username,
      profile_image_path:publicUrl.current
    }
    }
    
  }
   function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    setProfileImg(e.target.files[0]);
  }
  return (
    <Box
      sx={{
        width: 600,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          {isEditing ? "Edit User" : "Add User"}
        </Typography>

        <Button
          onClick={() => dispatch(userAddFormControl({
isUserAddFormOpen: false,
selectedUser: null}))}
          variant="outlined"
          sx={{
            textTransform: "none",
          }}
        >
          Close
        </Button>
      </Box>
       <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField label="Full Name" value={username} onChange={(e)=>setUsername(e.target.value)} required fullWidth />

        <TextField label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required fullWidth />

        <TextField label="College Name" value={collegeName} onChange={(e)=>setCollegeName(e.target.value)} required fullWidth />

        <FormControl fullWidth>
          <InputLabel>User Role</InputLabel>
          <Select
            name="user_role"
            required
            value={role}
            defaultValue={role}
            onChange={(e)=>setRole(e.target.value)}
            label="Department"
          >
            <MenuItem value="Admin">Adminstrator</MenuItem>
            <MenuItem value="Instructor">Instructor</MenuItem>
            <MenuItem value="Student">Student</MenuItem>
          </Select>
        </FormControl>
        {isEditing ??  <Button
          variant="outlined"
          component="label"
          sx={{
            textTransform: "none",
            justifyContent: "flex-start",
          }}
        >
          Upload Image
          <input
            hidden
            type="file"
            name="profile_image_path"
            onChange={handleImageChange}
          />
        </Button>}
</Box>
 <Button
        type="submit"
        variant="contained"
        size="large"
        onSubmit={handleSubmit}
        sx={{
          textTransform: "none",
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {isEditing ? "Confirm Edit" : "Submit"}
      </Button>
    </Box>
  )
}
