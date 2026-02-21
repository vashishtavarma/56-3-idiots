import React, { useEffect, useState } from 'react';

import { forklogo } from '../Constants';

/* Notes: document with lines */
const IconNotes = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
import { Link, useNavigate } from 'react-router-dom';
import { fetchPublicJourneys, forkJourney } from '../Api/journeys';
import { getUserProfile } from '../Api';

const Explore = () => {
  const [journeys, setJourneys] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});

  const loadPublicJourneys = async () => {
    try {
      const data = await fetchPublicJourneys();
      setJourneys(data);
      console.log(journeys);
    } catch (error) {
      setError('Failed to load public journeys');
    }
  };
    const navigate = useNavigate()

  const handleFork = async (journeyId) => {
    try {
      const { journeyId: newJourneyId } = await forkJourney(journeyId);
      alert('Journey forked successfully! with id ', newJourneyId);
        navigate('/')
    } catch (error) {
      console.error(error);
      alert('Failed to fork the journey');
    }
  };

  useEffect(() => {
    loadPublicJourneys();
    getUserProfile(setUser);
  }, []);

  const truncate = (str, len = 50) => {
    if (!str || str.length <= len) return str || "";
    const cut = str.substring(0, len);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > 0 ? cut.substring(0, lastSpace) : cut) + "…";
  };

  return (
    <section className="min-h-[90vh] bg-background text-foreground antialiased">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Explore Community
        </h1>
        <p className="text-muted-foreground text-base mb-6 max-w-2xl">
          Discover shared journeys, access resources and notes, and fork any journey to your account.
        </p>
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden text-card-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 border-b border-border">
            <div className="flex-1 min-w-0 max-w-md">
              <label htmlFor="explore-search" className="sr-only">Search journeys</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="explore-search"
                  className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-0 focus:border-primary block w-full pl-10 pr-4 py-2.5"
                  placeholder="Search journeys"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {error ? (
              <p className="p-4 text-destructive font-medium">{error}</p>
            ) : (
              <table className="w-full text-sm text-left text-foreground">
                <thead className="text-xs uppercase bg-muted/80 text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 sm:px-5 py-3.5 font-semibold">Journey Name</th>
                    <th scope="col" className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Owner</th>
                    <th scope="col" className="px-4 sm:px-5 py-3.5 font-semibold">Description</th>
                    <th scope="col" className="px-4 sm:px-5 py-3.5 font-semibold text-center w-20">Notes</th>
                    <th scope="col" className="px-4 sm:px-5 py-3.5 w-28"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {journeys.map((journey) => (
                    <tr key={journey.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 sm:px-5 py-3.5 align-middle font-medium text-foreground whitespace-nowrap">
                        {journey.title || "Untitled"}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 align-middle text-muted-foreground">
                        {journey.username}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 max-w-[14rem] truncate text-muted-foreground align-middle">
                        {truncate(journey.description || "") || "—"}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-center align-middle">
                        <Link
                          to={`/notes/${journey.id}`}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          aria-label="Open notes"
                        >
                          <IconNotes className="w-5 h-5 shrink-0" />
                        </Link>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 align-middle">
                        {user.username === journey.username ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/15 text-primary border border-primary/20">
                            Yours
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleFork(journey.id)}
                            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg px-3 py-2 transition-colors focus:outline-none focus:ring-0"
                          >
                            <img src={forklogo} className="w-4 h-4 shrink-0 invert dark:invert-0" alt="" aria-hidden />
                            Fork
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Explore;
