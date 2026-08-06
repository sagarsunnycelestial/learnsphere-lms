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
export default function CoursesCreated() {
  const { data: profile } = useFetchProfile();
  const courses = profile?.courses;
  if (courses?.length === 0) {
    return <Typography> No courses created yet</Typography>;
  } else
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Courses</TableCell>
              <TableCell>Course Id</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses?.map((course) => (
              <TableRow key={course?.courseId}>
                <TableCell>{course?.courseName}</TableCell>
                <TableCell>{course?.courseId}</TableCell>
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
