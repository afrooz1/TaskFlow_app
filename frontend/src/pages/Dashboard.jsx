import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const baseURL = import.meta.env.VITE_API_BASE_URL;
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import {
  FiPlus,
  FiCheck,
  FiClock,
  FiUser,
  FiPieChart,
  FiList
} from "react-icons/fi";

const COLORS = ["#10B981", "#F59E0B", "#3B82F6"];

const getInitials = (name) =>
  name?.split(" ").map((n) => n[0]).join("").toUpperCase();

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    overdue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tasksRes, statsRes] = await Promise.all([
        axios.get(`${baseURL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${baseURL}/tasks/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setTasks(tasksRes.data);
      setStats(statsRes.data || {
        total: tasksRes.data.length,
        completed: tasksRes.data.filter(t => t.completed).length,
        pending: tasksRes.data.filter(t => !t.completed).length,
        highPriority: tasksRes.data.filter(t => t.priority === 'high').length,
        mediumPriority: tasksRes.data.filter(t => t.priority === 'medium').length,
        lowPriority: tasksRes.data.filter(t => t.priority === 'low').length,
        overdue: tasksRes.data.filter(t =>
          t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
        ).length
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = {
    pieData: [
      { name: "Completed", value: stats.completed },
      { name: "Pending", value: stats.pending },
    ],
    priorityData: [
      { name: "High", count: stats.highPriority },
      { name: "Medium", count: stats.mediumPriority },
      { name: "Low", count: stats.lowPriority },
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiPieChart className="text-cyber-blue-600" /> Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name || "User"}! Here's your productivity overview.
          </p>
        </div>
        <button
          onClick={() => navigate("/tasks")}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-cyber-blue-600 hover:bg-cyber-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          <FiPlus /> Add New Task
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Tasks"
              value={stats.total}
              icon={<FiList className="text-cyber-blue-600" />}
              color="bg-cyber-blue-100"
            />
            <StatCard
              title="Completed"
              value={stats.completed}
              icon={<FiCheck className="text-green-600" />}
              color="bg-green-100"
              percentage={stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              icon={<FiClock className="text-yellow-600" />}
              color="bg-yellow-100"
              percentage={stats.total ? Math.round((stats.pending / stats.total) * 100) : 0}
            />
            <StatCard
              title="Overdue"
              value={stats.overdue}
              icon={<FiClock className="text-red-600" />}
              color="bg-red-100"
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-cyber-blue-600 to-cyber-blue-700 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white text-cyber-blue-700 flex items-center justify-center text-2xl font-bold shadow-lg">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{user?.name}</h2>
                    <p className="text-sm opacity-90">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member since</span>
                    <span className="font-medium">
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Productivity</span>
                    <span className="font-medium">
                      {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pie Chart */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiPieChart /> Task Status Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiList /> Tasks by Priority
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.priorityData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#3B82F6" name="Tasks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiClock /> Recent Tasks
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task._id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/tasks/${task._id}`)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${task.completed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {task.completed ? "Completed" : "Pending"}
                      </span>
                      {task.priority && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${task.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  No tasks found. Create your first task to get started!
                </div>
              )}
            </div>
            {tasks.length > 5 && (
              <div className="px-6 py-3 border-t border-gray-200 text-center">
                <button
                  onClick={() => navigate("/tasks")}
                  className="text-cyber-blue-600 hover:text-cyber-blue-700 text-sm font-medium"
                >
                  View all tasks ({tasks.length})
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, percentage }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {React.cloneElement(icon, { className: "text-xl" })}
        </div>
      </div>
      {percentage !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${title === "Completed" ? "bg-green-500" : "bg-yellow-500"
                }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{percentage}% of total</p>
        </div>
      )}
    </div>
  </div>
);

export default Dashboard;