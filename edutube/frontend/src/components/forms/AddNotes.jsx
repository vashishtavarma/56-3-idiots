import React, { useEffect } from "react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createNote, getNotesByChapter, updateNote } from "../../Api/notes";
import { AlertModal } from "../../components/ui/alert-modal";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }], // Add color and background color options
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "color",
  "background", // Add color and background to formats
  "align",
];

const AddNotes = ({ journeyId, chapterId, variant }) => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [noteId, setNoteId] = useState("");
  const [submitMode, setSubmit] = useState(true);
  const [successAlert, setSuccessAlert] = useState({ open: false, message: "" });

  const handleSubmit = async () => {
    try {
      await createNote(journeyId, chapterId, value, title);
      fetchNotes();
      setSuccessAlert({ open: true, message: "Notes added successfully." });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateNote(noteId, value, title);
      fetchNotes();
      setSuccessAlert({ open: true, message: "Notes updated successfully." });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await getNotesByChapter(chapterId);
      if (response?.length) {
        setTitle(response[0].title ?? "");
        setValue(response[0].content ?? "");
        setSubmit(false);
        setNoteId(response[0].id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("chapterid:", chapterId);
    fetchNotes();
    console.log('fetching notes--------');
  }, [])

  const isSidebar = variant === "sidebar";

  return (
    <section className="block text-foreground">
      <div className={isSidebar ? "py-0" : "mx-auto max-w-4xl px-4 py-8 lg:py-16"}>
        <h2 className={isSidebar ? "mb-5 text-lg font-bold text-foreground" : "mb-4 text-xl font-bold text-foreground"}>
          Add notes
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (submitMode) handleSubmit();
            else handleUpdate();
          }}
          className={`text-foreground ${isSidebar ? "space-y-5" : "space-y-4"}`}
        >
          <div className={isSidebar ? "space-y-1.5" : ""}>
            <label htmlFor="note-title" className="block text-sm font-medium text-foreground">
              Note title
            </label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Key points from this video"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            />
          </div>
          <div className={isSidebar ? "space-y-1.5" : ""}>
            <label className="block text-sm font-medium text-foreground">
              Content
            </label>
            <ReactQuill
              className="notes-editor notes-editor-study"
              value={value}
              onChange={setValue}
              modules={modules}
              formats={formats}
            />
          </div>
          <div className={isSidebar ? "pt-1" : ""}>
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 focus:outline-none focus:ring-0"
            >
              {submitMode ? "Save note" : "Update note"}
            </button>
          </div>
        </form>
      </div>

      <AlertModal
        open={successAlert.open}
        onClose={() => setSuccessAlert((s) => ({ ...s, open: false }))}
        title="Done"
        message={successAlert.message}
        buttonLabel="OK"
      />
    </section>
  );
};

export default AddNotes;
