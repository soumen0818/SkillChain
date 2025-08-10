import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CourseProvider } from "@/contexts/CourseContext";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateCourse from "./pages/CreateCourse";
import UploadContent from "./pages/UploadContent";
import IssueCertificate from "./pages/IssueCertificate";
import TeacherAnalytics from "./pages/TeacherAnalytics";
import MyLearningJourney from "./pages/MyLearningJourney";
import CourseStudy from "./pages/CourseStudyReal";
import BrowseCourses from "./pages/BrowseCourses";
import CourseProgress from "./pages/CourseProgress";
import GetCertificate from "./pages/GetCertificate";
import DownloadCertificate from "./pages/DownloadCertificate";
import CourseManagement from "./pages/CourseManagement";
import EditCourse from "./pages/EditCourse";
import CourseAnalytics from "./pages/CourseAnalytics";
import CourseSettings from "./pages/CourseSettings";
import CoursePreview from "./pages/CoursePreview";
import Courses from "./pages/Courses";
import Marketplace from "./pages/Marketplace";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import CertificateVerification from "./pages/CertificateVerification";
import CertificateMarketplaceListing from "./pages/CertificateMarketplaceListing";
import CertificateDetails from "./pages/CertificateDetails";
import Footer from "@/components/Footer";
import SettingsPage from "./pages/Settings";
import WalletPage from "./pages/Wallet";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MarketplaceProvider>
          <CourseProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'teacher']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wallet"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'teacher']}>
                      <WalletPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/my-learning-journey"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <MyLearningJourney />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/course-study/:courseId"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <CourseStudy />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/browse-courses"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <BrowseCourses />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/course-progress/:courseId"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <CourseProgress />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/get-certificate/:courseId"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <GetCertificate />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/download-certificate/:courseId"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <DownloadCertificate />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/teacher-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/teacher/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/create-course"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <CreateCourse />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/upload-content"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <UploadContent />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/issue-certificate"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <IssueCertificate />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/teacher-analytics"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <TeacherAnalytics />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/course-management/:courseId"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <CourseManagement />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/edit-course/:courseId"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <EditCourse />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/course-analytics/:courseId"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <CourseAnalytics />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/course-settings/:courseId"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <CourseSettings />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/course-preview/:courseId"
                  element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                      <CoursePreview />
                    </ProtectedRoute>
                  }
                />

                {/* Placeholder routes for navigation links */}
                <Route path="/courses" element={<Courses />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<div className="pt-20 text-center">Profile page coming soon!</div>} />
                <Route path="/wallet" element={<div className="pt-20 text-center">Wallet page coming soon!</div>} />

                {/* Certificate Pages */}
                <Route
                  path="/verify-certificate/:certificateId?"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'teacher']}>
                      <CertificateVerification />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/certificate-details/:id"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'teacher']}>
                      <CertificateDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/list-certificate/:certificateId"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <CertificateMarketplaceListing />
                    </ProtectedRoute>
                  }
                />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </BrowserRouter>
          </CourseProvider>
        </MarketplaceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
