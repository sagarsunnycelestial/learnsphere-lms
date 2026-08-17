import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { questionFormControl } from '../../store/slices/formSlice';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toast } from 'react-toastify';
import { questionSchema } from '../../validation/questionSchema';
import useQuizzesRUD from '../../hooks/useQuizzesCRUD';
import AddIcon from '@mui/icons-material/Add';
type QuestionErrors = {
  quizId?: string;
  questionText?: string;
  correctOption?: string;
  options?: string[];
};

const MAX_OPTIONS = 3;
export default function QuestionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quizId = useAppSelector((state) => state.form.questions.quizId);
  const dispatch = useAppDispatch();
  const { createAQuestion } = useQuizzesRUD();

  const [errors, setErrors] = useState<QuestionErrors>({});
  const [options, setOptions] = useState<string[]>(['']);
  const [questionText, setQuestionText] = useState('');
  const [correctOption, setCorrectOption] = useState('');

  async function handleSubmit() {
    const filteredOptions = options.filter((option) => option !== '');
    const result = questionSchema.safeParse({
      quizId: quizId ?? '',
      questionText,
      correctOption,
      options: filteredOptions,
    });
    if (!result.success) {
      const fieldErrors: QuestionErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (
          field === 'questionText' ||
          field === 'correctOption' ||
          field === 'quizId'
        ) {
          fieldErrors[field] = issue.message;
        }

        if (field === 'options') {
          const optionIndex = issue.path[1];

          if (typeof optionIndex === 'number') {
            if (!fieldErrors.options) {
              fieldErrors.options = [];
            }

            fieldErrors.options[optionIndex] = issue.message;
          } else {
            fieldErrors.options = [issue.message];
          }
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const input = {
        quizId: quizId ?? '',
        questionText,
        correctOption,
        options: filteredOptions,
      };
      const res = await createAQuestion({ input });
      if (res?.message) toast.success(res.message);
      dispatch(
        questionFormControl({ isQuestionFormOpen: false, quizId: null })
      );
    } catch (err) {
      toast.error(err as string);
    } finally {
      setIsSubmitting(false);
    }
  }
  function handleOptionAdd() {
    if (options.length >= MAX_OPTIONS) {
      toast.info(`You can only have ${MAX_OPTIONS + 1} options.`);
      return;
    }
    setOptions((prev) => [...prev, '']);
  }
  return (
    <Box
      sx={{
        width: 600,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography sx={{ fontSize: 22, fontWeight: 600 }}>
          Add A Question
        </Typography>

        <Button
          onClick={() =>
            dispatch(
              questionFormControl({ isQuestionFormOpen: false, quizId: null })
            )
          }
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
          onChange={(e) => {
            setQuestionText(e.target.value);
            setErrors((prev) => ({
              ...prev,
              questionText: '',
            }));
          }}
          error={!!errors.questionText}
          helperText={errors.questionText || `${questionText.trim().length}/50`}
          required
          fullWidth
        />

        <TextField
          label="Correct Option"
          value={correctOption}
          onChange={(e) => {
            setCorrectOption(e.target.value);
            setErrors((prev) => ({
              ...prev,
              correctOption: '',
            }));
          }}
          error={!!errors.correctOption}
          helperText={errors.correctOption}
          required
          fullWidth
        />

        {options.map((option, index) => (
          <TextField
            key={index}
            label={`Enter option ${index + 2}`}
            placeholder={`Enter option ${index + 2}`}
            value={option}
            onChange={(e) => {
              setOptions((prev) => prev.with(index, e.target.value));

              setErrors((prev) => ({
                ...prev,
                options: prev.options?.map((error, errorIndex) =>
                  errorIndex === index ? '' : error
                ),
              }));
            }}
            error={!!errors.options?.[index]}
            helperText={errors.options?.[index]}
            required
            fullWidth
          />
        ))}

        <Button
          startIcon={<AddIcon />}
          sx={{ bgcolor: 'forestgreen', width: 150, alignSelf: 'flex-end' }}
          size="small"
          variant="contained"
          onClick={handleOptionAdd}
        >
          Add option
        </Button>
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
        ) : (
          'Submit'
        )}
      </Button>
    </Box>
  );
}
