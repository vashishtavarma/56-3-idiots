import React, { useEffect, useState } from 'react';

import { forklogo, notesLogo } from '../Constants';
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

  return (
    <section className="min-h-[90vh] bg-background text-foreground p-3 sm:p-5 antialiased">
      <div className="py-10 mx-auto max-w-screen-xl">
        <p className="text-foreground font-bold text-4xl">Explore Community</p>
        <p className="my-4 text-muted-foreground text-md">Explore a vibrant community of learners and creators! Discover shared journeys, and access valuable resources and notes. Contribute your own ideas, and take your learning to the next level.</p>
      </div>
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-card border border-border relative shadow-md sm:rounded-lg overflow-hidden text-card-foreground">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">Search Journeys</label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input type="text" id="simple-search" className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-2 focus:ring-ring focus:border-input block w-full pl-10 p-2" placeholder="Search Journeys" required="" />
                </div>
              </form>
            </div>
          </div>
          <div className="overflow-x-auto">
            {error ? (
              <p className="text-destructive">{error}</p>
            ) : (
              <table className="w-full text-sm text-left text-foreground">
                <thead className="text-xs uppercase bg-muted text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-4">Journey Name</th>
                    <th scope="col" className="px-4 py-3">Owner</th>
                    <th scope="col" className="px-4 py-3">Description</th>
                    <th scope="col" className="px-4 py-3">Notes</th>
                    <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {journeys.map(journey => (
                    <tr key={journey.id} className="border-b border-border">
                      <th scope="row" className="px-4 py-3 font-medium text-primary whitespace-nowrap cursor-pointer hover:underline">
                        {journey.title}
                      </th>
                      <td className="px-4 py-3 text-foreground">{journey.username}</td>
                      <td className="px-4 py-3 text-foreground">
                        {(() => {
                          if (journey.description.length <= 50) return journey.description;
                          const truncated = journey.description.substring(0, 50);
                          const lastSpaceIndex = truncated.lastIndexOf(' ');
                          return lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) + '...' : truncated + '...';
                        })()}</td>
                      <td className="px-4 py-3">
                        <Link to={`/notes/${journey.id}`}>
                          <img src={notesLogo} width="30px" className="cursor-pointer" alt="Notes" />
                        </Link>
                      </td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        { user.username === journey.username ? 
                         <Link to={'/'}
                         className="text-sm p-1 w-20 text-primary-foreground bg-primary rounded-md flex justify-center items-center hover:bg-primary/90 gap-[2px] ">
                             <span>Your's 🌟</span>
                            
                         </Link>
                         :

                        <button 
                        onClick={()=>handleFork(journey.id)}
                        className="text-sm p-2 text-primary-foreground bg-primary rounded-md flex justify-center items-center hover:bg-primary/90 gap-[2px] ">
                            <span>Fork</span>
                            <img src={forklogo} className='invert dark:invert-0' width={'15px'} alt="" />
                        </button>
                        }
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
