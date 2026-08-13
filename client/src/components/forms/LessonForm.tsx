import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { lessonFormControl } from '../../store/slices/formSlice';

import { useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toast } from 'react-toastify';

import { useParams } from 'react-router';
import { uploadVideo } from '../../supabase/uploadVideo';
import useLessonsCRUD from '../../hooks/useLessonsCRUD';
import { lessonSchema } from '../../validation/lessonSchema';
export default function LessonForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const selectedLesson = useAppSelector((state) => state.form.lessons.selectedLesson);
  console.log('selected course', selectedLesson);
  const mode = useAppSelector((state) => state.form.lessons.mode);
  const publicUrl = useRef<string | null>(selectedLesson?.videoLink ?? null);
  const isEditing = mode === 'edit';
  const courseId = selectedLesson?.courseId ?? id;
  const [errors, setErrors] = useState<{ lessonName?: string; description?: string }>({});
  const [lessonName, setLessonName] = useState(selectedLesson?.lessonName ?? '');
  const existingVideoFileName = selectedLesson?.videoLink
    ? decodeURIComponent(selectedLesson.videoLink.split('/').pop()?.split('?')[0] || '')
    : '';
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [description, setDescription] = useState(selectedLesson?.description ?? '');
  const dispatch = useAppDispatch();
  const { addNewLesson, updateLesson } = useLessonsCRUD();

  async function handleSubmit() {
    const result = lessonSchema.safeParse({ lessonName, description });
    if (!result.success) {
      const fieldErrors: {
        lessonName?: string;
        description?: string;
      } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as 'lessonName' | 'description';
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setIsSubmitting(true);
    if (videoFile) {
      publicUrl.current = await uploadVideo(videoFile);
    }
    let input;
    if (!isEditing) {
      input = {
        lessonName: lessonName,
        courseId: courseId ?? '',
        description: description,
        videoLink: publicUrl.current,
      };
      try {
        const res = await addNewLesson({ input });
        toast.success(res);
        dispatch(
          lessonFormControl({
            isLessonFormOpen: false,
            selectedLesson: null,
          })
        );
      } catch (err) {
        toast.error(err as string);
      }
    } else {
      try {
        input = {
          lessonId: selectedLesson?.lessonId,
          courseId: selectedLesson?.courseId || '',
          lessonName: lessonName,
          description: description,
          videoLink: publicUrl.current,
        };
        const res = await updateLesson({ input });
        if (res?.message) toast.success(res?.message);
        dispatch(
          lessonFormControl({
            isLessonFormOpen: false,
            selectedLesson: null,
          })
        );
        setIsSubmitting(false);
      } catch (err) {
        toast.error(err as string);
        setIsSubmitting(false);
      }
    }
  }

  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];

    if (file?.name.split('.')[1].toLowerCase() !== 'mp4') {
      toast.error('Upload files of type mp4 only');
      e.target.value = '';
      return;
    }
    setVideoFile(e.target.files[0]);
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
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          {isEditing ? 'Edit Lesson' : 'Add A Lesson'}
        </Typography>

        <Button
          onClick={() =>
            dispatch(
              lessonFormControl({
                isLessonFormOpen: false,
                selectedLesson: null,
              })
            )
          }
          variant="outlined"
          sx={{
            textTransform: 'none',
          }}
        >
          Close
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          label="Lesson Name"
          value={lessonName}
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, lessonName: '' }));
            setLessonName(e.target.value);
          }}
          error={!!errors.lessonName}
          helperText={errors.lessonName || `${lessonName.trim().length}/50`}
          required
          fullWidth
        />

        <TextField
          label="Description"
          value={description}
          error={!!errors.description}
          helperText={errors.description || `${description.trim().length}/1000`}
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, description: '' }));
            setDescription(e.target.value);
          }}
          required
          fullWidth
        />

        <Button
          variant="outlined"
          component="label"
          sx={{
            textTransform: 'none',
            justifyContent: 'flex-start',
          }}
        >
          {videoFile
            ? videoFile.name
            : isEditing && existingVideoFileName
              ? existingVideoFileName
              : 'Upload Lesson Video'}
          <input hidden type="file" name="videoLink" onChange={handleVideoChange} />
        </Button>
      </Box>
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        onClick={handleSubmit}
        sx={{
          textTransform: 'none',
          fontSize: 15,
          fontWeight: 600,
        }}
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
