import CourseCard from '../components/dashboard/CourseCard';
import useFetchCourses from '../hooks/useFetchCourses';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { Paper, Dialog, Box, TextField, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import CourseForm from '../components/forms/CourseForm';
import { useAppSelector } from '../store/hooks';
import CircularProgress from '@mui/material/CircularProgress';
export default function CoursesPage() {
  const theme = useTheme();
  const { data: courses,isLoading } = useFetchCourses();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const isOpen = useAppSelector((state) => state.form.courses.isAddCourseFormOpen);
  const filteredCourses = courses?.filter(
    (course) =>
      course != null && course.courseName?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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
              '& fieldset': { border: 'none' },
            },
          }}
        />
      </Paper>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          overflow: 'auto',
          gap: 3,
          mt: 3,
        }}
      >
        {filteredCourses?.map((course) => {
          return <CourseCard key={course?.courseId} course={course!} />;
        })}
      </Box>
      <Dialog open={isOpen}>
        <CourseForm />
      </Dialog>
    </>
  );
}
