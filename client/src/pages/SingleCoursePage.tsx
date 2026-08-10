import { useParams } from "react-router";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
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
import PlayLessonIcon from "@mui/icons-material/PlayLesson";
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
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { alpha } from "@mui/material/styles";
import useCoursesCRUD from "../hooks/useCoursesCRUD";
import {
  addCourseFormControl,
  lessonFormControl,
  quizFormControl,
  questionFormControl,
  resultDisplay
} from "../store/slices/formSlice";
import CourseForm from "../components/forms/CourseForm";
import useLessonsCRUD from "../hooks/useLessonsCRUD";
import { Lesson } from "../types/types";
import { toast } from "react-toastify";
import QuizIcon from "@mui/icons-material/Quiz";
import LessonForm from "../components/forms/LessonForm";
import useQuizzesRUD from "../hooks/useQuizzesCRUD";
import QuizForm from "../components/forms/QuizForm";
import QuestionForm from "../components/forms/QuestionForm";
import QuizResultDisplay from "../components/course/QuizResultDisplay";
export default function SingleCoursePage() {
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>();
  const lessonDialog = Boolean(lessonToDelete);
  const [enrolled, setEnrolled] = useState(false);
  const { deleteLesson } = useLessonsCRUD();
  const { id } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, error } = useFetchCourseById(id!);
  const course = data;
  const lessons = course?.lessons ?? [];
  const quizzes = course?.quizzes ?? [];
  const dispatch = useAppDispatch();
  const {submitQuizAnswers} = useQuizzesRUD();
  const isOpen = useAppSelector(
    (state) => state.form.courses.isAddCourseFormOpen,
  );
  const lessonForm = useAppSelector(
    (state) => state.form.lessons.isLessonFormOpen,
  );
  const submitted = useAppSelector(state=>state.form.results.submitted)
  const quizForm = useAppSelector(state=>state.form.quizzes.isQuizFormOpen)
  const questionForm = useAppSelector(state=>state.form.questions.isQuestionFormOpen)
  const theme = useTheme();
  const { deleteCourse } = useCoursesCRUD();
  const [confirm, setConfirm] = useState<boolean>(false);
  console.log(quizzes);
  const isEnrolled = course?.isEnrolled;
  const handleDelete = async () => {
    if (course?.courseId) {
      const res = await deleteCourse({ courseId: course.courseId });
      toast.success(res?.message);
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
  const handleLessonEdit = (lesson: Lesson) => {
    console.log(lesson.lessonId);
    dispatch(
      lessonFormControl({
        mode: "edit",
        isLessonFormOpen: true,
        selectedLesson: { ...lesson, courseId: course?.courseId },
      }),
    );
  };
  const handleLessonDialog = (lesson: Lesson) => {
    setLessonToDelete(lesson);
  };
  const handleLessonDelete = async () => {
    if (course?.courseId) {
      try {
        const res = await deleteLesson({
          input: {
            courseId: course.courseId,
            lessonId: lessonToDelete?.lessonId,
          },
        });
        toast.success(res?.message);
        setLessonToDelete(null);
      } catch {
        toast.error("Failed to delete lesson");
        setLessonToDelete(null);
      }
    }
  };
  const canModify = course?.canModify;
 async function handleQuizSubmit(e: React.SubmitEvent<HTMLFormElement>, quizId?: string){
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
   console.log(formData)

      // const answerList = data.reduce((acc,q)=>{
      //   acc.push({questionId:q.key,selectionOption:q.value})
      // },[])
    const answerList = Array.from(formData.entries(),([questionId,selectionOption])=>({questionId,selectionOption:selectionOption as string}))
    console.log({input:{quizId,answerList}})
    try{
      const res = await submitQuizAnswers({input:{quizId,answerList}})
      toast.success(res?.message)
      dispatch(resultDisplay({submitted:true,quizResult:res}))
      console.log(res)
    }catch{
      toast.error("Failed to submit answers");
    }
 }
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
      <Paper
        elevation={0}
        sx={{
          py: 3,
          maxWidth: { xs: 400, sm: 500, md: "100%", lg: "100%" },
          mx: "auto",
          width: "100%",
          boxSizing: "border-box",
         
        
          bgcolor: alpha(theme.palette.background.default, 0.5),
          borderRadius: 4,
        }}
      >
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: theme.palette.divider,
            borderRadius: 4,

          }}
        >
          <CardMedia
            component="img"
            height="260"
            src={`${course.thumbnail_image_path}`}
          />
          <Divider />

          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {course.courseName}
            </Typography>

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
           
          
              
              {hasPermission(user, "action:course") && (<>
              <Divider sx={{mt:3}} />
                  <Stack direction="row" spacing={2} sx={{  flexWrap: "wrap",mt:3 }}>
                     
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
                    flexDirection: "column",
                    alignItems: "left",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "center" }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 44,
                        height: 44,
                      }}
                    >
                      <AdminPanelSettingsIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Course Controls
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Manager lessons and quizzes
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      flexWrap: "wrap",
                    }}
                    useFlexGap
                  >
                    {(course.canModify ||
                      hasPermission(user, "edit all:courses")) && (
                      <Button
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          width: 220,
                        }}
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
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        width: 220,
                      }}
                    >
                      Delete Entire Course
                    </Button>
                    <Button
                      startIcon={<PlayLessonIcon />}
                      onClick={() =>
                        dispatch(
                          lessonFormControl({
                            mode: "add",
                            isLessonFormOpen: true,
                            selectedLesson: null,
                          }),
                        )
                      }
                      color="primary"
                      variant="contained"
                      size="small"
                      sx={{ borderRadius: 2, width: 220 }}
                    >
                      Add a Lesson
                    </Button>
                <Button
  startIcon={<QuizIcon />}
  onClick={() =>
    dispatch(
      quizFormControl({
        mode: "add",
        isQuizFormOpen: true,
        selectedQuiz: null,
      }),
    )
  }
  color="primary"
  variant="contained"
  size="small"
  sx={{ borderRadius: 2, width: 220 }}
