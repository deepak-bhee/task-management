import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ labels = [], values = [], color = '#6366f1' }) {
  if (typeof window === 'undefined') {
    return <div style={{ height: 200 }} />;
  }

  const safeLabels = Array.isArray(labels) ? labels.map((l) => String(l)) : [];
  const safeValues = Array.isArray(values) ? values.map((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }) : [];

  while (safeValues.length < safeLabels.length) safeValues.push(0);
  while (safeLabels.length < safeValues.length) safeLabels.push('');

  const data = {
    labels: safeLabels,
    datasets: [
      {
        label: 'Activity',
        data: safeValues,
        backgroundColor: color
      }
    ]
  };

  const options = { plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } };

  return (
    <div style={{ height: 200 }}>
      <Bar data={data} options={options} />
    </div>
  );
}
