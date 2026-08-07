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
import useCoursesCRUD from "../hooks/useCoursesCRUD";
import { addCourseFormControl } from "../store/slices/formSlice";
import CourseForm from "../components/forms/CourseForm";
export default function SingleCoursePage() {
  const [enrolled, setEnrolled] = useState(false);
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
  const theme = useTheme();
  const { deleteCourse } = useCoursesCRUD();
  const [confirm, setConfirm] = useState<boolean>(false);
  console.log(quizzes);
  const isEnrolled = course?.isEnrolled;
  const handleDelete = async () => {
    if (course?.courseId) await deleteCourse({ courseId: course.courseId });
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
      <>
        {/* {data.canModify && (
          <Box sx={{ mb: 2 }}>
            <CourseActionTab />
          </Box>
        )} */}
        <Card elevation={3} sx={{}}>
          <CardMedia
            component="img"
            height="260"
            src={`${course.thumbnail_image_path}`}
          />

          <CardContent>
            <Typography variant="h4">{course.courseName}</Typography>

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
                    borderColor: theme.palette.background.paper,
                    px: 2,
                    py: 1,
                    borderRadius: 4,
                    bgcolor: theme.palette.background.default,
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingBottom: 5,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1,
                        pb: 2,
                      }}
                    >
                      Course Controls
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      {(course.canModify ||
                        hasPermission(user, "edit all:courses")) && (
                        <Button
                          startIcon={<EditIcon />}
                          onClick={handleEdit}
                          variant="outlined"
                          size="small"
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
                      >
                        Delete Entire Course
                      </Button>
                      <Button
                        startIcon={<PeopleIcon />}
                        onClick={() => setEnrolled(!enrolled)}
                        color={!enrolled ? "info" : "warning"}
                        variant={enrolled ? "contained" : "outlined"}
                        size="small"
                      >
                        {enrolled ? "Close List" : "View Enrolled Students"}
                      </Button>
                    </Stack>
                  </Box>
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
                            autoPlay
                            muted
                            src={`${lesson?.videoLink}`}
                          />
                        </Box>
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
        <Dialog open={isOpen}>
          <CourseForm />
        </Dialog>
      </>
    );
  }
}
