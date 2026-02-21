import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JourneyProgressBarChart from "../Components/Dashboard/JourneyProgressBarChart";
import { calculateProgress } from "../Constants";
import { getUserProfile } from "../Api";
import { getAllJourneys } from "../Api/journeys";
import { getChaptersByJourneyId } from "../Api/chapters";

const ProfileDashboard = () => {
  const [user, setUser] = useState(null);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJourneys = async () => {
    try {
      const journeyList = await getAllJourneys();
      const withProgress = await Promise.all(
        journeyList.map(async (journey) => {
          const chapters = await getChaptersByJourneyId(journey.id);
          const pct = calculateProgress(chapters);
          const progress = typeof pct === "string" ? parseInt(pct, 10) : pct;
          return {
            id: journey.id,
            name: journey.title,
            completed: progress,
            remaining: Math.max(0, 100 - progress),
          };
        })
      );
      setJourneys(withProgress);
    } catch (error) {
      console.error("Error fetching journeys:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile(setUser);
    fetchJourneys();
  }, []);

  const overallJourneys = journeys.map((j) => ({ name: j.name, progress: j.completed }));
  const totalJourneys = journeys.length;
  const avgProgress =
    totalJourneys > 0
      ? Math.round(journeys.reduce((acc, j) => acc + j.completed, 0) / totalJourneys)
      : 0;
  const completedCount = journeys.filter((j) => j.completed >= 100).length;

  const getInitial = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile hero */}
        <section className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden mb-8">
          <div className="h-24 sm:h-28 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <div className="px-6 sm:px-8 pb-6 -mt-12 sm:-mt-14 relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-card bg-primary text-primary-foreground flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-lg flex-shrink-0"
                aria-hidden
              >
                {user ? getInitial(user.username) : "—"}
              </div>
              <div className="mt-4 sm:mt-0 sm:pb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {user?.username ?? "Profile"}
                </h1>
                <p className="text-muted-foreground mt-0.5">{user?.email ?? "—"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Total journeys
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">{totalJourneys}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Average progress
            </p>
            <p className="mt-1 text-2xl font-bold text-primary">{avgProgress}%</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Completed
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">{completedCount}</p>
          </div>
        </section>

        {/* Journey progress list */}
        <section className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Your journeys</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track progress per journey
            </p>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              <div className="px-6 py-12 text-center text-muted-foreground">
                Loading…
              </div>
            ) : journeys.length === 0 ? (
              <div className="px-6 py-12 text-center text-muted-foreground">
                No journeys yet.{" "}
                <Link to="/" className="text-primary font-medium hover:underline">
                  Create one
                </Link>
              </div>
            ) : (
              journeys.map((journey) => (
                <Link
                  key={journey.id}
                  to={`/journey/${journey.id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 hover:bg-muted/40 transition-colors focus:outline-none focus:ring-0 focus:ring-inset"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{journey.name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {journey.completed}% complete
                    </p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-48 flex-shrink-0">
                    <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.min(100, journey.completed)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-10 text-right">
                      {journey.completed}%
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Journey progress bar chart – tracks user record per journey */}
        <section>
          <JourneyProgressBarChart journeys={overallJourneys} />
        </section>
      </div>
    </div>
  );
};

export default ProfileDashboard;
