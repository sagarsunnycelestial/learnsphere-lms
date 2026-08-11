import {
  Paper,
  Chip,
  IconButton,
  Avatar,
  Stack,
  Typography,
  Menu,
  MenuItem,
  Box,
  Button,
  List,
  ListItemText,
  ListItemButton,
  Dialog,
} from '@mui/material';
import { useTheme } from '@mui/material';
import type { FetchCoursesQuery } from '../../generated/graphql';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { green, red } from '@mui/material/colors';
import { hasPermission } from '../../permissions/auth';
import useCoursesCRUD from '../../hooks/useCoursesCRUD';
import { addCourseFormControl } from '../../store/slices/formSlice';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import useFetchStudents from '../../hooks/useFetchStudents';
import useUserCRUD from '../../hooks/useUserCRUD';
import { toast } from 'react-toastify';
type Course = NonNullable<NonNullable<FetchCoursesQuery['fetchCourses']>[number]>;
type CourseCardProps = {
  course: Course;
};

export default function CourseCard({ course }: CourseCardProps) {
  const [confirm, setConfirm] = useState<boolean>(false);
  const [enrollBox, setEnrollBox] = useState<boolean>(false);
  const [enrollUserId, setEnrollUserId] = useState<string | null>(null);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: students } = useFetchStudents(course.courseId);
  const { deleteCourse } = useCoursesCRUD();
  const { enrollStudent } = useUserCRUD();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const statusClr = course.isActive === true ? green : red;
  const user = useAppSelector((state) => state.auth.user);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const canEnroll = hasPermission(user, 'course:enroll');
  const canManualEnroll = hasPermission(user, 'manual:enroll');
  const handleDelete = async () => {
    if (course.courseId) await deleteCourse({ courseId: course.courseId });
    setAnchorEl(null);
  };
  const handleEdit = () => {
    dispatch(
      addCourseFormControl({ mode: 'edit', isAddCourseFormOpen: true, selectedcourse: course })
    );
    setAnchorEl(null);
  };
  const handleManualEnroll = async (enrollUserId: string) => {
    if (!course.courseId) return;
    const res = await enrollStudent({ input: { userId: enrollUserId, courseId: course.courseId } });
    if (res?.message) toast.success(res?.message);
    setEnrollBox(false);
  };
  const handleSelfEnroll = async () => {
    if (!course.courseId) return;
    const res = await enrollStudent({ input: { courseId: course.courseId } });
    if (res?.message) toast.success(res?.message);
  };
  // console.log(course)
  if (!hasPermission(user, 'view:archived courses') && !course.isActive && !course.canModify)
    return null;
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: theme.palette.primary.light,
        borderRadius: 4,
        width: 320,
        boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      {hasPermission(user, 'action:course') && (
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
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
                '& .MuiPaper-root': {
                  borderRadius: 2,
                  minWidth: 120,
                },
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {course.canModify || hasPermission(user, 'edit all:courses')}
              <MenuItem onClick={handleEdit} disableRipple>
                <EditIcon sx={{ mr: 1 }} />
                Edit
              </MenuItem>

              <MenuItem onClick={() => setConfirm(true)} disableRipple>
                <DeleteForeverIcon
                  sx={{
                    mr: 1,
                    color: 'error.main',
                  }}
                />
                Delete
              </MenuItem>
            </Menu>
            <MoreHorizIcon />
          </IconButton>
        </Stack>
      )}

      <Box
        sx={{
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          '&:hover .overlay': {
            opacity: 1,
          },
        }}
      >
        <Avatar
          variant="square"
          src={`${course.thumbnail_image_path}`}
          alt={course.courseName!}
          sx={{
            width: '100%',
            height: 180,
          }}
        />
        {(course.isEnrolled || course.canModify) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0,0,0,0.6)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              transition: 'opacity 0.3s ease',
              fontSize: 18,
            }}
            className="overlay"
          >
            <Button
              sx={{ fontWeight: 600, fontSize: 14, color: 'white', width: '100%', height: '100%' }}
              onClick={() => navigate(`/dashboard/course/${course.courseId}`)}
            >
              Visit this course
            </Button>
          </Box>
        )}
      </Box>

      <Stack
        spacing={1}
        sx={{ px: 2, py: 1.5, minHeight: 0, display: 'flex', flexDirection: 'column' }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
          {course.courseName}
        </Typography>
        <Typography
          sx={{
            flex: 1,
            overflow: 'hidden',
            minHeight: 40,
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}

          variant="body2"
          color="text.secondary"
        >
          {course.description}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ pt: 1, alignItems: 'center' }}>
          <Avatar
            src={`${course.createdBy?.profile_image_path}`}
            alt={course?.createdBy?.username ?? 'A'}
            sx={{ width: 28, height: 28 }}
          />
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}
          >
            <Stack>
              <Typography variant="caption" color="text.secondary">
                Created by
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                }}
              >
                {course.createdBy?.username}
              </Typography>
            </Stack>
            {canManualEnroll ? (
              <Button
                color="warning"
                startIcon={<PersonAddIcon />}
                onClick={() => setEnrollBox(true)}
                variant="contained"
                size="small"
                sx={{
                  ml: 'auto',
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2.5,
                  transition: '0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Manual Enroll
              </Button>
            ) : canEnroll ? (
              course.isEnrolled === true ? (
                <Chip label="ENROLLED" sx={{ borderRadius: 0 }} />
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSelfEnroll}
                  startIcon={<PersonAddIcon />}
                  size="small"
                  sx={{
                    ml: 'auto',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                    transition: '0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Enroll
                </Button>
              )
            ) : null}
          </Stack>
        </Stack>
      </Stack>
      <Dialog open={confirm} onClose={() => setConfirm(false)}>
        <Paper sx={{ p: 3, minWidth: 320 }}>
          <Typography variant="h6" gutterBottom>
            Delete Course?
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Are you sure you want to delete the{' '}
            <Typography component="span" sx={{ fontWeight: 600 }}>
              {course.courseName}{' '}
            </Typography>{' '}
            course? This action cannot be undone.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <Button onClick={() => setConfirm(false)}>Cancel</Button>

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
      <Dialog open={enrollBox} onClose={() => setEnrollBox(false)}>
        <Paper sx={{ p: 3, minWidth: 320 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
            Select a user to enroll
          </Typography>
          <List sx={{ mb: 2, gap: 2 }}>
            {students?.map((c) => (
              <ListItemButton
                sx={{ ml: -2 }}
                key={c?.userId}
                selected={enrollUserId === c?.userId}
                disabled={c?.isEnrolled === true}
                onClick={() => setEnrollUserId(c?.userId as string)}
              >
                <Avatar
                  src={`${c?.profile_image_path}`}
                  alt={c?.username ?? 'A'}
                  sx={{ width: 45, height: 45, mr: 2 }}
                />
                <ListItemText primary={c?.username} />
                {c?.isEnrolled && <Chip size="small" label="Already Enrolled" />}
              </ListItemButton>
            ))}
          </List>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <Button onClick={() => setEnrollBox(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<PersonAddIcon />}
              disabled={!enrollUserId}
              onClick={() => handleManualEnroll(enrollUserId as string)}
            >
              Enroll
            </Button>
          </Box>
        </Paper>
      </Dialog>
    </Paper>
  );
}
