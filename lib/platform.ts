export const areaLinks = [
  { key: "services", label: "Services", href: "/services", color: "cobalt", description: "Build and support the systems your business depends on." },
  { key: "learn", label: "Learn", href: "/learn", color: "sky", description: "Build practical digital skills, one lesson at a time." },
  { key: "marketing", label: "Marketing", href: "/marketing", color: "coral", description: "Reach the right people with clear digital marketing." },
  { key: "jobs", label: "Jobs", href: "/jobs", color: "mint", description: "Find opportunities and connect with growing teams." },
  { key: "play", label: "Play", href: "/play", color: "violet", description: "Play, meet and make something fun together." },
] as const;

export const mockCourses = [
  { title: "Digital basics", level: "Beginner", duration: "4 lessons", progress: 35, accent: "sky" },
  { title: "Work smarter with AI", level: "Beginner", duration: "6 lessons", progress: 10, accent: "cobalt" },
  { title: "Build your first website", level: "Intermediate", duration: "8 lessons", progress: 0, accent: "violet" },
];

export const mockJobs = [
  { title: "Junior web assistant", company: "Demo employer", location: "Addis Ababa", type: "Full-time", tags: ["Web", "Beginner-friendly"], posted: "Posted recently" },
  { title: "Digital marketing intern", company: "Placeholder studio", location: "Remote", type: "Internship", tags: ["Marketing", "Content"], posted: "Posted recently" },
  { title: "IT support technician", company: "Example business", location: "Adama", type: "Part-time", tags: ["IT support", "On-site"], posted: "Posted recently" },
];

export const mockGames = [
  { title: "Dodge the Blocks", players: "1 player", accent: "violet" },
  { title: "Quick Draw", players: "2–8 players", accent: "violet" },
  { title: "Word Sprint", players: "2–6 players", accent: "cobalt" },
  { title: "Puzzle room", players: "1–4 players", accent: "coral" },
];

export const mockFriends = [
  { name: "Mekdes", status: "Online", color: "bg-mint" },
  { name: "Dawit", status: "In a game", color: "bg-violet" },
  { name: "Hanna", status: "Away", color: "bg-amber" },
];
