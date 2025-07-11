import { ArrowLeft } from "lucide-react"
import { MovieCard } from "components/ui/movie-card"
import { SidebarNav } from "components/ui/sidebar-nav"
import { HeaderFull } from "components/ui/header-full"


interface Movie {
  id: string
  title: string
  logoUrl: string
  initialRating: number
}

const movies: Movie[] = [
  { id: "1", title: "Flixy Originals", logoUrl: "/placeholder.svg?height=150&width=150", initialRating: 4 },
  { id: "2", title: "Space Odyssey", logoUrl: "/placeholder.svg?height=150&width=150", initialRating: 3 },
  { id: "3", title: "The Great Escape", logoUrl: "/placeholder.svg?height=150&width=150", initialRating: 5 },
  { id: "4", title: "Mystery Island", logoUrl: "/placeholder.svg?height=150&width=150", initialRating: 2 },
  { id: "5", title: "Future City", logoUrl: "/placeholder.svg?height=150&width=150", initialRating: 4 },
  { id: "6", title: "Ancient Secrets", logoUrl: "/placeholder.svg?height=150&width=150", initialRating: 3 },
  { id: "7", title: "Deep Sea Dive", logoUrl: "/placeholder.svg?height=150&width=150", initialRating: 1 },
  { id: "8", title: "Mountain Trek", logoUrl: "/placeholder.svg?height=150&width=150", initialRating: 5 },
]

export default function MoviesPage() {
  return (
    <html lang="es">
      <body>
        <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
          <SidebarNav />

          <div className="flex-1 overflow-y-auto">
            <HeaderFull />
            {/* Movies Section */}
            <main className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Movies
                </h1>
                <p className="text-gray-300">
                  Rate movies you've watched and share your thoughts
                </p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </body>

      {/* <Outlet /> */}
    </html>
  )
}
