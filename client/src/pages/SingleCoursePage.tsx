import { useParams } from "react-router";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  Stack,
  Chip,
  Dialog,
  Paper,
  useTheme,
  Slide,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import { hasPermission } from "../permissions/auth";
import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import useFetchCourseById from "../hooks/useFetchCourseById";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
// import CourseActionTab from "../components/dashboard/CourseActionTab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { alpha } from '@mui/material/styles';
import useCoursesCRUD from "../hooks/useCoursesCRUD";
import { addCourseFormControl, lessonFormControl } from "../store/slices/formSlice";
import CourseForm from "../components/forms/CourseForm";
import useLessonsCRUD from "../hooks/useLessonsCRUD";
import { Lesson } from "../types/types";
import { toast } from "react-toastify";
import LessonForm from "../components/forms/LessonForm";
export default function SingleCoursePage() {
  const [lessonToDelete,setLessonToDelete] = useState<Lesson | null>()
  const lessonDialog = Boolean(lessonToDelete)
  const [enrolled, setEnrolled] = useState(false);
  const {deleteLesson} = useLessonsCRUD();
  
  const { id } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, error } = useFetchCourseById(id!);
  const course = data;
  const lessons = course?.lessons ?? [];
  const quizzes = course?.quizzes ?? [];
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.form.courses.isAddCourseFormOpen,
  );
  const lessonForm = useAppSelector(state=>state.form.lessons.isLessonFormOpen)
  const theme = useTheme();
  const { deleteCourse } = useCoursesCRUD();
  const [confirm, setConfirm] = useState<boolean>(false);
  console.log(quizzes);
  const isEnrolled = course?.isEnrolled;
  const handleDelete = async () => {
    if (course?.courseId) {
 const res = await deleteCourse({ courseId: course.courseId });
  toast.success(res?.message)
    }
     
  };
  const handleEdit = () => {
    dispatch(
      addCourseFormControl({
        mode: "edit",
        isAddCourseFormOpen: true,
        selectedcourse: course,
      }),
    );
  };
 const handleLessonEdit = (lesson:Lesson) => {
  console.log(lesson.lessonId)
    dispatch(
      lessonFormControl({
        mode: "edit",
        isLessonFormOpen: true,
        selectedLesson: {...lesson,courseId:course?.courseId}
      }),
    );
  };
  const handleLessonDialog=(lesson:Lesson) =>{
    setLessonToDelete(lesson);
  }
  const handleLessonDelete =async() =>{
    if (course?.courseId) {
      try{
const res = await deleteLesson({ input:{
      courseId:course.courseId,
      lessonId:lessonToDelete?.lessonId,
    } });
    toast.success(res?.message)
    setLessonToDelete(null)
      }
      catch{
        toast.error('Failed to delete lesson',)
        setLessonToDelete(null)
      }
  }
}
  const canModify = course?.canModify;
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress color="inherit" aria-label="Loading…" />
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h2">An Error occurred while fetching</Typography>
      </Box>
    );
  } else if (course) {
    return (
        <Box component='main' sx={{
  py: 3,
 maxWidth: { xs: 400, sm: 500, md: '100%', lg: '100%'},
  mx: 'auto',
  width: '100%',
  boxSizing: 'border-box',
        }}> 
        <Card elevation={3} sx={{border:'1px solid', borderColor:theme.palette.divider,borderRadius:4}}>
          <CardMedia
            component="img"
            height="260"
            src={`${course.thumbnail_image_path}`}
          />

          <CardContent>
            <Typography variant="h4" sx={{fontWeight:600}}>{course.courseName}</Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              {course.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              <Avatar src={`${course?.createdBy?.profile_image_path}`} />

              <Box>
                <Typography sx={{ fontWeight: "bold" }}>
                  {course.createdBy?.username}
                </Typography>

                <Typography variant="body2">Instructor</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap" }}>
              <Chip label={`${course.totalLessons} Lessons`} />

              <Chip label={`${course.quizzes?.length} Quizzes`} />

              <Chip label={`${course.totalEnrolled} Students`} />

              <Chip
                color={course.isActive ? "success" : "error"}
                label={course.isActive ? "Active" : "Archived"}
              />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap" }}>
              {hasPermission(user, "action:course") && (
                   <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: theme.palette.divider,
       bgcolor: alpha(theme.palette.background.default, 0.5),
        borderRadius: 4,
        px: 3,
        py: 2.5,
        mb: 4,
        display: "flex",
        flexDirection:'column',
        alignItems: "left",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
       
      }}
    >
      <Stack direction='row' spacing={2} sx={{alignItems:'center'}}>
        <Avatar sx={{bgcolor:theme.palette.primary.main,width:44,
          height:44
        }}>
           <AdminPanelSettingsIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{fontWeight:700,}}>Course Controls</Typography>
          <Typography variant="body2" sx={{color:'text.secondary'}}>Manager lessons and quizzes</Typography>
        </Box>
      </Stack>
                    <Stack direction="row" spacing={1} sx={{
 flexWrap:"wrap"
                    }}
                    useFlexGap>
  {(course.canModify || hasPermission(user, "edit all:courses")) && (
    <Button
      startIcon={<EditIcon />}
      onClick={handleEdit}
      variant="outlined"
      size="small"
      sx={{ borderRadius: 2, textTransform: "none" }}
    >
      Edit Course Preview
    </Button>
  )}

  <Button
    startIcon={<DeleteForeverIcon />}
    onClick={() => setConfirm(true)}
    color="error"
    variant="outlined"
    size="small"
    sx={{ borderRadius: 2, textTransform: "none" }}
  >
    Delete Entire Course
  </Button>

  <Button
    startIcon={<PeopleIcon />}
    onClick={() => setEnrolled(!enrolled)}
    color={!enrolled ? "info" : "warning"}
    variant={enrolled ? "contained" : "outlined"}
    size="small"
    sx={{ borderRadius: 2, textTransform: "none" }}
  >
    {enrolled ? "Close List" : "View Enrolled Students"}
  </Button>

  <Button
    startIcon={<PlayLessonIcon />}
    onClick={() =>
      dispatch(
        lessonFormControl({ mode: "add", isLessonFormOpen: true, selectedLesson: null }),
      )
    }
    color="primary"
    variant="contained"
    size="small"
    sx={{ borderRadius: 2, textTransform: "none" }}
  >
    Add a Lesson
  </Button>
</Stack>
                </Paper>
              )}
            </Stack>
          </CardContent>
         <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
  {enrolled &&
    course.enrollments?.map((student,index) => (
      <Slide
      mountOnEnter unmountOnExit
      key={student?.enrollmentId}
      direction="right"
      in={enrolled}
      timeout={500 + index * 100}
    >
      <Paper
        key={student?.enrollmentId}
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
         
        }}
      >
        <Stack direction="row" sx={{alignItems:'center',gap:2, transition: "all 0.6s ease",}}>
        <Avatar src={`${student?.user?.profile_image_path}`} sx={{ width: 52, height: 52 }} />

          <Box sx={{gap:2 ,transition: "all 0.6s ease",}}>
            <Typography sx={{fontWeight:600}}>
              {student?.user?.username}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {student?.user?.collegeName}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Enrolled on{" "}
              {new Date(Number(student?.enrolledAt)).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </Typography>
          </Box>
        </Stack>

        <Chip
          color={student?.isActive ? "success" : "default"}
          label={student?.isActive ? "Active" : "Completed"}
          size="small"
        />
      </Paper>
      </Slide>
    ))}
