import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from '../../contexts/ThemeContext';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

// Explicit colors so Chart.js legend is readable in both themes (canvas doesn't resolve CSS vars reliably)
const LEGEND_COLOR_LIGHT = '#374151';
const LEGEND_COLOR_DARK = '#e5e7eb';

const JourneyPieChart = ({ data, title }) => {
  const { isDark } = useTheme();
  const legendColor = isDark ? LEGEND_COLOR_DARK : LEGEND_COLOR_LIGHT;

  const chartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        label: title,
        data: [data.completed, data.remaining],
        backgroundColor: ['#16a34a', 'gray'],
        hoverBackgroundColor: ['#22c55e', '#6a7979c2'],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: legendColor,
          font: { size: 13 },
        },
      },
    },
  };

  return (
    <div className="bg-card border border-border p-6 rounded-xl shadow-sm text-center text-card-foreground">
      <h4 className="text-xl font-semibold text-foreground mb-4">{title}</h4>
      <div className="max-w-xs mx-auto">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default JourneyPieChart;
