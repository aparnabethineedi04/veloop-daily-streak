import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import DailyStreakPage from './pages/DailyStreak/DailyStreakPage.jsx';

function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/daily-streak" element={<Protected><DailyStreakPage /></Protected>} />
      <Route path="*" element={<Navigate to="/daily-streak" replace />} />
    </Routes>
  );
}
