import { useParams } from 'react-router';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
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
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import { hasPermission } from '../permissions/auth';

import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import useFetchCourseById from '../hooks/useFetchCourseById';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import useCoursesCRUD from '../hooks/useCoursesCRUD';
import {
  addCourseFormControl,
  lessonFormControl,
  quizFormControl,
  questionFormControl,
  resultDisplay,
} from '../store/slices/formSlice';
import CourseForm from '../components/forms/CourseForm';
import useLessonsCRUD from '../hooks/useLessonsCRUD';
import { Lesson } from '../types/types';
import { toast } from 'react-toastify';
import QuizIcon from '@mui/icons-material/Quiz';
import LessonForm from '../components/forms/LessonForm';
import useQuizzesRUD from '../hooks/useQuizzesCRUD';
import QuizForm from '../components/forms/QuizForm';
import QuestionForm from '../components/forms/QuestionForm';
import QuizResultDisplay from '../components/course/QuizResultDisplay';
export default function SingleCoursePage() {
  const { deleteLesson } = useLessonsCRUD();
  const { id } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, error } = useFetchCourseById(id!);
  const course = data;
  const lessons = course?.lessons ?? [];
  const quizzes = course?.quizzes ?? [];
  const dispatch = useAppDispatch();
  const { submitQuizAnswers, deleteQuestion, deleteQuiz } = useQuizzesRUD();
  const isOpen = useAppSelector((state) => state.form.courses.isAddCourseFormOpen);
  const lessonForm = useAppSelector((state) => state.form.lessons.isLessonFormOpen);
  const submitted = useAppSelector((state) => state.form.results.submitted);
  const quizForm = useAppSelector((state) => state.form.quizzes.isQuizFormOpen);
  const questionForm = useAppSelector((state) => state.form.questions.isQuestionFormOpen);
  const theme = useTheme();
  const { deleteCourse } = useCoursesCRUD();
  const [confirm, setConfirm] = useState<boolean>(false);
  console.log(quizzes);
  const isEnrolled = course?.isEnrolled;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonDialog, setLessonDialog] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>, lesson: Lesson) => {
    setAnchorEl(event.currentTarget);
    setSelectedLesson(lesson);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedLesson(null);
  };

  const handleLessonEdit = () => {
    if (!selectedLesson) return;

    dispatch(
      lessonFormControl({
        mode: 'edit',
        isLessonFormOpen: true,
        selectedLesson: {
          ...selectedLesson,
          courseId: course?.courseId,
        },
      })
    );

    handleClose();
  };

  const handleLessonDialog = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setAnchorEl(null);
    setLessonDialog(true);
  };

  const handleLessonDelete = async () => {
    if (!course?.courseId || !selectedLesson?.lessonId) {
      return;
    }

    try {
      const res = await deleteLesson({
        input: {
          courseId: course.courseId,
          lessonId: selectedLesson.lessonId,
        },
      });

      toast.success(res?.message);
    } catch {
      toast.error('Failed to delete lesson');
    } finally {
      setLessonDialog(false);
      setSelectedLesson(null);
    }
  };
  const handleDelete = async () => {
    if (course?.courseId) {
      const res = await deleteCourse({ courseId: course.courseId });
      toast.success(res?.message);
    }
  };
  const handleEdit = () => {
    dispatch(
      addCourseFormControl({
        mode: 'edit',
        isAddCourseFormOpen: true,
        selectedcourse: course,
      })
    );
  };

  async function handleQuizDelete(quizId: string) {
    try {
      const res = await deleteQuiz({ quizId });
      if (res?.message) toast.success(res.message);
    } catch {
      toast.error('Failed to delete quiz');
    }
  }

  async function handleQuestionDelete(quizId: string, questionId: string) {
    try {
      const res = await deleteQuestion({ quizId, questionId });
      if (res?.message) toast.success(res.message);
    } catch {
      toast.error('Failed to delete quiz');
    }
  }
  const canModify = course?.canModify;
  async function handleQuizSubmit(e: React.SubmitEvent<HTMLFormElement>, quizId?: string) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData);

    // const answerList = data.reduce((acc,q)=>{
    //   acc.push({questionId:q.key,selectionOption:q.value})
    // },[])
    const answerList = Array.from(formData.entries(), ([questionId, selectionOption]) => ({
      questionId,
      selectionOption: selectionOption as string,
    }));
    console.log({ input: { quizId, answerList } });
    try {
      const res = await submitQuizAnswers({ input: { quizId, answerList } });
      toast.success(res?.message);
      dispatch(resultDisplay({ submitted: true, quizResult: res }));
      console.log(res);
    } catch {
      toast.error('Failed to submit answers');
    }
  }
  if (isLoading) {
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
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
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
          maxWidth: { xs: 400, sm: 500, md: '100%', lg: '100%' },
          mx: 'auto',
          width: '100%',
          boxSizing: 'border-box',

          bgcolor: alpha(theme.palette.background.default, 0.5),
          borderRadius: 4,
        }}
      >
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: theme.palette.divider,
            borderRadius: 4,
          }}
        >
          <CardMedia component="img" height="260" src={`${course.thumbnail_image_path}`} />
          <Divider />

          <CardContent>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, overflowWrap: 'anywhere', wordBreak: 'break-word' }}
            >
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
                alignItems: 'center',
              }}
            >
              <Avatar src={`${course?.createdBy?.profile_image_path}`} />

              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>{course.createdBy?.username}</Typography>

                <Typography variant="body2">Instructor</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: 'wrap' }}>
              <Chip label={`${course.totalLessons} Lessons`} />

              <Chip label={`${course.quizzes?.length} Quizzes`} />

              <Chip label={`${course.totalEnrolled} Students`} />

              <Chip
                color={course.isActive ? 'success' : 'error'}
                label={course.isActive ? 'Active' : 'Archived'}
              />
            </Stack>

            {hasPermission(user, 'action:course') && (
              <>
                <Divider sx={{ mt: 3 }} />
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', mt: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      border: '1px solid',
                      borderColor: theme.palette.divider,
                      bgcolor: alpha(theme.palette.background.default, 0.5),
                      borderRadius: 4,
                      px: 3,
                      py: 2.5,
                      mb: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'left',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 2,
                      flexGrow: 1,
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
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
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Manager lessons and quizzes
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        flexWrap: 'wrap',
                      }}
                      useFlexGap
                    >
                      {(course.canModify || hasPermission(user, 'edit all:courses')) && (
                        <Button
                          startIcon={<EditIcon />}
                          onClick={handleEdit}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
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
                          textTransform: 'none',
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
                              mode: 'add',
                              isLessonFormOpen: true,
                              selectedLesson: null,
                            })
                          )
                        }

                        variant="contained"
                        size="small"
                        sx={{ borderRadius: 2, width: 220, textTransform: 'none' }}
                      >
                        Add a Lesson
                      </Button>
                      <Button
                        startIcon={<QuizIcon />}
                        onClick={() =>
                          dispatch(
                            quizFormControl({
                              mode: 'add',
                              isQuizFormOpen: true,
                              selectedQuiz: null,
                            })
                          )
                        }
                        color="primary"
                        variant="contained"
                        size="small"
                        sx={{ borderRadius: 2, width: 220, textTransform: 'none' }}
                      >
                        Add a Quiz
                      </Button>
                      {course.enrollments?.length !==0 && (  <Button
                        startIcon={<PeopleIcon />}
                        onClick={() => setEnrolled(!enrolled)}
                        color={!enrolled ? 'info' : 'warning'}
                        variant={enrolled ? 'contained' : 'outlined'}
                        size="small"
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          width: 220,
                        }}
                      >
                        {enrolled ? 'Close List' : 'View Enrolled Students'}
                      </Button>)}
                    
                    </Stack>
                  </Paper>{' '}
                </Stack>
              </>
            )}
          </CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, px: 3, py: 1 }}>
            {course.enrollments && course.enrollments.length > 0 && (
              <>
                {enrolled && (
                  <Typography variant="subtitle1" sx={{ px: 1, fontWeight: 600 }}>
                    <Divider sx={{ mb: 2 }} />
                    Enrolled Students ({course.enrollments?.length})
                  </Typography>
                )}
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
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: 'center',
                          gap: 2,
                          transition: 'all 0.6s ease',
                        }}
                      >
                        <Avatar
                          src={`${student?.user?.profile_image_path}`}
                          sx={{ width: 48, height: 48 }}
                        />

                        <Box sx={{ transition: 'all 0.6s ease' }}>
                          <Typography sx={{ fontWeight: 600 }}>
                            {student?.user?.username}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            {student?.user?.collegeName}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            Enrolled on{' '}
                            {new Date(Number(student?.enrolledAt)).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        color={student?.isActive ? 'success' : 'default'}
                        label={student?.isActive ? 'Active' : 'Completed'}
                        size="small"
                      />
                    </Paper>
                  </Slide>
                ))}
              </>
            )}
          </Box>
        </Card>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Accordion
            sx={{
              borderRadius: 4,
              border: '1px solid',
              borderColor: theme.palette.divider,
              boxShadow: 'none',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Lessons
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              {isEnrolled || canModify ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <List>
                    {[...lessons]
                      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
                      .map((lesson, index) => (
                        <Paper
                          key={lesson?.lessonId}
                          elevation={0}
                          sx={{
                            mb: 2,
                            overflow: 'hidden',
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: theme.palette.primary.light,
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.10)',
                              borderColor: 'primary.light',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              px: 2.5,
                              py: 2,
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'space-between',
                              gap: 2,
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                variant="subtitle1"

                                sx={{
                                  fontWeight: 600,
                                  color: 'text.primary',
                                  mb: 0.5,
                                }}
                              >
                                {index + 1}. {lesson?.lessonName}
                              </Typography>
                            </Box>

                            {(hasPermission(user, 'modify:lessons') || canModify) && (
                              <>
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleClick(e, lesson as Lesson)}
                                  sx={{
                                    flexShrink: 0,
                                    bgcolor: 'action.hover',
                                    '&:hover': {
                                      bgcolor: 'action.selected',
                                    },
                                  }}
                                >
                                  <MoreHorizIcon />
                                </IconButton>
                                <Menu
                                  anchorEl={anchorEl}
                                  open={
                                    Boolean(anchorEl) &&
                                    selectedLesson?.lessonId === lesson?.lessonId
                                  }
                                  onClose={handleClose}
                                  slotProps={{
                                    paper: {
                                      sx: {
                                        borderRadius: 2,
                                        minWidth: 140,
                                        mt: 1,
                                      },
                                    },
                                  }}
                                >
                                  <MenuItem onClick={() => handleLessonDialog(lesson as Lesson)}>
                                    <DeleteForeverIcon
                                      sx={{
                                        mr: 1,
                                        color: 'error.main',
                                      }}
                                    />
                                    Delete
                                  </MenuItem>

                                  <MenuItem onClick={() => handleLessonEdit()}>
                                    <EditIcon sx={{ mr: 1 }} />
                                    Edit
                                  </MenuItem>
                                </Menu>
                              </>
                            )}
                          </Box>

                          <Box
                            sx={{
                              p: { xs: 1.5, sm: 2 },
                              bgcolor: 'grey.50',
                              display: 'flex',
                              alignItems: 'flex-start',
                            }}
                          >
                            {lesson?.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  lineHeight: 1.5,
                                  flexGrow: 1,
                                }}
                              >
                                {lesson.description}
                              </Typography>
                            )}
                            <Box
                              sx={{
                                width: '100%',
                                maxWidth: 700,
                                mx: 'auto',
                                overflow: 'hidden',
                                borderRadius: 2,
                                bgcolor: 'common.black',
                                aspectRatio: '16 / 9',
                              }}
                            >
                              <CardMedia
                                component="video"
                                controls
                                muted
                                src={`${lesson?.videoLink}`}
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                  </List>
                </Box>
              ) : (
                <Typography>Enroll to view lessons</Typography>
              )}
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Quizzes
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              {isEnrolled || canModify ? (
                <List>
                  {quizzes.map((quiz) => (
                    <Box
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'text.main',
                        borderRadius: 4,
                        p: 2,
                        mb: 2,
                      }}
                      component="form"
                      key={quiz?.quizId}
                      onSubmit={(e) => handleQuizSubmit(e, quiz?.quizId as string)}
                    >
                      <input type="hidden" name="quizId" value={quiz?.quizId ?? ''} />

                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography>{quiz?.quizName}</Typography>
                        </Box>

                        {(hasPermission(user, 'modify:quizzes') || canModify) && (
                          <Stack direction="row" spacing={2}>
                            <Button
                              type="button"
                              startIcon={<AddIcon />}
                              onClick={() =>
                                dispatch(
                                  questionFormControl({
                                    mode: 'add',
                                    isQuestionFormOpen: true,
                                    quizId: quiz?.quizId ?? null,
                                  })
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
                              onClick={() => handleQuizDelete(quiz?.quizId as string)}
                            >
                              Delete Quiz
                            </Button>
                          </Stack>
                        )}
                      </Stack>

                      <List>
                        {quiz?.questions?.map((question) => (
                          <Box
                            key={question?.questionId}
                            sx={{
                              mb: 2,
                              border: '1px solid',
                              p: 2,
                              borderRadius: 4,
                              bgcolor: theme.palette.background.paper,
                              borderColor: theme.palette.divider,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              sx={{
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                gap: 2,
                              }}
                            >
                              <FormControl>
                                <FormLabel sx={{ fontWeight: 600 }} id={`${question?.questionId}`}>
                                  {question?.questionText}
                                </FormLabel>

                                <RadioGroup name={`${question?.questionId}`} row={false}>
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

                              {(hasPermission(user, 'modify:quizzes') || canModify) && (
                                <Button
                                  type="button"
                                  startIcon={<DeleteForeverIcon />}
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() =>
                                    handleQuestionDelete(
                                      quiz.quizId as string,
                                      question?.questionId as string
                                    )
                                  }
                                >
                                  Delete Question
                                </Button>
                              )}
                            </Stack>
                          </Box>
                        ))}
                      </List>

                      <Button variant="contained" type="submit" disabled={!isEnrolled}>
                        Submit Answers
                      </Button>
                    </Box>
                  ))}
                </List>
              ) : quizzes.length == 0 ? (
                <Typography>No Quizzes to Show</Typography>
              ) : (
                <Typography>Enroll to view Quizzes</Typography>
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
        <Dialog
          open={lessonDialog}
          onClose={() => {
            setSelectedLesson(null);
            setLessonDialog(false);
          }}
        >
          <Paper sx={{ p: 3, minWidth: 320 }}>
            <Typography variant="h6" gutterBottom>
              Delete this Lesson?
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Are you sure you want to delete the{' '}
              <Typography component="span" sx={{ fontWeight: 600 }}>
                {selectedLesson?.lessonName}{' '}
              </Typography>{' '}
              lesson? This action cannot be undone.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <Button
                onClick={() => {
                  setLessonDialog(false);
                  setSelectedLesson(null);
                }}
              >
                Cancel
              </Button>

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
        >
          <CourseForm />
        </Dialog>
        <Dialog
          open={lessonForm}
        >
          <LessonForm />
        </Dialog>
        <Dialog
          open={quizForm}
      
        >
          <QuizForm />
        </Dialog>
        <Dialog
          open={questionForm}
        >
          <QuestionForm />
        </Dialog>
        <Dialog
          open={submitted}
        >
          <QuizResultDisplay />
        </Dialog>
      </Paper>
    );
  }
}
