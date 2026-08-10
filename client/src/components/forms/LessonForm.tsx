import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress
} from "@mui/material";
import { lessonFormControl} from "../../store/slices/formSlice";

import { useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { toast } from "react-toastify";

import { useParams } from "react-router";
import { uploadVideo } from "../../supabase/uploadVideo";
import useLessonsCRUD from "../../hooks/useLessonsCRUD";
export default function LessonForm() {
const [isSubmitting, setIsSubmitting] = useState(false);
 const {id}= useParams()
  const selectedLesson = useAppSelector((state) => state.form.lessons.selectedLesson);
  console.log('selected course',selectedLesson)
  const mode = useAppSelector((state) => state.form.lessons.mode);
  const publicUrl = useRef<string | null>(selectedLesson?.videoLink ?? null);
  const isEditing = mode === "edit";
  const courseId = selectedLesson?.courseId ?? id 
   
  const [lessonName,setLessonName] = useState(selectedLesson?.lessonName?? "");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [description, setDescription] = useState(selectedLesson?.description ?? "");
  const [sortOrder, setSortOrder] = useState(
    selectedLesson?.sortOrder ??  null,
  );
  const dispatch = useAppDispatch();
const {addNewLesson,updateLesson} = useLessonsCRUD()

  async function handleSubmit() {
    setIsSubmitting(true)
    if (videoFile) {
      publicUrl.current = await uploadVideo(videoFile);
    }
    let input;
    if (!isEditing) {
      input = {
        lessonName:lessonName,
        courseId:courseId ?? '',
        description:description,
        videoLink:publicUrl.current,
      };
      try {
        const res = await addNewLesson({ input });
        toast.success(res)
        dispatch(
          lessonFormControl({
            isLessonFormOpen: false,
            selectedLesson: null,
          }),
        );
      } catch (err) {
        toast.error(err as string);
      }
    } else {
      try{
        input = {
          lessonId:selectedLesson?.lessonId,
          courseId:selectedLesson?.courseId || '',
          lessonName:lessonName,
          description:description,
          videoLink:publicUrl.current,
          sortOrder:sortOrder,
        };
        const res = await updateLesson({ input });
        if(res?.message) toast.success(res?.message)
        dispatch(
          lessonFormControl({
            isLessonFormOpen: false,
            selectedLesson: null,
          }),
        );
        setIsSubmitting(false)
      }catch(err){
        toast.error(err as string);
         setIsSubmitting(false)
      }
    }
  }
  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    setVideoFile(e.target.files[0]);
  }
  return (
    <Box
      sx={{
        width: 600,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          {isEditing ? "Edit Lesson" : "Add A Lesson"}
        </Typography>

        <Button
          onClick={() =>
            dispatch(
              lessonFormControl({
                isLessonFormOpen: false,
                selectedLesson: null,
              }),
            )
          }
          variant="outlined"
          sx={{
            textTransform: "none",
          }}
        >
          Close
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Lesson Name"
          value={lessonName}
          onChange={(e) => setLessonName(e.target.value)}
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

      {isEditing && <TextField
  label="Sort Order"
  type="number"
  value={sortOrder ?? ""}
  onChange={(e) => {
    const value = e.target.value;

    setSortOrder(value === "" ? null : Number(value));
  }}
  fullWidth
  slotProps={{
    htmlInput: {
      min: 1,
    },
  }}
/>}  
     


        <Button
          variant="outlined"
          component="label"
          sx={{
            textTransform: "none",
            justifyContent: "flex-start",
          }}
        >
           {videoFile ? videoFile.name : "Upload Lesson Video"}
          <input
            hidden
            type="file"
            name="videoLink"
            onChange={handleVideoChange}
          />
        </Button>
      </Box>
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
        onClick={handleSubmit}
        sx={{
          textTransform: "none",
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {isSubmitting ? (
    <CircularProgress
      size={22}
      color="inherit"
    />
  ) : (
    isEditing ? "Confirm Edit" : "Submit"
  )}
      </Button>
    </Box>
  );
}