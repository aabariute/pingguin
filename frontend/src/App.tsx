import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/auth/AuthProvider";
import { ChatProvider } from "./context/chat/ChatProvider";
import { UserProvider } from "./context/user/UserProvider";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <ChatProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route element={<ProtectedRoute />}>
                  <Route index element={<HomePage />} />
                </Route>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </ChatProvider>
        </UserProvider>
      </AuthProvider>

      <Toaster
        position="bottom-center"
        gutter={8}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 4000 },
          style: {
            fontSize: "14px",
            maxWidth: "500px",
            padding: "8px 12px",
            backgroundColor: "white",
            color: "#0f0b01",
          },
        }}
      />
    </BrowserRouter>
  );
}
