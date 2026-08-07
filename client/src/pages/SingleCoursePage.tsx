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
} from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import useFetchCourseById from "../hooks/useFetchCourseById";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import CourseActionTab from "../components/dashboard/CourseActionTab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
export default function SingleCoursePage() {
  const { id } = useParams();
  const { data, isLoading, error } = useFetchCourseById(id!);
  const course = data;
  const lessons = course?.lessons ?? [];
  const quizzes = course?.quizzes ?? []
  console.log(quizzes)
  const isEnrolled = course?.isEnrolled;
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
        {data.canModify && <CourseActionTab />}
        <Box sx={{ mt: 4,gap:2 }}>
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
              <Typography variant="h6">
               Quizzes ({quizzes?.length})
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              {isEnrolled || canModify ? (
                <List>
                  {quizzes.map((quiz)=>(
                    <Box component='form'>
                    <List>
                      {quiz?.questions?.map(question=>(
                        <Box>
                            <FormControl>
      <FormLabel id={`${question?.questionId}`}>{question?.questionText}</FormLabel>
      <RadioGroup
        name="radio-buttons-group"
      >
        {question?.options?.map(option=>(
           <FormControlLabel key={option?.optionId} value={option?.optionId} control={<Radio />} label={option?.optionText} />
        ))}
        
      </RadioGroup>
    </FormControl>

                        </Box>
                      ))}
                    </List>
                 </Box> ))}
                </List>
              ) : (
                <Typography>Enroll to view lessons</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      </>
    );
  }
}
