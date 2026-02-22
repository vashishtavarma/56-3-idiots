import React, { useEffect, useState } from "react";
import YouTubeApp from "../Components/YoutubeApp.jsx";
import AddNotes from "../Components/forms/AddNotes";
import { useParams } from "react-router-dom";
import { getChaptersById } from "../Api/chapters.js";
import { extractVideoId } from "../Constants/index.js";

const VideoPlayerPage = () => {
  const { chapterId } = useParams(); // Get chapter ID from URL params
  const [videoId, setVideoId] = useState("");
  const [chapter, setChapter] = useState(null); // Initialize as null to check loading state

  // Function to fetch chapter data
  const fetchChapter = async () => {
    try {
      const chapterData = await getChaptersById(chapterId); // Fetch chapter data
      setChapter(chapterData);
      if (chapterData.video_link) {
        const videoId = extractVideoId(chapterData.video_link); // Extract video ID
        setVideoId(videoId);
      }
    } catch (error) {
      console.error("Error fetching chapter data:", error);
    }
  };

  useEffect(() => {
    fetchChapter(); // Fetch chapter when component mounts or chapterId changes
  }, [chapterId]);

  // Return loading state while waiting for data
  if (!chapter) {
    return <div className="text-foreground">Loading...</div>;
  }

  // Helper function to truncate text on word boundaries
  const truncateText = (text, maxLength = 150) => {
    if (!text) return text;
    
    // Check if text ends abruptly (not with proper punctuation or complete words)
    const lastChar = text.trim().slice(-1);
    const endsAbruptly = text.length >= maxLength && !/[.!?;,]$/.test(lastChar) && !/\s$/.test(text);
    
    if (text.length <= maxLength && !endsAbruptly) return text;
    
    // If text is exactly at limit but ends abruptly, or exceeds limit, truncate properly
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    return lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) + '...' : truncated + '...';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 md:py-8">
        {/* Header: title and description with clear spacing */}
        <header className="mb-8">
          <h1 className="text-xl font-bold text-foreground md:text-2xl lg:text-3xl">
            {chapter.title}
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            {truncateText(chapter.description)}
          </p>
        </header>

        {/* 60% video | 40% notes with gap – no clubbing */}
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="min-w-0 flex-[6] lg:min-w-[60%]">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <YouTubeApp videoId={videoId} />
            </div>
          </div>
          <aside className="min-w-0 flex-[4] lg:min-w-[40%]">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm md:p-6">
              <AddNotes journeyId={chapter.journey_id} chapterId={chapter.id} variant="sidebar" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
