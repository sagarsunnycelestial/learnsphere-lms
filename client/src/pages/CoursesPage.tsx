import CourseCard from '../components/dashboard/CourseCard';
import useFetchCourses from '../hooks/useFetchCourses';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Paper,
  Dialog,
  Box,
  TextField,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import CourseForm from '../components/forms/CourseForm';
import { useAppSelector } from '../store/hooks';
import CircularProgress from '@mui/material/CircularProgress';

type CourseStatus = 'all' | 'active' | 'inactive';

export default function CoursesPage() {
  const theme = useTheme();

  const [status, setStatus] = useState<CourseStatus>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const isOpen = useAppSelector(
    (state) => state.form.courses.isAddCourseFormOpen
  );

  const { data: courses, isLoading } = useFetchCourses({
    filter: {
      status: status === 'all' ? undefined : status,
    },
  });

  const filteredCourses = courses?.filter(
    (course) =>
      course != null &&
      course.courseName?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (
    _: React.MouseEvent<HTMLElement>,
    newStatus: CourseStatus | null
  ) => {
    if (newStatus !== null) {
      setStatus(newStatus);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

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

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: theme.palette.divider,
          borderRadius: 4,
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          size="small"
          value={search}
          onChange={handleSearch}
          placeholder="Search courses..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: 320,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '& fieldset': {
                border: 'none',
              },
            },
          }}
        />
        <ToggleButtonGroup
          value={status}
          exclusive
          onChange={handleStatusChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 2,
              borderRadius: 2,
              textTransform: 'none',
            },
            gap: 2,
          }}
        >
          <ToggleButton value="all">All</ToggleButton>

          <ToggleButton value="active">Active</ToggleButton>

          <ToggleButton value="inactive">Inactive</ToggleButton>
        </ToggleButtonGroup>
      </Paper>
      {(!filteredCourses || filteredCourses.length === 0) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <Typography variant="h4">Nothing to show</Typography>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          overflow: 'auto',
          gap: 3,
          alignItems: 'flex-start',
          justifyContent: { xs: 'center', sm: 'flex-start' },
          mt: 3,
        }}
      >
        {filteredCourses?.map((course) => (
          <CourseCard key={course?.courseId} course={course!} />
        ))}
      </Box>

      <Dialog open={isOpen}>
        <CourseForm />
      </Dialog>
    </>
  );
}
