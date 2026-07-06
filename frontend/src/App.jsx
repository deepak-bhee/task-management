import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import CreateTask from './pages/CreateTask.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EditTask from './pages/EditTask.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import MyTasks from './pages/MyTasks.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import TaskDetails from './pages/TaskDetails.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<MyTasks />} />
          <Route path="/tasks/new" element={<CreateTask />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/tasks/:id/edit" element={<EditTask />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
