import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardChartsProps {
  menungguReview: number;
  diterima: number;
  ditolak: number;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  menungguReview,
  diterima,
  ditolak
}) => {
  const barData = {
    labels: ['Apr', 'Mei', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Proposal Masuk',
        data: [0, 0, 1, 3], // Example static data, can be made dynamic later
        backgroundColor: 'rgba(198,0,15,0.8)',
        borderRadius: 4,
      }
    ]
  };

  const pieData = {
    labels: ['Menunggu', 'Diterima', 'Ditolak'],
    datasets: [
      {
        data: [menungguReview, diterima, ditolak],
        backgroundColor: ['#ffc107', '#28a745', '#dc3545'],
        borderWidth: 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#ffffff' }
      },
      x: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#ffffff' }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#ffffff',
          padding: 20,
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3>Tren Pengajuan Proposal</h3>
        <div className="chart-wrapper">
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
      <div className="chart-card">
        <h3>Status Proposal</h3>
        <div className="chart-wrapper">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
