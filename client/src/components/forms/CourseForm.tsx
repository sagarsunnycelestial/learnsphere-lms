import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { addCourseFormControl } from '../../store/slices/formSlice';

import { useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { uploadImage } from '../../supabase/uploadImage';
import { toast } from 'react-toastify';
import useCoursesCRUD from '../../hooks/useCoursesCRUD';
import CircularProgress from '@mui/material/CircularProgress';
export default function CourseForm() {
  const selectedCourse = useAppSelector((state) => state.form.courses.selectedcourse);
  console.log('selected course', selectedCourse);
  const mode = useAppSelector((state) => state.form.courses.mode);
  const publicUrl = useRef<string | null>(selectedCourse?.thumbnail_image_path ?? null);
  const isEditing = mode === 'edit';
  const [courseName, setCourseName] = useState(selectedCourse?.courseName ?? '');
  const [thumbnailImg, setThumbnailImg] = useState<File | null>(null);
  const [description, setDescription] = useState(selectedCourse?.description ?? '');
  const [loading, setLoading] = useState<boolean>(false);
  const [isActive, setIsActive] = useState(selectedCourse?.isActive ?? true);
  const dispatch = useAppDispatch();
  const { addNewCourse, updateCourse } = useCoursesCRUD();
  async function handleSubmit() {
    setLoading(true);
    if (thumbnailImg) {
      publicUrl.current = await uploadImage(thumbnailImg);
    }
    let input;
    if (!isEditing) {
      input = {
        courseName: courseName,
        description: description,
        thumbnail_image_path: publicUrl.current,
      };
      try {
        const res = await addNewCourse({ input });
        toast.success(res.message);
        dispatch(
          addCourseFormControl({
            isAddCourseFormOpen: false,
            selectedCourse: null,
          })
        );
      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        input = {
          courseId: selectedCourse?.courseId,
          courseName: courseName,
          description: description,
          thumbnail_image_path: publicUrl.current,
          isActive: isActive,
        };
        const res = await updateCourse({ input });
        if (res?.message) toast.success(res?.message);
        dispatch(
          addCourseFormControl({
            isAddCourseFormOpen: false,
            selectedCourse: null,
          })
        );
      } catch (err) {
        toast.error(err as string);
      } finally {
        setLoading(false);
      }
    }
  }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    setThumbnailImg(e.target.files[0]);
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
          {isEditing ? 'Edit Course' : 'Add Course'}
        </Typography>

        <Button
          onClick={() =>
            dispatch(
              addCourseFormControl({
                isAddCourseFormOpen: false,
                selectedCourse: null,
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
          label="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          fullWidth
        />

        {isEditing && (
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>

            <Select
              labelId="status-label"
              value={isActive ? 'active' : 'archived'}
              label="Status"
              onChange={(e) => setIsActive(e.target.value === 'active')}
            >
              <MenuItem key={'active'} value={'active'}>
                Active
              </MenuItem>
              <MenuItem key={'archived'} value={'archived'}>
                Archive
              </MenuItem>
            </Select>
          </FormControl>
        )}

        <Button
          variant="outlined"
          component="label"
          sx={{
            textTransform: 'none',
            justifyContent: 'flex-start',
          }}
        >
          Upload Image
          <input hidden type="file" name="profile_image_path" onChange={handleImageChange} />
        </Button>
      </Box>
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        onClick={handleSubmit}
        sx={{
          textTransform: 'none',
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {loading ? (
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
