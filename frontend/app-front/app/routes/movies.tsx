// import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MovieCard } from "components/ui/movie-card"
import { SidebarNav } from "components/ui/sidebar-nav"

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
          <div>
            {/* Movies Section */}
            <main className="p-8">
              <h1 className="text-4xl font-bold mb-10 text-center">Our Movie Collection</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 justify-items-center">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
