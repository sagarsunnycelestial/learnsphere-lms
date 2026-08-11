import {
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Chip,
} from '@mui/material';
import useFetchProfile from '../../hooks/useFetchProfile';
export default function CoursesCreated() {
  const { data: profile } = useFetchProfile();
  const courses = profile?.courses;
  if (courses?.length === 0) {
    return <Typography>No courses created yet</Typography>;
  } else
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Courses</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Course Id</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses?.map((course) => (
              <TableRow key={course?.courseId}>
                <TableCell sx={{ fontWeight: 600 }}>{course?.courseName}</TableCell>
                <TableCell>{course?.courseId}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={course?.isActive ? 'success' : 'default'}
                    label={course?.isActive ? 'Active' : 'Completed'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
}
