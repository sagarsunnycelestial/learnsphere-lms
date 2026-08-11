import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { questionFormControl } from '../../store/slices/formSlice';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toast } from 'react-toastify';

import useQuizzesRUD from '../../hooks/useQuizzesCRUD';

export default function QuestionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quizId = useAppSelector((state) => state.form.questions.quizId);
  const dispatch = useAppDispatch();
  const { createAQuestion } = useQuizzesRUD();

  const [questionText, setQuestionText] = useState('');
  const [correctOption, setCorrectOption] = useState('');
  const [optionTwo, setOptionTwo] = useState('');
  const [optionThree, setOptionThree] = useState('');
  const [optionFour, setOptionFour] = useState('');

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const input = {
        quizId: quizId ?? '',
        questionText,
        correctOption,
        optionTwo,
        optionThree,
        optionFour,
      };
      const res = await createAQuestion({ input });
      if (res?.message) toast.success(res.message);
      dispatch(questionFormControl({ isQuestionFormOpen: false, quizId: null }));
    } catch (err) {
      toast.error(err as string);
    } finally {
      setIsSubmitting(false);
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
        <Typography sx={{ fontSize: 22, fontWeight: 600 }}>Add A Question</Typography>

        <Button
          onClick={() => dispatch(questionFormControl({ isQuestionFormOpen: false, quizId: null }))}
          variant="outlined"
          sx={{ textTransform: 'none' }}
        >
          Close
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Question Text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Correct Option"
          value={correctOption}
          onChange={(e) => setCorrectOption(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Option Two"
          value={optionTwo}
          onChange={(e) => setOptionTwo(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Option Three"
          value={optionThree}
          onChange={(e) => setOptionThree(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Option Four"
          value={optionFour}
          onChange={(e) => setOptionFour(e.target.value)}
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
        {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Submit'}
      </Button>
    </Box>
  );
}
