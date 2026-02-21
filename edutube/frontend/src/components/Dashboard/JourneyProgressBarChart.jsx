import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Bar chart components (required for tree-shaking in Chart.js 4)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Legend
);

/**
 * Bar chart showing progress % per journey for user record tracking.
 * @param {{ journeys: { name: string, progress: number }[] }} props
 */
const JourneyProgressBarChart = ({ journeys }) => {
  const labels = journeys.map((j) => j.name);
  const data = journeys.map((j) => j.progress);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Progress (%)",
        data,
        backgroundColor: "rgba(79, 70, 229, 0.8)",
        borderColor: "#4f46e5",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(99, 102, 241, 0.9)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: labels.length > 8 ? "y" : "x",
    scales: {
      x: {
        ticks: { color: "hsl(var(--foreground))", maxRotation: 45 },
        grid: { color: "hsl(var(--border))" },
        ...(labels.length > 8 ? { beginAtZero: true, max: 100 } : {}),
      },
      y: {
        ticks: { color: "hsl(var(--foreground))" },
        grid: { color: "hsl(var(--border))" },
        ...(labels.length > 8 ? {} : { beginAtZero: true, max: 100 }),
      },
    },
    plugins: {
      legend: { labels: { color: "hsl(var(--foreground))" } },
      tooltip: {
        callbacks: {
          label: (ctx) => `Progress: ${ctx.raw}%`,
        },
      },
    },
  };

  if (journeys.length === 0) {
    return (
      <div className="bg-card border border-border p-6 rounded-lg shadow text-card-foreground">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Journey progress
        </h3>
        <p className="text-muted-foreground text-center py-8">
          No journey data to display yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border p-6 rounded-lg shadow text-card-foreground">
      <h3 className="text-xl font-semibold text-foreground mb-4">
        Journey progress
      </h3>
      <div className={labels.length > 8 ? "h-[400px]" : "h-[280px]"}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default JourneyProgressBarChart;
