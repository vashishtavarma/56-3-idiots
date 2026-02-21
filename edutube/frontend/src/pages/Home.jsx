import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateJourney from "../Components/forms/CreateJourney";
import { deleteJourney, getAllJourneys } from "../Api/journeys";

/* Visibility: eye (public) / lock (private) */
const IconVisibilityPublic = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const IconVisibilityPrivate = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
/* Notes: document with lines */
const IconNotes = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const deleteOneJourney = async (jid) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this journey?");
  
    if (isConfirmed) {
      try {
        await deleteJourney(jid);
        console.log("Journey deleted successfully.");
        fetchData()
      } catch (error) {
        console.error("Error deleting journey:", error);
      }
    } else {
      console.log("Deletion canceled.");
    }
  };

  const fetchData = async () => {
    const journeys = await getAllJourneys();
    if (journeys) {
      setData(journeys);
      console.log(journeys);  
    }
  };
  

  useEffect(() => {
    fetchData();
  }, [open, setOpen]);

  // Filter journeys by search query (title and description, case-insensitive)
  const filteredData = React.useMemo(() => {
    if (!data) return null;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (d) =>
        (d.title || "").toLowerCase().includes(q) ||
        (d.description || "").toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  const journeyCount = filteredData?.length ?? 0;
  const totalCount = data?.length ?? 0;

  return (
    <>
      <section className="min-h-[90vh] bg-background text-foreground antialiased">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
          {/* What you can do – quick wayfinding (top) */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">What you can do</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <h3 className="font-medium text-foreground">Open a journey</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Click any row below to open that journey and see chapters.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                <h3 className="font-medium text-foreground">Create new</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Use the “Create New Journey” button to add a learning path.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="font-medium text-foreground">Explore</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Browse and fork public journeys from the Explore page.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h3 className="font-medium text-foreground">Your profile</h3>
                <p className="text-sm text-muted-foreground mt-0.5">See progress and stats in your profile dashboard.</p>
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Your Journeys
          </h1>
          <p className="mt-1 text-muted-foreground text-sm sm:text-base mb-4">
            Click a journey to open it · Use search to filter · Create one to get started
          </p>
          {/* Quick stats + shortcuts */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/80 text-sm font-medium text-foreground">
              {searchQuery.trim() ? `${journeyCount} of ${totalCount} journeys` : `${totalCount} journey${totalCount !== 1 ? "s" : ""}`}
            </span>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Explore public journeys
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              View your profile
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden text-card-foreground">
            {/* Toolbar: search + create button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 border-b border-border">
              <div className="flex-1 min-w-0 max-w-md">
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background border-2 border-gray-400 dark:border-gray-500 text-foreground placeholder:text-muted-foreground text-sm rounded-lg block w-full pl-10 pr-4 py-2.5 transition-all duration-200 focus:ring-0 focus:border-primary focus:outline-none hover:border-gray-500 hover:dark:border-gray-400"
                    placeholder="Search your journeys"
                  />
                </div>
              </div>
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="inline-flex items-center justify-center gap-2 text-primary-foreground bg-primary hover:bg-primary/90 hover:shadow-md hover:scale-[1.02] focus:ring-0 font-medium rounded-lg text-sm px-4 py-2.5 transition-all duration-200 active:scale-[0.98]"
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Journey
                </button>
                <CreateJourney open={open} setOpen={setOpen} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-foreground">
                <thead className="text-xs uppercase bg-muted/80 text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 sm:px-5 py-3.5 font-semibold">Journey Name</th>
                    <th scope="col" className="px-4 sm:px-5 py-3.5 font-semibold">Description</th>
                    <th scope="col" className="px-4 sm:px-5 py-3.5 font-semibold whitespace-nowrap">Visibility</th>
                    <th scope="col" className="px-4 sm:px-5 py-3.5 font-semibold text-center w-20">Notes</th>
                    <th scope="col" className="px-4 sm:px-5 py-3.5 w-24"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData && filteredData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 sm:px-5 py-12 text-center">
                        {data?.length ? (
                          <p className="text-muted-foreground">No journeys match your search. Try a different keyword.</p>
                        ) : (
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">No journeys yet</p>
                              <p className="text-sm text-muted-foreground mt-0.5">Create your first journey or explore public ones.</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3">
                              <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="inline-flex items-center gap-2 text-primary-foreground bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm px-4 py-2.5 transition-all"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Create your first journey
                              </button>
                              <Link
                                to="/explore"
                                className="inline-flex items-center gap-2 border border-border hover:bg-muted font-medium rounded-lg text-sm px-4 py-2.5 transition-all text-foreground"
                              >
                                Explore public journeys
                              </Link>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                  {filteredData &&
                    filteredData.map((d) => (
                      <tr
                        role="button"
                        tabIndex={0}
                        aria-label={`Open ${d.title || "Untitled"}`}
                        onClick={() => navigate(`/journey/${d.id}`)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(`/journey/${d.id}`); } }}
                        className="border-b border-border hover:bg-muted/40 cursor-pointer transition-colors focus:outline-none focus:ring-0 focus:ring-inset" key={d.id}
                      >
                        <td className="px-4 sm:px-5 py-3.5 align-middle">
                          <span className="text-primary font-medium">{d.title || "Untitled"}</span>
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 max-w-[14rem] truncate text-muted-foreground align-middle">
                          {d.description || "No description"}
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 align-middle">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                            d.is_public
                              ? "bg-green-500/15 text-green-700 dark:text-green-300"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                          }`}>
                            {d.is_public ? (
                              <IconVisibilityPublic className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <IconVisibilityPrivate className="w-3.5 h-3.5 shrink-0" />
                            )}
                            {d.is_public ? "Public" : "Private"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                          <Link
                            to={`/notes/${d.id}`}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-110 transition-all duration-200"
                            aria-label="Open notes"
                          >
                            <IconNotes className="w-5 h-5 shrink-0" />
                          </Link>
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 align-middle" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => deleteOneJourney(d.id)}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 hover:scale-[1.02] rounded-lg px-2.5 py-1.5 transition-all duration-200 focus:outline-none focus:ring-0 active:scale-[0.98]"
                          >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                  {/* <tr className="border-b dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-foreground whitespace-nowrap"
                    >
                      <Link to={`/journey/${d.jId}`}>{d.journey}</Link>
                    </th>
                    <td className="px-4 py-3">{d.subject}</td>
                    <td className="px-4 py-3 max-w-[12rem] truncate">
                      {" "}
                      {d.Description}{" "}
                    </td>
                    <td className="px-4 py-3">$2999</td>
                    <td className="px-4 py-3 flex items-center justify-end">
                      
                    </td>

                    
                  </tr> */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- End block -->

<!-- Create modal --> */}
      <div
        id="createProductModal"
        tabIndex="-1"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative p-4 bg-card rounded-lg shadow border border-border text-card-foreground sm:p-5">
            {/* <!-- Modal header --> */}
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b border-border sm:mb-5">
              <h3 className="text-lg font-semibold text-foreground">
                Add Product
              </h3>
              <button
                type="button"
                className="text-muted-foreground bg-transparent hover:bg-accent hover:text-accent-foreground rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-target="createProductModal"
                data-modal-toggle="createProductModal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <form action="#">
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-0 block w-full p-2.5"
                    placeholder="Type product name"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="brand"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-0 block w-full p-2.5"
                    placeholder="Product brand"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-0 block w-full p-2.5"
                    placeholder="$2999"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-0 block w-full p-2.5"
                  >
                    <option value="">Select category</option>
                    <option value="TV">TV/Monitors</option>
                    <option value="PC">PC</option>
                    <option value="GA">Gaming/Console</option>
                    <option value="PH">Phones</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-foreground bg-background rounded-lg border border-input placeholder:text-muted-foreground focus:ring-0"
                    placeholder="Write product description here"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-primary-foreground inline-flex items-center bg-primary hover:bg-primary/90 focus:outline-none focus:ring-0 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                <svg
                  className="mr-1 -ml-1 w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add new product
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* <!-- Update modal --> */}
      <div
        id="updateProductModal"
        tabIndex="-1"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative p-4 bg-card rounded-lg shadow border border-border text-card-foreground sm:p-5">
            {/* <!-- Modal header --> */}
            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b border-border sm:mb-5">
              <h3 className="text-lg font-semibold text-foreground">
                Update Product
              </h3>
              <button
                type="button"
                className="text-muted-foreground bg-transparent hover:bg-accent hover:text-accent-foreground rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-toggle="updateProductModal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <form action="#">
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue="iPad Air Gen 5th Wi-Fi"
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-0 block w-full p-2.5"
                    placeholder="Ex. Apple iMac 27&ldquo;"
                  />
                </div>
                <div>
                  <label
                    htmlFor="brand"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    defaultValue="Google"
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-0 block w-full p-2.5"
                    placeholder="Ex. Apple"
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    defaultValue="399"
                    name="price"
                    id="price"
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-0 block w-full p-2.5"
                    placeholder="$299"
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-0 block w-full p-2.5"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="TV">TV/Monitors</option>
                    <option value="PC">PC</option>
                    <option value="GA">Gaming/Console</option>
                    <option value="PH">Phones</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="5"
                    className="block p-2.5 w-full text-sm text-foreground bg-background rounded-lg border border-input placeholder:text-muted-foreground focus:ring-0"
                    placeholder="Write a description..."
                    defaultValue="Standard glass, 3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-0 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Update product
                </button>
                <button
                  type="button"
                  className="text-destructive inline-flex items-center hover:text-destructive-foreground border border-destructive hover:bg-destructive focus:outline-none focus:ring-0 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  <svg
                    className="mr-1 -ml-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <!-- Read modal --> */}
      <div
        id="readProductModal"
        tabIndex="-1"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-xl max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative p-4 bg-card rounded-lg shadow border border-border text-card-foreground sm:p-5">
            {/* <!-- Modal header --> */}
            <div className="flex justify-between mb-4 rounded-t sm:mb-5">
              <div className="text-lg md:text-xl text-foreground">
                <h3 className="font-semibold ">Apple iMac 27”</h3>
                <p className="font-bold">$2999</p>
              </div>
              <div>
                <button
                  type="button"
                  className="text-muted-foreground bg-transparent hover:bg-accent hover:text-accent-foreground rounded-lg text-sm p-1.5 inline-flex"
                  data-modal-toggle="readProductModal"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
            </div>
            <dl>
              <dt className="mb-2 font-semibold leading-none text-foreground">
                Details
              </dt>
              <dd className="mb-4 font-light text-muted-foreground sm:mb-5">
                Standard glass ,3.8GHz 8-core 10th-generation Intel Core i7
                processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory,
                Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage,
                Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US.
              </dd>
              <dt className="mb-2 font-semibold leading-none text-foreground">
                Category
              </dt>
              <dd className="mb-4 font-light text-muted-foreground sm:mb-5">
                Electronics/PC
              </dd>
            </dl>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <button
                  type="button"
                  className="text-primary-foreground inline-flex items-center bg-primary hover:bg-primary/90 focus:outline-none focus:ring-0 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  <svg
                    aria-hidden="true"
                    className="mr-1 -ml-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path
                      fillRule="evenodd"
                      d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  type="button"
                  className="py-2.5 px-5 text-sm font-medium text-foreground focus:outline-none bg-card rounded-lg border border-border hover:bg-accent hover:text-accent-foreground focus:z-10 focus:ring-0"
                >
                  Preview
                </button>
              </div>
              <button
                type="button"
                className="inline-flex items-center text-destructive-foreground bg-destructive hover:bg-destructive/90 focus:outline-none focus:ring-0 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 mr-1.5 -ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        id="deleteModal"
        tabIndex="-1"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative p-4 text-center bg-card rounded-lg shadow border border-border text-card-foreground sm:p-5">
            <button
              type="button"
              className="text-muted-foreground absolute top-2.5 right-2.5 bg-transparent hover:bg-accent hover:text-accent-foreground rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              data-modal-toggle="deleteModal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <svg
              className="text-muted-foreground w-11 h-11 mb-3.5 mx-auto"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="mb-4 text-muted-foreground">
              Are you sure you want to delete this item?
            </p>
            <div className="flex justify-center items-center space-x-4">
              <button
                data-modal-toggle="deleteModal"
                type="button"
                className="py-2 px-3 text-sm font-medium text-muted-foreground bg-card rounded-lg border border-border hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-0 focus:z-10"
              >
                No, cancel
              </button>
              <button
                type="submit"
                className="py-2 px-3 text-sm font-medium text-center text-destructive-foreground bg-destructive rounded-lg hover:bg-destructive/90 focus:outline-none focus:ring-0"
              >
                Yes, I'm sure
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
