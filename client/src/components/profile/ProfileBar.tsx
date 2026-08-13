import { Paper, Tab, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { changeTab } from '../../store/slices/profileSlice';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CoursesEnrolled from './CoursesEnrolled';
import QuizResults from './QuizResults';
import CoursesCreated from './CoursesCreated';

export default function ProfileBar() {
  const tab = useAppSelector((state) => state.profile.currentTab);
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.user.role);
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: theme.palette.divider,
        px: 2,
        py: 1,
        borderRadius: 4,
      }}
    >
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={(_e, value) => dispatch(changeTab(value))}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab
                value="1"
                label={role === 'Student' ? 'Courses Enrolled' : 'Courses Created By'}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              />
              {role === 'Student' && (
                <Tab
                  value="2"
                  label="Quiz Results"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
              )}
            </TabList>
          </Box>

          <TabPanel value="1">
            {role === 'Student' && <CoursesEnrolled />}
            {(role === 'Instructor' || role ==='Admin') && <CoursesCreated />}
          </TabPanel>

          {role === 'Student' && (
            <TabPanel value="2">
              <QuizResults />
            </TabPanel>
          )}
        </TabContext>
      </Box>
    </Paper>
  );
}
