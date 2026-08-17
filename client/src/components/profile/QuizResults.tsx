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
export default function QuizResults() {
  const { data: profile } = useFetchProfile();
  const results = profile?.results;
  if (results?.length === 0) {
    return <Typography>No results yet</Typography>;
  } else
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Quiz Name</TableCell>

              <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results?.map((result) => (
              <TableRow key={result?.resultId}>
                <TableCell sx={{ fontWeight: 600 }}>
                  {result?.quiz?.quizName}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={(result?.score ?? 0 >= 50) ? 'success' : 'error'}
                    label={result?.score ?? '-'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
}
