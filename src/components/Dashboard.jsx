import { useEffect, useState } from 'react';
import {
  getDashboardSummary,
  getStudents,
  getSubjects,
  getAllResults,
} from '../api/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import './Dashboard.css';
import Modal from './Modal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard({ userName, refreshKey }) {
  const [data, setData] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getStudents();
        setStudents(res.data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };
    fetchStudents();
  }, [refreshKey]);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await getSubjects();
        setSubjects(res.data);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      }
    };
    fetchSubjects();
  }, [refreshKey]);

  // Fetch dashboard summary
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardSummary();
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchData();
  }, [refreshKey]);

  const handleCardClick = async (type) => {
    setIsModalOpen(true);
    setModalContent(null);

    try {
      let dataForModal;

      switch (type) {
        case 'students':
          setModalTitle('All Students');
          dataForModal = (await getStudents()).data;
          break;
        case 'subjects':
          setModalTitle('All Subjects');
          dataForModal = (await getSubjects()).data;
          break;
        case 'results':
          setModalTitle('All Results');
          dataForModal = (await getAllResults()).data;
          break;
        default:
          return;
      }

      setModalContent(Array.isArray(dataForModal) ? dataForModal : []);
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
      setModalContent([]);
    }
  };

  if (!data)
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading-text">Loading Dashboard...</div>
        </div>
      </div>
    );

  // Chart data
  const subjectAvgData = {
    labels: Object.keys(data.avgPerSubject),
    datasets: [
      {
        label: 'Average Score',
        data: Object.values(data.avgPerSubject),
        backgroundColor: 'rgba(0, 121, 107, 0.7)',
        borderColor: 'rgba(0, 121, 107, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const topStudentsData = {
    labels: data.top3Students.map((s) => s.name),
    datasets: [
      {
        label: 'Average Score',
        data: data.top3Students.map((s) => s.avg),
        backgroundColor: 'rgba(255, 179, 0, 0.7)',
        borderColor: 'rgba(255, 179, 0, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const scoreDistributionData = {
    labels: Object.keys(data.scoreDistribution),
    datasets: [
      {
        label: 'Number of Students',
        data: Object.values(data.scoreDistribution),
        backgroundColor: [
          '#00796b',
          '#ffb300',
          '#4db6ac',
          '#ff8f00',
          '#80cbc4',
          '#ffd54f',
        ],
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxRotation: 0 } },
      y: { grid: { color: 'rgba(0,0,0,0.06)' }, beginAtZero: true },
    },
  };

  const horizontalChartOptions = {
    ...chartOptions,
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.06)' }, beginAtZero: true },
      y: { grid: { display: false } },
    },
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* Typing Welcome Message */}
        <div className="welcome-message">
  <span>Welcome back,</span> <span className="teacher-name">{userName}</span>! Hope you have a fantastic day 🌟
</div>

        <h1 className="dashboard-header">Performance Dashboard</h1>

        <div className="dashboard-grid">
          {/* KPI Cards */}
          <div className="dashboard-card col-span-3 interactive" onClick={() => handleCardClick('students')}>
            <div className="stat-card">
              <p className="stat-value">{students.length}</p>
              <p className="stat-label">Total Students</p>
            </div>
          </div>

          <div className="dashboard-card col-span-3 interactive" onClick={() => handleCardClick('subjects')}>
            <div className="stat-card">
              <p className="stat-value">{subjects.length}</p>
              <p className="stat-label">Subjects</p>
            </div>
          </div>

          <div className="dashboard-card col-span-3 interactive" onClick={() => handleCardClick('results')}>
            <div className="stat-card">
              <p className="stat-value">{data.resultsCount}</p>
              <p className="stat-label">Results</p>
            </div>
          </div>

          <div className="dashboard-card col-span-3">
            <div className="stat-card">
              <p className="stat-value">{Math.round(data.overallClassAverage)}</p>
              <p className="stat-label">Class Avg</p>
            </div>
          </div>

          {/* Subject Averages */}
          <div className="dashboard-card col-span-8">
            <h3 className="card-title">Average by Subject</h3>
            <div className="chart-wrap">
              <Bar data={subjectAvgData} options={chartOptions} />
            </div>
          </div>

          {/* Top Students */}
          <div className="dashboard-card col-span-4">
            <h3 className="card-title">Top Students</h3>
            <div className="chart-wrap">
              <Bar data={topStudentsData} options={horizontalChartOptions} />
            </div>
          </div>

          {/* Score Distribution */}
          <div className="dashboard-card col-span-6">
            <h3 className="card-title">Score Distribution</h3>
            <div className="chart-wrap">
              <Doughnut data={scoreDistributionData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }}} />
            </div>
          </div>

          {/* Needs Attention */}
          <div className="dashboard-card col-span-6">
            <h3 className="card-title">Needs Attention</h3>
            {data.needingAttention && data.needingAttention.length > 0 ? (
              <ul className="attention-list">
                {data.needingAttention.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            ) : (
              <div className="loading-text">No students currently need attention. Great job! 🥳</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          title={modalTitle}
          items={modalContent}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
