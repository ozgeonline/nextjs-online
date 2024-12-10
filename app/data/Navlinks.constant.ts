interface linkProps {
  name: string;
  href: string;
  id: string
}

export const links: linkProps[] = [
  { id: "0", name: "Home", href: "/home" },
  { id: "1", name: "TV Shows", href: "/home/shows" },
  { id: "2", name: "Movies", href: "/home/movies" },
  { id: "3", name: "New & Popular", href: "/home/new" },
  { id: "4", name: "My List", href: "/home/user/list" },
  { id: "5", name: "Browse by Languages", href: "/home/audio" }
]