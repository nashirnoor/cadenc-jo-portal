import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './users/components/Signup';
import Login from './users/components/Login';
import Profile from './users/components/Profile';
import VerifyEmail from './users/components/VerifyEmail';
import ForgotPassword from './users/components/ForgotPassword';
import Landing from './users/components/Landing';
import { Toaster } from 'sonner';
import ResetPassword from './users/components/ResetPassword';
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from './admin/components/AdminLogin';
import RecruiterRegister from './recruiter/RecruiterRegister';
import AdminHome from './admin/components/AdminHome';
import ProtectedRoute from '../src/admin/ProtectedRoute';
import RecruiterList from './admin/components/RecruiterList';
import RecruiterHome from './recruiter/RecruiterHome';
import About from './users/components/About';
import FindJobs from './users/components/FindJobs';
import JobDetail from './users/components/JobDetail';
import Companies from './users/components/Companies';
import CompanyProfile from './recruiter/CompanyProfile';
import UploadJob from './recruiter/UploadJob';
import About_recruiter from './recruiter/About_recruiter';
import ProtectedRouteRecruiter from './recruiter/components/ProtectedRouteRecruiter';
import AdminRecruiterApproval from './admin/components/AdminRecruiterApproval';
import CompanyForm from './recruiter/CompanyForm';
import SkillManagement from './admin/components/SkillManagement';
import UserDetailForm from './recruiter/components/UserDetailForm';
import UserProfile from './users/components/UserProfile';
function App() {

  return (
    <>
    <Router>
      <Routes>
        {/* <Route path='/' element={<Signup/>} /> */}
        {/* <Route path='/login' element={<Login/>} /> */}
        <Route path="/login" element={
                    <ProtectedRouteRecruiter>
                        <Login />
                    </ProtectedRouteRecruiter>
                } />
                <Route path="/signup" element={
                    <ProtectedRouteRecruiter>
                        <Signup />
                    </ProtectedRouteRecruiter>
                } />



        <Route path='/profile' element={<Profile/>} />
        <Route path='/otp/verify' element={<VerifyEmail/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/landing' element={<Landing/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/find-jobs' element={<FindJobs/>} />

        

        <Route path='/password-reset-confirm/:uid/:token' element={<ResetPassword/>} />

        <Route path='/recruiter-register' element={<RecruiterRegister/>}/>

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path='/recruiter-list' element={<RecruiterList/>}/>
          <Route path='/recruiter-approval' element={<AdminRecruiterApproval/>} />
          <Route path='/skill-management' element={<SkillManagement/>} />


        </Route>

        <Route path='/recruiter-home' element={<RecruiterHome/>} />
        {/* <Route path='/job-detail' element={<JobDetail/>} /> */}
        {/* <Route path='/job-detail' element={<JobDetail />} /> */}
        <Route path='/company-form' element={<CompanyForm/>} />

        <Route path='/company-list' element={<Companies/>} />
        <Route path='/company-profile' element={<CompanyProfile/>} />
        <Route path='/upload-job' element={<UploadJob/>} />
        <Route path='/about-recruiter' element={<About_recruiter/>} />
        <Route path='/user-detail-form' element={<UserDetailForm />} />
        <Route path='/user-profile' element={<UserProfile/>} />

        <Route path="/job/:id" element={<JobDetail/>} />

      

       
      </Routes>
      <Toaster position='top-right' richColors />
    </Router>


    </>

  )
}

export default App
