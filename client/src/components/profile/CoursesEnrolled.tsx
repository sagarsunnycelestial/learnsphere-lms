import {
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
} from "@mui/material";
import useFetchProfile from "../../hooks/useFetchProfile";
export default function CoursesEnrolled() {
  const { data: profile } = useFetchProfile();
  const enrollments = profile?.enrollments;
  if (enrollments?.length === 0) {
    return <Typography> No courses enrolled yet</Typography>;
  } else
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Courses</TableCell>
              <TableCell>Enrolled on</TableCell>
              <TableCell>Enrollment Id</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments?.map((course) => (
              <TableRow key={course?.enrollmentId}>
                <TableCell>{course?.course?.courseName}</TableCell>
                <TableCell>{course?.enrolledAt}</TableCell>
                <TableCell>{course?.enrollmentId}</TableCell>
                <TableCell>
                  {course?.isActive === true ? "Active" : "Completed"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
}