>
  Add a Quiz
</Button>
                    <Button
                      startIcon={<PeopleIcon />}
                      onClick={() => setEnrolled(!enrolled)}
                      color={!enrolled ? "info" : "warning"}
                      variant={enrolled ? "contained" : "outlined"}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        width: 220,
                      }}
                    >
                      {enrolled ? "Close List" : "View Enrolled Students"}
                    </Button>
                  </Stack>
                </Paper>   </Stack></>
              )}
         
          </CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, px: 3,py:1 }}>
  {course.enrollments && course.enrollments.length > 0 &&(
    <>
     {enrolled && <Typography variant="subtitle1" sx={{ px: 1, fontWeight: 600 }}>
      <Divider sx={{mb:2}}/>
       Enrolled Students ({course.enrollments?.length})
      </Typography> } 
      {course.enrollments?.map((student, index) => (
        
        <Slide
          mountOnEnter
          unmountOnExit
          key={student?.enrollmentId}
          direction="right"
          in={enrolled}
          timeout={500 + index * 100}
        >
          <Paper
            key={student?.enrollmentId}
            elevation={0}
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: theme.palette.background.default,
              borderRadius: 2,
              border: "1px solid",
              borderColor: theme.palette.divider,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                gap: 2,
                transition: "all 0.6s ease",
              }}
            >
              <Avatar
                src={`${student?.user?.profile_image_path}`}
                sx={{ width: 48, height: 48 }}
              />

              <Box sx={{ transition: "all 0.6s ease" }}>
                <Typography sx={{ fontWeight: 600 }}>
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
                    },
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
    </>
  )}
