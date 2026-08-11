import { Box, Typography, Divider, Chip, Avatar, Stack, Button } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { resultDisplay } from '../../store/slices/formSlice';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { downloadResultPDF } from '../../pdf-lib/pdfHandler';
export default function QuizResultDisplay() {
  const dispatch = useAppDispatch();
  const quizResult = useAppSelector((state) => state.form.results.quizResult);

  if (!quizResult) {
    return <Typography>No quiz result to show yet.</Typography>;
  }
  const handleDownload = async () => {
    await downloadResultPDF(quizResult);
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        minWidth: 600,
      }}
    >
      <Stack direction={'row'}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
          <Avatar src={quizResult.profile_image_path ?? undefined} />
          <Box>
            <Typography sx={{ fontWeight: 600 }}>
              {quizResult.username ?? 'Unknown user'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {quizResult.courseDetail?.courseName ?? 'Unknown course'}
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="outlined"
          size="small"
          sx={{
            ml: 'auto',
            height: 40,
            width: 50,
          }}
          onClick={() => dispatch(resultDisplay({ submitted: false, quizResult: null }))}
        >
          close
        </Button>
      </Stack>
      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {quizResult.quizName ?? 'Quiz'}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
        <Chip
          label={`Score: ${quizResult.score ?? 0} %`}
          color="primary"
          sx={{ fontWeight: 600 }}
        />
        {quizResult.courseDetail?.isActive != null && (
          <Chip
            label={quizResult.courseDetail.isActive ? 'Course Active' : 'Course Archived'}
            color={quizResult.courseDetail.isActive ? 'success' : 'default'}
            size="small"
          />
        )}
      </Stack>

      <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
        Your Quiz results for the course:{' '}
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {quizResult.courseDetail?.courseName}
        </Typography>
      </Typography>
      <Button
        onClick={handleDownload}
        startIcon={<CloudDownloadIcon />}
        variant="outlined"
        size="small"
      >
        Download result
      </Button>
    </Box>
  );
}
