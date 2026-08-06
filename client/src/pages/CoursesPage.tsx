import CourseCard from "../components/dashboard/CourseCard"
import useFetchCourses from "../hooks/useFetchCourses"
import { Paper,Dialog,Box,TextField,Stack ,useTheme} from "@mui/material"
import { useState,useEffect } from "react"
import CourseForm from "../components/forms/CourseForm"
import { useAppSelector } from "../store/hooks"
export default function CoursesPage() {
  const theme = useTheme()
  const {data:courses} = useFetchCourses()
   const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
const isOpen = useAppSelector(state=>state.form.courses.isAddCourseFormOpen)
   const filteredCourses = courses?.filter(
    (course) =>
      course != null &&
      course.courseName?.toLowerCase().includes(debouncedSearch.toLowerCase())
  )
 const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  useEffect(()=>{
    const timer = setTimeout(()=>{
      setDebouncedSearch(search)
    },500)
  return ()=> clearTimeout(timer)
  },[search])
  return (<>
  <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: theme.palette.background.paper,
        px: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
        mb:2
      }}
    >
      <Stack direction="row">
        <TextField
          size="small"
          value={search}
          onChange={handleSearch}
          placeholder="Search Course"
          sx={{ width: 280 }}
        />
      </Stack>
    </Paper>
     <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          overflow: "auto",
          gap: 5,
          mt: 5,
        }}
      >
{filteredCourses?.map((course) => {
  return <CourseCard key={course?.courseId} course={course!} />;
})}
</Box>
<Dialog open={isOpen}>
<CourseForm />
</Dialog>
  </>
    
  )
}
