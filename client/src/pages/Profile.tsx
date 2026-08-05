import {Card, Typography,Button,Dialog} from '@mui/material'
import useFetchProfile from '../hooks/useFetchProfile'
import AddIcon from "@mui/icons-material/Add";
import { useAppDispatch,useAppSelector } from '../store/hooks';
import { userAddFormControl } from '../store/slices/formSlice';
import AddUserForm from '../components/forms/AddUserForm';
export default function Profile() {
const {data:profile} = useFetchProfile()
  const dispatch = useAppDispatch();
   const mode = useAppSelector(state=>state.form.users.mode)
    const isOpen = useAppSelector((state) => state.form.users.isUserAddFormOpen);
  function handleOpen() {
    const selectedUser = {
      userName:profile?.username,
      email:profile?.email,
      collegeName:profile?.collegeName,
    }
    dispatch(userAddFormControl({ mode:'edit',
isUserAddFormOpen: true,
selectedUser: selectedUser}));
  }
  return (
    <>
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
        Edit Profile
      </Button>
        <Typography variant='h3' >Profile</Typography>
        <Typography variant='h5' >{profile?.username}</Typography>
        
      </Card>
      {mode==='edit' && <Dialog open={isOpen}>
             <AddUserForm />
            </Dialog>}
</>
  )
}
