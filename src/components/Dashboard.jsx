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

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [students, setStudents] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [subjects, setSubjects] = useState([]);

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
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await getStudents();
        setSubjects(res.data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };
    fetchSubjects();
  }, []);

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
  }, []);

  const handleCardClick = async (type) => {
    try {
      let response;
      switch (type) {
        case 'students':
          setModalTitle('All Students');
          response = await getStudents();
          setStudents(response.data);
          console.log("line 56 dashboard students", response);
          
          break;
        case 'subjects':
          setModalTitle('All Subjects');
          response = await getSubjects();
          break;
        case 'results':
          setModalTitle('All Results');
          response = await getAllResults();
          break;
        default:
          return;
      }
      setModalContent(response.data);
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
    }
  };

  if (!data) return <div className="dashboard-page"><div className="dashboard-container"><div className="loading-text">Loading Dashboard...</div></div></div>;

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

  // Chart options
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
        <h1 className="dashboard-header">Performance Dashboard</h1>

        <div className="dashboard-grid">
          {/* KPI cards */}
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
              <p className="stat-value">{Math.round(data.classAverage)}</p>
              <p className="stat-label">Class Avg</p>
            </div>
          </div>

          {/* Subject averages (wide bar) */}
          <div className="dashboard-card col-span-8">
            <h3 className="card-title">Average by Subject</h3>
            <div className="chart-wrap">
              <Bar data={subjectAvgData} options={chartOptions} />
            </div>
          </div>

          {/* Top students (narrow horizontal bar) */}
          <div className="dashboard-card col-span-4">
            <h3 className="card-title">Top Students</h3>
            <div className="chart-wrap">
              <Bar data={topStudentsData} options={horizontalChartOptions} />
            </div>
          </div>

          {/* Score distribution (doughnut, full width on smaller) */}
          <div className="dashboard-card col-span-6">
            <h3 className="card-title">Score Distribution</h3>
            <div className="chart-wrap">
              <Doughnut data={scoreDistributionData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>

          {/* Attention list */}
          <div className="dashboard-card col-span-6">
            <h3 className="card-title">Needs Attention</h3>
            {data.studentsNeedingAttention && data.studentsNeedingAttention.length > 0 ? (
              <ul className="attention-list">
                {data.studentsNeedingAttention.map((s) => (
                  <li key={s.name}>{s.name} — Avg {Math.round(s.avg)}</li>
                ))}
              </ul>
            ) : (
              <div className="loading-text">No students currently need attention. Great job! 🥳</div>
            )}
          </div>
        </div>
      </div>
      <Modal
        title={modalTitle}
        items={modalContent}
        onClose={() => setModalContent(null)}
        renderItem={(item) => {
          switch (modalTitle) {
            case 'All Students':
              return <li key={item._id}>{item.name} ({item.className})</li>;
            case 'All Subjects':
              return <li key={item._id}>{item.name}</li>;
            case 'All Results':
              return (
                <li key={item._id}>
                  {item.student?.name} - {item.subject?.name}: <strong>{item.score}</strong>
                </li>
              );
            default:
              return null;
          }
        }}
      />
    </div>
  );
}
