export type Show = {
  slug: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  status?: string;
};

export const SHOWS: Show[] = [
  {
    slug: "berlin-2025",
    name: "Live in Berlin",
    date: "2025-09-10",
    venue: "Berghain",
    city: "Berlin",
    status: "Booked",
  },
  {
    slug: "paris-2025",
    name: "Paris Night",
    date: "2025-09-20",
    venue: "Rex Club",
    city: "Paris",
    status: "In Progress",
  },
];

