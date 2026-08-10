import {
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Chip,
} from "@mui/material";
import useFetchProfile from "../../hooks/useFetchProfile";
export default function CoursesEnrolled() {
  const { data: profile } = useFetchProfile();
  const enrollments = profile?.enrollments;
  if (enrollments?.length === 0) {
    return <Typography>No courses enrolled yet</Typography>;
  } else
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Courses</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Enrolled on</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Enrollment Id</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments?.map((course) => (
              <TableRow key={course?.enrollmentId}>
                <TableCell sx={{ fontWeight: 600 }}>
                  {course?.course?.courseName}
                </TableCell>
                <TableCell>{course?.enrolledAt}</TableCell>
                <TableCell>{course?.enrollmentId}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={course?.isActive ? "success" : "default"}
                    label={course?.isActive ? "Active" : "Completed"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
}