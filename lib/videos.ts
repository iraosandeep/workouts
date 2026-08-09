const API_BASE = "https://movewiki.vercel.app/api/videos";

export type Exercise = {
  name: string;
  url: string;
  title: string;
  category: string;
};

type VideosResponse = {
  total: number;
  videos: { name: string; url: string }[];
};

function toTitle(name: string) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function toCategory(name: string) {
  const [first] = name.split("-");
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export function videoUrlForName(name: string) {
  return `${API_BASE}/${name}`;
}

export async function fetchExercises(): Promise<Exercise[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error(`Failed to load exercises: ${response.status}`);
  }
  const data: VideosResponse = await response.json();
  return data.videos.map((video) => ({
    name: video.name,
    url: video.url,
    title: toTitle(video.name),
    category: toCategory(video.name),
  }));
}
