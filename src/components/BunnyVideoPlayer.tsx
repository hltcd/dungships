"use client";

interface BunnyVideoPlayerProps {
  videoId: string;
  libraryId?: string;
  title?: string;
}

export default function BunnyVideoPlayer({
  videoId,
  libraryId,
  title = "Course Video",
}: BunnyVideoPlayerProps) {
  // Use env variable or prop
  const LIBRARY_ID = libraryId || process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;

  if (!LIBRARY_ID) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Library ID not configured</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        src={`https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}?autoplay=false&loop=false&muted=false&preload=true`}
        loading="lazy"
        style={{
          border: "none",
          width: "100%",
          height: "100%",
        }}
        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
        allowFullScreen
        title={title}
      />
    </div>
  );
}
