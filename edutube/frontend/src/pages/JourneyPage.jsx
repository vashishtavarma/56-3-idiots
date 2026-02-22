import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { calculateProgress } from "../Constants";
import CreateChapter from "../Components/forms/CreateChapter";
import AddNotes from "../Components/forms/AddNotes";
import EditChapter from "../Components/forms/EditChapter";
import VideoPlayer from "../Components/VideoPlayer";
import { getJourneyById } from "../Api/journeys";
import {
  deleteChapter,
  getChaptersByJourneyId,
  updateChapterComplete,
} from "../Api/chapters";
import { RainbowButton } from "../components/ui/rainbow-button";
import { ConfirmDialog } from "../components/ui/confirm-dialog";

const JourneyPage = () => {
  const [toggleDropDown, setToggleDD] = useState("hidden");
  const toggleDD = () => {
    setToggleDD(toggleDropDown === "hidden" ? " " : "hidden");
  };

  const [chapters, setChapters] = useState([]);

  const { jId } = useParams();
  const [open, setOpen] = useState(false);
  const [chapterId, setChapterId] = useState(null);
  const [chDetails, setChDetails] = useState(null);
  const [openNotes, setOpenNotes] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [jData, setJData] = useState("");
  const [progress, setProgress] = useState(0);
  const [deleteChapterConfirmOpen, setDeleteChapterConfirmOpen] = useState(false);
  const [chapterIdToDelete, setChapterIdToDelete] = useState(null);

  const openDeleteChapterConfirm = (chapterId) => {
    setChapterIdToDelete(chapterId);
    setDeleteChapterConfirmOpen(true);
  };

  const closeDeleteChapterConfirm = () => {
    setDeleteChapterConfirmOpen(false);
    setChapterIdToDelete(null);
  };

  const deleteOneChapter = async () => {
    if (!chapterIdToDelete) return;
    try {
      await deleteChapter(chapterIdToDelete);
      fetchData();
      closeDeleteChapterConfirm();
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  const updateCheckBox = async (check, chId) => {
    const chapterData = {
      is_completed: !check, // Toggle the completion status
    };
  
    try {
      const response = await updateChapterComplete(chId, chapterData);
      console.log(response);
      await fetchData(); // Wait for the data to be fetched before calculating progress
    } catch (error) {
      console.error('Error updating chapter:', error);
    }
  };
  
  const fetchData = async () => {
    try {
      const journeys = await getJourneyById(jId);
      const chapterList = await getChaptersByJourneyId(jId);
  
      if (journeys) {
        setJData(journeys);
        console.log('Journey data:', journeys);
      }
  
      if (chapterList) {
        setChapters(chapterList);
        console.log('Chapters:', chapterList);
        getProgress(chapterList);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const getProgress = (chapterList) => {
    if(chapterList.length !== 0){

      const percent = calculateProgress(chapterList);
      console.log('Progress:', percent);
      setProgress(percent);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [open, setOpen, setOpenEdit]); // Only dependencies necessary for re-fetching
  
  

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Playlist header */}
      <section className="px-4 py-6 md:py-8">
        <div className="mx-auto max-w-screen-xl rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
                {jData.title || "—"}
              </h1>
              <p className="mt-2 text-muted-foreground md:text-lg">
                {jData.description || "—"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    jData.is_public
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {jData.is_public ? "Public" : "Private"}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  Progress: {progress}%
                </span>
              </div>
              <div className="mt-4 w-full max-w-md">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link
                to={`/notes/${jData.id}`}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-base font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-0"
              >
                Notes
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-screen-xl rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-foreground md:text-2xl">
              Chapters
            </h2>
            <button
              onClick={() => setOpen(true)}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-0"
            >
              <span className="text-lg leading-none">+</span>
              Add New Chapter
            </button>
          </div>
          <CreateChapter open={open} setOpen={setOpen} journeyId={jId} />
          <EditChapter
            openEdit={openEdit}
            setOpenEdit={setOpenEdit}
            chapterId={chapterId}
            chDetails={chDetails}
          />

          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-left text-foreground">
              <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3.5 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">
                    #
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">
                    Chapter Title
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {!chapters?.length && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                      <p className="font-medium">No chapters yet</p>
                      <p className="mt-1 text-sm">Add your first chapter to get started.</p>
                      <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
                      >
                        + Add New Chapter
                      </button>
                    </td>
                  </tr>
                )}
                {chapters &&
                  chapters.map((chapter, index) => (
                    <tr
                      key={chapter.id}
                      className="border-b border-border transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3.5 align-middle">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!chapter.is_completed}
                            onChange={() =>
                              updateCheckBox(chapter.is_completed, chapter.id)
                            }
                            className="h-4 w-4 cursor-pointer rounded border-border bg-background text-primary focus:outline-none focus:ring-0 focus:ring-offset-0"
                          />
                          <span className="sr-only">Mark as {chapter.is_completed ? "incomplete" : "complete"}</span>
                        </label>
                      </td>
                      <th
                        scope="row"
                        className="px-4 py-3.5 font-medium text-muted-foreground whitespace-nowrap"
                      >
                        {index + 1}
                      </th>
                      <td className="px-4 py-3.5">
                        <Link
                          to={`/player/${chapter.id}`}
                          className="font-medium text-primary transition-colors hover:underline"
                        >
                          {chapter.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Link
                            to={`/notes/${jId}?chapterId=${chapter.id}`}
                            className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                          >
                            Notes
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setChDetails(chapter);
                              setChapterId(chapter.id);
                              setOpenEdit(true);
                            }}
                            className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                          >
                            Edit
                          </button>
                          <RainbowButton
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => openDeleteChapterConfirm(chapter.id)}
                            className="text-destructive"
                          >
                            Delete
                          </RainbowButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </section>

      <ConfirmDialog
        open={deleteChapterConfirmOpen}
        onClose={closeDeleteChapterConfirm}
        title="Delete chapter?"
        message="Are you sure you want to delete this chapter? This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={deleteOneChapter}
        variant="danger"
      />
    </div>
  );
};

export default JourneyPage;
