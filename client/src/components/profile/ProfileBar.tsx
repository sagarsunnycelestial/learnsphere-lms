import { Stack, Divider, Paper, Tab, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  changeTab,
} from "../../store/slices/profileSlice";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CoursesEnrolled from "./CoursesEnrolled";
import QuizResults from "./QuizResults";
import CoursesCreated from "./CoursesCreated";
export default function ProfileBar() {

  const tab = useAppSelector((state) => state.profile.currentTab);
 
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.user.role);
  const theme = useTheme();

  console.log(theme);
  return (
    <>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: theme.palette.background.paper,
          px: 2,
          borderRadius: 4,
          py:1,
          display: "flex",
        }}
      >
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={(_e, value) => dispatch(changeTab(value))}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab
                  value="1"
                  label={
                    role === "Student"
                      ? "Courses Enrolled"
                      : "Courses Created By"
                  }
                />

                {role === "Student" && <Tab value="2" label="Quiz Results" />}
              </TabList>
            </Box>
            <TabPanel value="1">
              {role === "Student" && <CoursesEnrolled />}
              {role === 'Instructor' && <CoursesCreated /> }
            </TabPanel>

            {role === "Student" && (
              <TabPanel value="2">
                {role === "Student" && <QuizResults />}
              </TabPanel>
            )}
          </TabContext>
        </Box>

        <Stack direction="row" spacing={2}>

          <Divider orientation="vertical" flexItem />
         
        </Stack>
      </Paper>
   
    </>
  );
}
