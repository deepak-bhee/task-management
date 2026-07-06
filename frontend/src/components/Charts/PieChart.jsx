import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ labels = [], values = [], colors = [] }) {
  // Guard for SSR or environments without window
  if (typeof window === 'undefined') {
    return <div style={{ height: 220 }} />;
  }

  const safeLabels = Array.isArray(labels) ? labels.map((l) => String(l)) : [];
  const safeValues = Array.isArray(values) ? values.map((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }) : [];

  // Ensure arrays align
  while (safeValues.length < safeLabels.length) safeValues.push(0);
  while (safeLabels.length < safeValues.length) safeLabels.push('');

  const data = {
    labels: safeLabels,
    datasets: [
      {
        data: safeValues,
        backgroundColor: (Array.isArray(colors) && colors.length >= safeValues.length) ? colors : ['#6366f1', '#10b981', '#f97316', '#ef4444'],
        borderWidth: 0
      }
    ]
  };

  const options = { plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false };

  return (
    <div style={{ height: 220 }}>
      <Pie data={data} options={options} />
    </div>
  );
}
