import { Paper,Chip,
  IconButton,Avatar,Stack, Typography,Menu,MenuItem, Box,
  Button,
  Dialog} from "@mui/material"
import {useTheme} from "@mui/material"
import type { FetchCoursesQuery } from "../../generated/graphql";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { green, red } from "@mui/material/colors";
import { hasPermission } from "../../permissions/auth";
import useCoursesCRUD from "../../hooks/useCoursesCRUD";
import { addCourseFormControl } from "../../store/slices/formSlice";
import { useState } from "react";
type Course = NonNullable<
  NonNullable<FetchCoursesQuery["fetchCourses"]>[number]
>;
type CourseCardProps = {
  course: Course;
};

export default function CourseCard({course}:CourseCardProps) {
  const [confirm,setConfirm] = useState<boolean>(false)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const {deleteCourse} = useCoursesCRUD()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
     const open = Boolean(anchorEl);
   const statusClr =
    course.isActive === true
      ? green : red;
  const user =useAppSelector(state=>state.auth.user)
    const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
    const handleDelete = async () => {
      if(course.courseId) await deleteCourse({courseId:course.courseId})
    setAnchorEl(null);
  };
  const handleEdit = ()=>{
    dispatch(addCourseFormControl({mode:'edit',isAddCourseFormOpen:true,selectedcourse:course}))
    setAnchorEl(null)
  }
  // console.log(course)
  if(!hasPermission(user,'view:archived courses') &&!course.isActive && !course.canModify) return null
  return (
       <Paper
  elevation={0}
  sx={{
    border: "1px solid",
    borderColor: theme.palette.primary.light,
    borderRadius: 4,
    width: 320,
    boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
    overflow: "hidden",
  }}
>
  {hasPermission(user,"action:course") && <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", p:1 }}
      >
      <Chip
          label={course.isActive == true ? 'Active' : 'Archived'}
          sx={{
            bgcolor: statusClr[100],
            color: statusClr[700],
            fontWeight: 600,
            px: 1,
          }}
        />
        <IconButton onClick={handleClick}>
          <Menu
            sx={{
              "& .MuiPaper-root": {
                borderRadius: 2,
                minWidth: 120,
              },
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
          {course.canModify || hasPermission(user,'edit all:courses')}
          <MenuItem onClick={handleEdit} disableRipple>
              <EditIcon sx={{ mr: 1 }} />
              Edit
            </MenuItem>
         
           <MenuItem onClick={()=>setConfirm(true)} disableRipple>
              <DeleteForeverIcon
                sx={{
                  mr: 1,
                  color: "error.main",
                }}
              />
              Delete
            </MenuItem> 
          </Menu>
          <MoreHorizIcon />
        </IconButton>
      </Stack>}
  
  <Avatar
    variant="square"
    src={`${course.thumbnail_image_path}`}
    alt={course.courseName!}
    sx={{
      width: "100%",
      height: 180,
    }}
  />
  <Stack spacing={1} sx={{ px: 2, py: 1.5 , minHeight: 0, display: "flex",
    flexDirection: "column",}}>
    <Typography variant="subtitle1" sx={{fontWeight:600}} noWrap>
      {course.courseName}
    </Typography>
    <Typography
      sx={{
              flex: 1,
      overflow: "hidden",
    minHeight: 40, 
      textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
      
      }}
     
      variant="body2"
      color="text.secondary"
    >
      {course.description}
    </Typography>

    <Stack direction="row" spacing={1}
    sx={{ pt: 1 , alignItems:"center"}}>
      <Avatar
        src={`${course.createdBy?.profile_image_path}`}
        alt={course?.createdBy?.username ?? "A"}
        sx={{ width: 28, height: 28 }}
      />
      <Stack direction='row' sx={{ justifyContent: "space-between", alignItems: 'center',flexGrow:1}}>
      <Stack>
        <Typography variant="caption" color="text.secondary">
          Created by
        </Typography>
        <Typography variant="body2" sx={{
fontWeight:500
        }} >
          {course.createdBy?.username}
        </Typography>
       
      </Stack>
      {hasPermission(user,'course:enroll') &&
       (course.isEnrolled? <Chip
  label="ENROLLED"
  sx={{
    borderRadius: 0,
  }}
/> : <Button variant="contained" sx={{ ml: "auto" }}>
  Enroll
</Button>)
      }
    
        </Stack>
    </Stack>
   
  </Stack>
<Dialog open={confirm} onClose={() => setConfirm(false)}>
  <Paper sx={{ p: 3, minWidth: 320 }}>
    <Typography variant="h6" gutterBottom>
      Delete Course?
    </Typography>

    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Are you sure you want to delete the <Typography component='span' sx={{fontWeight:600}}>{course.courseName} </Typography>  course? This action cannot be undone.
    </Typography>

    <Box sx={{
      display:"flex",justifyContent:"flex-end",gap:1
    }}>
      <Button onClick={() => setConfirm(false)}>
        Cancel
      </Button>

      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteForeverIcon />}
        onClick={handleDelete}
      >
        Delete
      </Button>
    </Box>
  </Paper>
</Dialog>
</Paper>
  )
}
