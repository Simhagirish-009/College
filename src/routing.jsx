import { BrowserRouter , Routes , Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import './App.css';
import App from './App';
import About from './Home/Components/About'
import Login from './Forms/Login';
import Otp from './Forms/Otp';
import Contact from './Home/Components/Contact';
import AdminDash from './Admin/Components/AdminDash';
import StaffDash from './Staff/Components/StaffDash';
import StudentDash from './Student/Components/StudentDash';
import AddStu from './Admin/Components/AddStu';
import AddStaff from './Admin/Components/AddStaff';
import AdmUpdate from './Admin/Components/AdmUpdate';
import StaUpdate from './Staff/Components/StafUpdate';
import StuUpdate from './Student/Components/StuUpdate';
import ManageCourse from './Admin/Components/ManageCourse';
import ManageSub from './Admin/Components/ManageSub';
import StaffLeave from './Staff/Components/StaffLeave';
import StuLeave from './Student/Components/StudentLeave';
import ManageSession from './Admin/Components/ManageSession';
import ManageStaff from './Admin/Components/ManageStaff';
import ManageStudents from './Admin/Components/ManageStu';
import NotifyStaff from './Admin/Components/NotifyStaff';
import NotifyStu from './Admin/Components/NotifyStu';
import NotifyStudent from './Staff/Components/NotifyStudent';
import StaffNotifications from './Staff/Components/StaffNotifications';
import StuNotifications from './Student/Components/StuNotifications';
import ApproveStaff from './Admin/Components/ApproveStaff';
import ApproveStu from './Admin/Components/ApproveStu';
import StaffFeedBack from './Staff/Components/StaffFeedBack';
import StuFeedBack from './Student/Components/StuFeedBack';
import FeedbackStaff from './Admin/Components/FeedBackStaff'
import FeedBackStu from './Admin/Components/FeedBackStu';
import AddResult from './Staff/Components/AddResult';
import ManageUnit from './Staff/Components/ManageUnit';
import AllResult from './Staff/Components/AllResult';
import TakeAtt from './Staff/Components/TakeAtt';
import AttReport from './Staff/Components/AttReport';
import ViewAtt from './Student/Components/ViewAtt';
import EmailVerify from './Forms/EmailVerify';
import Reset from './Forms/Reset';
import ViewAllAtt from './Admin/Components/ViewAllAtt';
import ViewAllResults from './Admin/Components/ViewAllResults';
import ViewResult from './Student/Components/ViewResult'
function Routing() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element = {<App/>}/>
            <Route path='/about' element = {<About/>}/>
            <Route path='/contact' element={<Contact/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/verify_otp' element={<Otp/>}/>
            <Route path='/admindash' element={<PrivateRoute allowedUserTypes={['1']}><AdminDash/></PrivateRoute>}/>
            <Route path='staffdash/' element={<PrivateRoute allowedUserTypes={['2']}><StaffDash/></PrivateRoute>}/>
            <Route path='studash/' element={<PrivateRoute allowedUserTypes={['3']}><StudentDash/></PrivateRoute>}/>
            <Route path='addstu/' element={<AddStu/>}/>
            <Route path='addstaff/' element={<AddStaff/>}/>
            <Route path='admupdate/' element={<AdmUpdate/>}/>
            <Route path='stafupdate/' element={<StaUpdate/>}/>
            <Route path='stuupdate/' element={<StuUpdate/>}/>
            <Route path='mngcourse/' element={<ManageCourse/>}/>
            <Route path='mngsub/' element={<ManageSub/>}/>
            <Route path='stafleave/' element={<StaffLeave/>}/>
            <Route path='stuleave/' element={<StuLeave/>}/>
            <Route path='mngsession/' element={<ManageSession/>}/>
            <Route path='mngstaff/' element={<ManageStaff/>}/>
            <Route path='mngstu/' element={<ManageStudents/>}/>
            <Route path='notifystaff/' element={<NotifyStaff/>}/>
            <Route path='notifystu/' element={<NotifyStu/>}/>
            <Route path='staffnote/' element={<StaffNotifications/>}/>
            <Route path='stunotify/' element={<StuNotifications/>}/>
            <Route path='stafapprove/' element={<ApproveStaff/>}/>
            <Route path='stuapprove/' element={<ApproveStu/>}/>
            <Route path='staffeedback/' element={<StaffFeedBack/>}/>
            <Route path='stufeedback/' element={<StuFeedBack/>}/>
            <Route path='feedbackstaff/' element={<FeedbackStaff/>}/>
            <Route path='feedbackstu/' element={<FeedBackStu/>}/>
            <Route path='addresult/' element={<AddResult/>}/>
            <Route path='mngunit/' element={<ManageUnit/>}/>
            <Route path='allresults/' element={<AllResult/>}/>
            <Route path='takeatt/' element={<TakeAtt/>}/>
            <Route path='viewatt/' element={<AttReport/>}/>
            <Route path='viewattstu/' element={<ViewAtt/>}/>
            <Route path='emailverify/' element={<EmailVerify/>}/>
            <Route path='reset/'element={<Reset/>}/>
            <Route path='viewallatt/' element={<ViewAllAtt/>}/>
            <Route path='viewallres/' element={<ViewAllResults/>}/>
            <Route path='viewres/'element={<ViewResult/>}/>
            <Route path='notifystudent/'element={<NotifyStudent/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default Routing;