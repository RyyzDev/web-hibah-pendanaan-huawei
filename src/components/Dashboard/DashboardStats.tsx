import React from 'react';
import { IoClipboard, IoHourglass, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

interface DashboardStatsProps {
  totalProposal: number;
  menungguReview: number;
  diterima: number;
  ditolak: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalProposal,
  menungguReview,
  diterima,
  ditolak
}) => {
  const stats = [
    { label: 'Total Proposal', value: totalProposal, icon: IoClipboard, bg: 'rgba(198,0,15,0.08)' },
    { label: 'Menunggu Review', value: menungguReview, icon: IoHourglass, bg: '#fff3cd' },
    { label: 'Diterima', value: diterima, icon: IoCheckmarkCircle, bg: '#d4edda' },
    { label: 'Ditolak', value: ditolak, icon: IoCloseCircle, bg: '#f8d7da' },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div className="stat-card" key={stat.label}>
          <div className="stat-icon" style={{ background: stat.bg }}>
            <stat.icon />
          </div>
          <div className="stat-info">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
