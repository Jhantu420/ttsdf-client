import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import ApplyCourse from "./pages/ApplyCourse";
import PageNotFound from "./pages/PageNotFound";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import BranchAdminDashboard from "./pages/dashboard/BranchAdminDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./context/AppContext";
import CreateBranch from "./pages//super/CreateBranch";
import RegisterStudent from "./pages/super/RegisterStudents";
import CreateCourses from "./pages/super/CreateCourses";
import CreateBranchAdmins from "./pages/super/CreateBranchAdmins";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import BranchAdminLayout from "./layouts/BranchAdminLayout";
import ResetPassword from "./pages/ResetPassword";
import ImageUploader from "./pages/super/ImageUploader";
import CreateTeam from "./pages/super/CreateTeam";
import UserMsg from "./pages/UserMsg";
import Coe from "./pages/pdf/Coe";
import Branches from "./pages/Branches";
import StudentList from "./pages/StudentList";

// ✅ Handle environment variables properly
const googleClientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;

const App = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Prevents flickering issues

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="flex flex-col ">
        <Navbar />
        <main className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/apply-course" element={<ApplyCourse />} />
            <Route path="/resetPassword/:token" element={<ResetPassword />} />
            
            <Route path="/branches" element={<Branches />} />
            <Route
              path="/users-msg"
              element={
                user?.role === "student" ? (
                  <Navigate to="/" replace />
                ) : (
                  <UserMsg />
                )
              }
            />

            {/* 🔒 Prevent logged-in users from accessing the login page */}
            <Route
              path="/login"
              element={
                loading ? (
                  <div className="flex justify-center items-center min-h-screen">
                    <p>Loading...</p> {/* Replace with a spinner if needed */}
                  </div>
                ) : user ? (
                  <Navigate
                    to={user.role === "student" ? "/" : `/${user.role}`}
                    replace
                  />
                ) : (
                  <Login />
                )
              }
            />

            {/* 🚀 Protected Routes with Role-Based Access */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path="/student" element={<StudentDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["super"]} />}>
              <Route path="/super" element={<SuperAdminLayout />}>
              <Route index element = {<StudentList />} />
                <Route
                  path="super-create-branches"
                  element={<CreateBranch />}
                />
                <Route path="create-students" element={<RegisterStudent />} />
                <Route
                  path="super-create-courses"
                  element={<CreateCourses />}
                />
                <Route
                  path="super-create-branch-admin"
                  element={<CreateBranchAdmins />}
                />
                <Route
                  path="super-upload-recent-images"
                  element={<ImageUploader />}
                />
                <Route path="create-team" element={<CreateTeam />} />
                <Route path="generate-certificate" element={<Coe />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["branchAdmin"]} />}>
              <Route path="/branchAdmin" element={<BranchAdminLayout />}>
                <Route index element={<BranchAdminDashboard />} />
                <Route path="create-students" element={<RegisterStudent />} />
              </Route>
            </Route>

            {/* <Route element={<ProtectedRoute allowedRoles={["branchAdmin"]} />}>
              <Route path="/branchAdmin" element={<BranchAdminDashboard />} />
            </Route> */}

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
