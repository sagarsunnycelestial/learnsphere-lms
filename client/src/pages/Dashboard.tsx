import ActionTab from '../components/dashboard/ActionTab'
import { hasPermission } from '../permissions/auth'
import { useAppSelector } from '../store/hooks'
import CoursesPage from './CoursesPage'

export default function Dashboard() {
  const user = useAppSelector(state=>state.auth.user)
  return (<>
  {hasPermission(user,"view:action")  && <ActionTab />}
  <CoursesPage />
  </>
  )
}
