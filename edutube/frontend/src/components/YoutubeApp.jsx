import React from 'react';
import YouTube from 'react-youtube';

const YouTubeApp = ({ videoId }) => {
  const useIframe = true;

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  // 16:9 aspect-ratio wrapper so the video fits the box and is never cropped
  return (
    <div className="block w-full">
      {videoId ? (
        useIframe ? (
          <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
            <iframe
              title="YouTube Video"
              className="absolute inset-0 h-full w-full border-0"
              src={`https://www.youtube.com/embed/${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
            <YouTube videoId={videoId} opts={opts} className="absolute inset-0 h-full w-full" />
          </div>
        )
      ) : (
        <p className="p-4 text-muted-foreground">No video selected</p>
      )}
    </div>
  );
};

export default YouTubeApp;