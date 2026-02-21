import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { createJourney, createJourneyWithPlaylist, getAllJourneys } from "../../Api/journeys";
import { useNavigate } from "react-router-dom";
import { extractPlaylistId } from "../../Constants";

const CreateJourney = ({ open, setOpen }) => {
  const [title, setTitle] = useState("");
  const [playlist, setPlaylist] = useState("");
  const [description, setDescription] = useState("");
  const [is_public, setIsPublic] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const journeyData = {
      title,
      description,
      is_public,
    };
    console.log(journeyData);

    try {
      const result = await createJourney(journeyData);
      await getAllJourneys();
      console.log(result);
      setOpen(!open);
    } catch (error) {
      console.error("Error creating journey:", error);
    }
  };

  const createWithPlayist = async (e) => {
    e.preventDefault();
    const journeyData = {
      playlistId : extractPlaylistId(playlist),
      is_public,
    };
    console.log(journeyData);

    try {
      const result = await createJourneyWithPlaylist(journeyData);
      await getAllJourneys();
      console.log(result);
      setOpen(!open);
    } catch (error) {
      console.error("Error creating journey:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/50 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative transform overflow-hidden rounded-lg border border-border text-left shadow-xl transition-all sm:my-8 w-full max-w-6xl text-foreground bg-card" style={{ backgroundColor: 'var(--card)' }}>
            <div className="px-6 py-8 bg-card" style={{ backgroundColor: 'var(--card)' }}>
              <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                {/* Form to create custom journey */}
                <div className="flex-1 bg-muted rounded-lg p-6 shadow-lg border border-border" style={{ backgroundColor: 'var(--muted)' }}>
                  <h2 className="mb-6 text-2xl font-bold text-center">
                    Create Custom Journey
                  </h2>
              <form
                onSubmit={handleSubmit}
                className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              >
                <div>
                  <label
                    htmlFor="jn"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    Journey Name
                  </label>
                  <input
                    type="text"
                    id="jn"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    name="jn"
                    className="bg-background border border-input text-foreground text-sm rounded-lg focus:ring-2 focus:ring-ring block w-full p-3 placeholder:text-muted-foreground"
                    placeholder="Enter journey name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    name="description"
                    rows="4"
                    placeholder="Describe your learning journey..."
                    className="bg-background border border-input text-foreground text-sm rounded-lg focus:ring-2 focus:ring-ring block w-full p-3 placeholder:text-muted-foreground resize-none"
                    required
                  />
                </div>

                <div>
                  <span className="block mb-2 text-sm font-medium text-foreground">
                    Visibility
                  </span>
                  <div className="flex gap-6">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="custom-private"
                        name="custom-visibility"
                        value="private"
                        className="w-4 h-4 text-primary bg-background border-input focus:ring-ring focus:ring-2"
                        onChange={(e) => setIsPublic(false)}
                        checked={!is_public}
                        required
                      />
                      <label
                        htmlFor="custom-private"
                        className="ml-2 text-sm font-medium text-muted-foreground"
                      >
                        Private
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="custom-public"
                        name="custom-visibility"
                        value="public"
                        className="w-4 h-4 text-primary bg-background border-input focus:ring-ring focus:ring-2"
                        onChange={(e) => setIsPublic(true)}
                        checked={is_public}
                        required
                      />
                      <label
                        htmlFor="custom-public"
                        className="ml-2 text-sm font-medium text-muted-foreground"
                      >
                        Public
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-ring font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Done
                </button>
              </form>
            </div>

                {/* OR separator */}
                <div className="flex items-center justify-center lg:flex-col lg:justify-center">
                  <div className="flex items-center">
                    <div className="border-t border-border flex-1 lg:border-t-0 lg:border-l lg:h-8"></div>
                    <span className="px-4 text-xl font-bold text-muted-foreground lg:py-4 lg:px-0">OR</span>
                    <div className="border-t border-border flex-1 lg:border-t-0 lg:border-l lg:h-8"></div>
                  </div>
                </div>

                {/* Form to create with playlist */}
                <div className="flex-1 bg-muted rounded-lg p-6 shadow-lg border border-border" style={{ backgroundColor: 'var(--muted)' }}>
                  <h2 className="mb-6 text-2xl font-bold text-center">
                    Create with Playlist
                  </h2>
              <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" 
              onSubmit={(e)=>createWithPlayist(e)}
              >
                <div>
                  <label
                    htmlFor="playlist"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    Playlist URL
                  </label>
                  <input
                    type="text"
                    id="playlist"
                    value={playlist}
                    onChange={(e) => setPlaylist(e.target.value)}
                    name="playlist"
                    placeholder="https://www.youtube.com/playlist?list=..."
                    className="bg-background border border-input text-foreground text-sm rounded-lg focus:ring-2 focus:ring-ring block w-full p-3 placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div>
                  <span className="block mb-2 text-sm font-medium text-foreground">
                    Visibility
                  </span>
                  <div className="flex gap-6">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="playlist-private"
                        name="playlist-visibility"
                        value="private"
                        className="w-4 h-4 text-primary bg-background border-input focus:ring-ring focus:ring-2"
                        onChange={() => setIsPublic(false)}
                        checked={!is_public}
                        required
                      />
                      <label
                        htmlFor="playlist-private"
                        className="ml-2 text-sm font-medium text-muted-foreground"
                      >
                        Private
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="playlist-public"
                        name="playlist-visibility"
                        value="public"
                        className="w-4 h-4 text-primary bg-background border-input focus:ring-ring focus:ring-2"
                        onChange={() => setIsPublic(true)}
                        checked={is_public}
                        required
                      />
                      <label
                        htmlFor="playlist-public"
                        className="ml-2 text-sm font-medium text-muted-foreground"
                      >
                        Public
                      </label>
                    </div>
                  </div>
                </div>

                  <button
                    type="submit"
                    className="w-full text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-ring font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors duration-200"
                  >
                    Create from Playlist
                  </button>
                </form>
                </div>
              </div>
              
              {/* Close button */}
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 text-sm font-medium text-muted-foreground bg-transparent border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateJourney;
