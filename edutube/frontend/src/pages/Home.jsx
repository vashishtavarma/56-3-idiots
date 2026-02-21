import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateJourney from "../Components/forms/CreateJourney";
import { deleteJourney, getAllJourneys } from "../Api/journeys";
import { notesLogo } from "../Constants";

const Home = () => {

  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);

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
  }, [open,setOpen]); 

  return (
    <>
      <section className="min-h-[90vh] bg-background text-foreground p-3 sm:p-5 antialiased">
        <h1 className="py-10 mx-auto max-w-screen-xl text-foreground font-bold text-2xl">
          Your Journeys
        </h1>
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
          <div className="bg-card border border-border relative shadow-md sm:rounded-lg overflow-hidden text-card-foreground">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label htmlFor="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-muted-foreground"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-2 focus:ring-ring focus:border-input block w-full pl-10 p-2"
                      placeholder="Search Your Journey"
                      required=""
                    />
                  </div>
                </form>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  id="createProductModalButton"
                  data-modal-target="createProductModal"
                  data-modal-toggle="createProductModal"
                  className="flex items-center justify-center text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-4 focus:ring-ring font-medium rounded-lg text-sm px-4 py-2 focus:outline-none"
                >
                  <span className="font-bold text-2xl pb-1 mx-2"> +</span>{" "}
                  Create New Journey
                </button>

                <CreateJourney open={open} setOpen={setOpen} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-foreground">
                <thead className="text-xs uppercase bg-muted text-muted-foreground">
                  <tr>
                   
                    <th scope="col" className="px-4 py-3">
                      Journey Name
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Visibility
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Notes
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data &&
                    data.map((d, i) => (
                      <tr className="border-b border-border" key={d.id}>
                       
                        <td className="px-4 py-3">
                        <Link className="text-primary cursor-pointer hover:underline font-medium" to={`/journey/${d.id}`}>
                          {d.title ? d.title : "Untitled"}
                        </Link>
                        </td>
                        <td className="px-4 py-3 max-w-[12rem] truncate text-foreground">
                          {d.description
                            ? d.description
                            : "No description available"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            d.is_public 
                              ? 'bg-green-600/20 text-green-800 dark:text-green-200' 
                              : 'bg-yellow-600/20 text-yellow-800 dark:text-yellow-200'
                          }`}>
                            {d.is_public?'public':'private'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/notes/${d.id}`}>
                          <img src={notesLogo} width={'30px'} className=" cursor-pointer " alt="" />
                          </Link>
                          </td>
                        <td className="px-4 py-3 flex items-center justify-end">
                          <button
                            className="inline-flex items-center text-sm font-medium p-1.5 text-destructive hover:bg-destructive/20 rounded-lg focus:outline-none"
                            type="button"
                            onClick={()=>deleteOneJourney(d.id)}
                          >
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
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-2 focus:ring-ring block w-full p-2.5"
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
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-2 focus:ring-ring block w-full p-2.5"
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
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-2 focus:ring-ring block w-full p-2.5"
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
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-2 focus:ring-ring block w-full p-2.5"
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
                    className="block p-2.5 w-full text-sm text-foreground bg-background rounded-lg border border-input placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                    placeholder="Write product description here"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-primary-foreground inline-flex items-center bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-ring font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-2 focus:ring-ring block w-full p-2.5"
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
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-2 focus:ring-ring block w-full p-2.5"
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
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-2 focus:ring-ring block w-full p-2.5"
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
                    className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-2 focus:ring-ring block w-full p-2.5"
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
                    className="block p-2.5 w-full text-sm text-foreground bg-background rounded-lg border border-input placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                    placeholder="Write a description..."
                    defaultValue="Standard glass, 3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-ring font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Update product
                </button>
                <button
                  type="button"
                  className="text-destructive inline-flex items-center hover:text-destructive-foreground border border-destructive hover:bg-destructive focus:ring-4 focus:outline-none focus:ring-ring font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                  className="text-primary-foreground inline-flex items-center bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-ring font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                  className="py-2.5 px-5 text-sm font-medium text-foreground focus:outline-none bg-card rounded-lg border border-border hover:bg-accent hover:text-accent-foreground focus:z-10 focus:ring-4 focus:ring-ring"
                >
                  Preview
                </button>
              </div>
              <button
                type="button"
                className="inline-flex items-center text-destructive-foreground bg-destructive hover:bg-destructive/90 focus:ring-4 focus:outline-none focus:ring-ring font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                className="py-2 px-3 text-sm font-medium text-muted-foreground bg-card rounded-lg border border-border hover:bg-accent hover:text-accent-foreground focus:ring-4 focus:outline-none focus:ring-ring focus:z-10"
              >
                No, cancel
              </button>
              <button
                type="submit"
                className="py-2 px-3 text-sm font-medium text-center text-destructive-foreground bg-destructive rounded-lg hover:bg-destructive/90 focus:ring-4 focus:outline-none focus:ring-ring"
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