</Box>
        </Card>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3}}>
          <Accordion sx={{borderRadius:4,border:'1px solid',borderColor:theme.palette.divider,boxShadow:'none'}}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{fontWeight:700}}>
                Lessons
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              {isEnrolled || canModify ? (
                <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
                <List>
                  {[...lessons]
                    .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
                    .map((lesson,index) => (
                      <Paper
                key={lesson?.lessonId}
                elevation={0}
                sx={{
                  m:1,
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: theme.palette.divider,
                  bgcolor: theme.palette.background.default,
                }}
              >
                      <Stack
                  direction="row"
                  spacing={2}
                 sx={{
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 2,
  }}
                >

                        <ListItemText
                        sx={{flex:" 1 1 auto",minWidth:200}}
                          primary={`${index + 1}. ${lesson?.lessonName}`}
                          secondary={lesson?.description}
                        />
                        <Box sx={{ width: {xs:"100%",sm:300,md:400} }}>
                          <CardMedia
                            component="video"
                            controls
                            muted
                            src={`${lesson?.videoLink}`}
                            sx={{borderRadius:1}}
                          />
                        </Box>
                        {(hasPermission(user, "modify:lessons") ||
                          canModify) && (
                          <Stack direction='row' spacing={2}>
                            <Button
                              startIcon={<EditIcon />}
                              onClick={() => handleLessonEdit(lesson as Lesson)}
                              variant="outlined"
                              size="small"
                              sx={{ ml: 2 }}
                            >
                              Edit
                            </Button>
                            <Button
                              startIcon={<DeleteForeverIcon />}
                              onClick={() =>
                                handleLessonDialog(lesson as Lesson)
                              }
                              variant="contained"
                              color="error"
                              size="small"
                              sx={{ ml: 1 }}
                            >
                              Delete
                            </Button>
                          </Stack>
                        )}
                   </Stack>
                  </Paper>  ))}
                </List>
                </Box>
              ) : (
                <Typography>Enroll to view lessons</Typography>
              )}
            </AccordionDetails>
          </Accordion>
           <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h6">Quizzes</Typography>
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
              onSubmit={(e) => handleQuizSubmit(e, quiz?.quizId as string)}
            >
              <input type="hidden" name="quizId" value={quiz?.quizId ?? ""} />

              <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 2,
                  mb: 1,
                }}
              >
                <Box>
                  <Typography>Quiz Number {index + 1}</Typography>
                  <Typography>{quiz?.quizName}</Typography>
                </Box>

                {(hasPermission(user, "modify:quizzes") || canModify) && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      type="button"
                      startIcon={<AddIcon />}
                      onClick={() =>
                        dispatch(
                          questionFormControl({
                            mode: "add",
                            isQuestionFormOpen: true,
                            quizId: quiz?.quizId ?? null,
                          }),
                        )
                      }
                      variant="outlined"
                      size="small"
                    >
                      Add Question
                    </Button>
                    <Button
                      type="button"
                      startIcon={<DeleteForeverIcon />}
                      variant="contained"
                      color="error"
                      size="small"
                    >
                      Delete Quiz
                    </Button>
                  </Stack>
                )}
              </Stack>

              <List>
                {quiz?.questions?.map((question) => (
                  <Box key={question?.questionId} sx={{ mb: 1 }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <FormControl>
                        <FormLabel id={`${question?.questionId}`}>
                          {question?.questionText}
                        </FormLabel>
                        <RadioGroup name={`${question?.questionId}`}>
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

                      {(hasPermission(user, "modify:quizzes") || canModify) && (
                        <Button
                          type="button"
                          startIcon={<DeleteForeverIcon />}
                          variant="outlined"
                          color="error"
                          size="small"
                        >
                          Delete Question
                        </Button>
                      )}
                    </Stack>
                  </Box>
                ))}
              </List>

              <Button variant="contained" type="submit" disabled ={!isEnrolled}>
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
        <Dialog open={lessonDialog} onClose={() => setLessonToDelete(null)}>
          o
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
        <Dialog
          open={isOpen}
          onClose={() =>
            dispatch(addCourseFormControl({ isAddCourseFormOpen: false }))
          }
        >
          <CourseForm />
        </Dialog>
        <Dialog
          open={lessonForm}
          onClose={() => {
            setLessonToDelete(null);
            dispatch(lessonFormControl({ isLessonFormOpen: false }));
          }}
        >
          <LessonForm />
        </Dialog>
          <Dialog
    open={quizForm}
    onClose={() =>
      dispatch(quizFormControl({ isQuizFormOpen: false, selectedQuiz: null }))
            }
         >
   <QuizForm />
        </Dialog>
           <Dialog
    open={questionForm}
    onClose={() =>
      dispatch(quizFormControl({ isQuizFormOpen: false, selectedQuiz: null }))
            }
         >
   <QuestionForm />
        </Dialog>
              <Dialog
    open={submitted}
    onClose={() =>
      dispatch(resultDisplay({ submitted: false, quizResult: null }))
            }
         >
   <QuizResultDisplay />
        </Dialog>
      </Paper>
    );
  }
}
