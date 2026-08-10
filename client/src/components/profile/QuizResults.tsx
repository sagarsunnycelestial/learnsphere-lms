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
export default function QuizResults() {
  const { data: profile } = useFetchProfile();
  const results = profile?.results;
  if (results?.length === 0) {
    return <Typography> No results yet</Typography>;
  } else
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Quiz Name</TableCell>

              <TableCell>Quiz Id</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results?.map((result) => (
              <TableRow key={result?.resultId}>
                <TableCell>{result?.quiz?.quizName}</TableCell>
                <TableCell>{result?.quiz?.quizId}</TableCell>
                <TableCell>{result?.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
}
