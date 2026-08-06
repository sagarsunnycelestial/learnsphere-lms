import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material";
import { logout } from "../../store/slices/authSlice";
import {Badge} from "@mui/material";
import { apolloClient } from "../../graphql/apolloClient";
import { LogoutDocument } from "../../generated/graphql";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../store/hooks";
type ProfileMenuProps = {
  profile_image: string;
};
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));
export default function ProfileMenu({ profile_image }: ProfileMenuProps) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch()
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
const handleProfile =() => {
  handleClose();
  navigate('/dashboard/profile')
}
  const handleLogout = async() => {
    handleClose();
    const {data:res} = await apolloClient.mutate({
      mutation:LogoutDocument
    })
    if(res?.logout?.message){
      dispatch(logout())
      navigate('/')
      toast.success(res.logout.message)
      
    }
    console.log("logout");
  };

  return (
    <>
      <div onClick={handleOpen} style={{ cursor: "pointer" }}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar src={profile_image} alt="A" />
        </StyledBadge>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleProfile}>
          Profile
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          sx={{ color: "red" }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}