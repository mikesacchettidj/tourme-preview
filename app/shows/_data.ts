export type Show = {
  slug: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  status?: "Booked" | "In Progress" | "Completed" | "Cancelled";
};

export const SHOWS: Show[] = [
  {
    slug: "berlin-berghain-2025",
    name: "Berghain",
    date: "2025-09-14",
    venue: "Berghain Club",
    city: "Berlin",
    status: "Booked",
  },
  {
    slug: "paris-rex-2025",
    name: "Rex Club",
    date: "2025-09-20",
    venue: "Rex Club",
    city: "Paris",
    status: "In Progress",
  },
  {
    slug: "madrid-fabric-2025",
    name: "Fabrik",
    date: "2025-09-28",
    venue: "Fabrik Madrid",
    city: "Madrid",
    status: "Completed",
  },
];

