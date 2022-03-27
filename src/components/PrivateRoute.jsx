import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Spinner from './Spinner'

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus()

  if (checkingStatus) {       // aka 'loading' = true
    return <Spinner />
  }

  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />       // Outlet is a nested Route, t.i. "...element={<Profile />}" 
}

export default PrivateRoute