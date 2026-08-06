import { useMutation,} from "@tanstack/react-query";
import { apolloClient } from "../graphql/apolloClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CreateCourseDocument,EditCourseDocument,DeleteCourseDocument, CreateCourseMutationVariables, EditCourseMutationVariables, DeleteCourseMutationVariables } from "../generated/graphql";


export default function useCoursesCRUD() {
  const queryClient = useQueryClient();
   const { mutateAsync: addNewCourse } = useMutation({
     mutationFn: async (input:CreateCourseMutationVariables) => {
       const { data } = await apolloClient.mutate({
         mutation: CreateCourseDocument,
         variables: input,
         fetchPolicy: "network-only",
       });
       if (!data) {
         throw new Error("No response from server");
       }
       return data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({
         queryKey: ["courses"],
       });
     },
      onError:()=>{
       toast.error("Adding course failed")
     }
   });
   const {mutateAsync:updateCourse} = useMutation({
     mutationFn: async(input:EditCourseMutationVariables) =>{
       const {data} = await apolloClient.mutate({
         mutation:EditCourseDocument,
         variables:input,
         fetchPolicy: "network-only",
       });
       return data?.editCourse
     },
     onSuccess: ()=>{
       queryClient.invalidateQueries({
         queryKey:['courses']
       })
     },
     onError:()=>{
       toast.error("Update failed")
     }
   })
    const {mutateAsync:deleteCourse} = useMutation({
     mutationFn: async(input:DeleteCourseMutationVariables) =>{
       const {data} = await apolloClient.mutate({
         mutation:DeleteCourseDocument,
         variables:input,
         fetchPolicy: "network-only",
       });
       return data?.deleteCourse
     },
     onSuccess: ()=>{
       queryClient.invalidateQueries({
         queryKey:['courses']
       })
     },
     onError:()=>{
       toast.error("Delete failed")
     }
   })
 
   return { addNewCourse,updateCourse,deleteCourse };

}
