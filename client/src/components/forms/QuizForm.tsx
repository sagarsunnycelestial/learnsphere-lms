import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { quizFormControl } from '../../store/slices/formSlice';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toast } from 'react-toastify';

import { useParams } from 'react-router';
import useQuizzesCRUD from '../../hooks/useQuizzesCRUD';

export default function QuizForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const selectedQuiz = useAppSelector((state) => state.form.quizzes.selectedQuiz);
  const mode = useAppSelector((state) => state.form.quizzes.mode);
  const isEditing = mode === 'edit';
  const courseId = selectedQuiz?.courseId ?? id;

  const [quizName, setQuizName] = useState(selectedQuiz?.quizName ?? '');

  const dispatch = useAppDispatch();
  const { addNewQuiz } = useQuizzesCRUD();

  async function handleSubmit() {
    setIsSubmitting(true);
    if (!isEditing) {
      try {
        const input = {
          quizName,
          courseId: courseId ?? '',
        };
        const res = await addNewQuiz({ input });
        if (res?.message) toast.success(res.message);
        dispatch(quizFormControl({ isQuizFormOpen: false, selectedQuiz: null }));
      } catch (err) {
        toast.error(err as string);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // try {
      //   const input = {
      //     quizId: selectedQuiz?.quizId,
      //     courseId: selectedQuiz?.courseId || "",
      //     quizName,
      //   };
      //   const res = await updateQuiz({ input });
      //   if (res?.message) toast.success(res.message);
      //   dispatch(quizFormControl({ isQuizFormOpen: false, selectedQuiz: null }));
      // } catch (err) {
      //   toast.error(err as string);
      // } finally {
      //   setIsSubmitting(false);
      // }
    }
  }

  return (
    <Box sx={{ width: 600, display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography sx={{ fontSize: 22, fontWeight: 600 }}>
          {isEditing ? 'Edit Quiz' : 'Add A Quiz'}
        </Typography>

        <Button
          onClick={() => dispatch(quizFormControl({ isQuizFormOpen: false, selectedQuiz: null }))}
          variant="outlined"
          sx={{ textTransform: 'none' }}
        >
          Close
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Quiz Name"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          required
          fullWidth
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        onClick={handleSubmit}
        sx={{ textTransform: 'none', fontSize: 15, fontWeight: 600 }}
      >
        {isSubmitting ? (
          <CircularProgress size={22} color="inherit" />
        ) : isEditing ? (
          'Confirm Edit'
        ) : (
          'Submit'
        )}
      </Button>
    </Box>
  );
}