</Box>
        </Card>
        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
         <Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6">
      Lessons ({course?.lessons?.length})
    </Typography>
  </AccordionSummary>

  <AccordionDetails>
    {isEnrolled || canModify ? (
      <List>
        {[...lessons]
          .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
          .map((lesson) => (
            <ListItem key={lesson?.lessonId}>
              <ListItemText
                primary={`${lesson?.sortOrder}. ${lesson?.lessonName}`}
                secondary={lesson?.description}
              />
              <Box sx={{ width: 400 }}>
                <CardMedia
                  component="video"
                  controls
                  muted
                  src={`${lesson?.videoLink}`}
                />
              </Box>
             {(hasPermission(user,'modify:lessons') || canModify) && <>
             <Button
             startIcon={<EditIcon />}
                onClick={() => handleLessonEdit(lesson as Lesson)}
                variant="outlined"
                sx={{ ml: 2 }}
              >
                Edit
              </Button>
              <Button
               startIcon={<DeleteForeverIcon />}
                onClick={() => handleLessonDialog(lesson as Lesson)}
                variant="contained"
                color="error"
                sx={{ ml: 1 }}
              >
                Delete
              </Button>
             </>} 
            </ListItem>
          ))}
      </List>
    ) : (
      <Typography>Enroll to view lessons</Typography>
    )}
  </AccordionDetails>
</Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Quizzes ({quizzes?.length})</Typography>
            </AccordionSummary>

            <AccordionDetails>
              {isEnrolled || canModify ? (
                <List>
                  {quizzes.map((quiz, index) => (
                    <Box
                      sx={{
                        bgcolor: "primary.light",
                        color: "text.main",
                        borderRadius: 4,
                        p: 2,
                        mb: 2,
                      }}
                      component="form"
                      key={quiz?.quizId}
                    >
                      <Typography>Quiz Number {index + 1}</Typography>
                      <Typography>{quiz?.quizName}</Typography>
                      <List>
                        {quiz?.questions?.map((question) => (
                          <Box key={question?.questionId}>
                            <FormControl>
                              <FormLabel id={`${question?.questionId}`}>
                                {question?.questionText}
                              </FormLabel>
                              <RadioGroup name="radio-buttons-group">
                                {question?.options?.map((option) => (
                                  <FormControlLabel
                                    key={option?.optionId}
                                    value={option?.optionId}
                                    control={<Radio />}
                                    label={option?.optionText}
                                  />
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </Box>
                        ))}
                      </List>
                      <Button
                        variant="contained"
                        type="submit"
                        onClick={() => alert("submitting")}
                      >
                        Submit Answers
                      </Button>
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography>Enroll to view lessons</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
        <Dialog open={confirm} onClose={() => setConfirm(false)}>
          <Paper sx={{ p: 3, minWidth: 320 }}>
            <Typography variant="h6" gutterBottom>
              Delete Course?
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Are you sure you want to delete the{" "}
              <Typography component="span" sx={{ fontWeight: 600 }}>
                {course.courseName}{" "}
              </Typography>{" "}
              course? This action cannot be undone.
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
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
        <Dialog open={lessonDialog} onClose={() => setLessonToDelete(null)}>o
          <Paper sx={{ p: 3, minWidth: 320 }}>
            <Typography variant="h6" gutterBottom>
              Delete this Lesson?
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Are you sure you want to delete the{" "}
              <Typography component="span" sx={{ fontWeight: 600 }}>
                {lessonToDelete?.lessonName}{" "}
              </Typography>{" "}
              lesson? This action cannot be undone.
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Button onClick={() => setLessonToDelete(null)}>Cancel</Button>

              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteForeverIcon />}
                onClick={handleLessonDelete}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        </Dialog>
        <Dialog open={isOpen}>
          <CourseForm />
        </Dialog>
        <Dialog open={lessonForm}>
          <LessonForm />
        </Dialog>

      </Box>
    );
  }
}
