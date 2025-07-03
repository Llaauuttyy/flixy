// import Image from "next/image"
import { useState } from "react"
import { StarRating } from "./star-rating"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

interface MovieCardProps {
  movie: {
    id: string
    title: string
    logoUrl: string
    initialRating: number
  }
}

export function MovieCard({ movie }: MovieCardProps) {
  const [showRating, setShowRating] = useState(false)
  const [currentRating, setCurrentRating] = useState(movie.initialRating)

  const handleRatingChange = (newRating: number) => {
    setCurrentRating(newRating)
    // In a real application, you would typically send this rating to a backend.
    console.log(`Movie "${movie.title}" rated: ${newRating} stars`)
  }

  return (
    <Card
      className="relative w-64 h-80 bg-slate-800 border-slate-700 flex flex-col items-center justify-center p-4 overflow-hidden group"
      onMouseEnter={() => setShowRating(true)}
      onMouseLeave={() => setShowRating(false)}
    >
      <CardHeader className="p-0 pb-4 text-center">
        <CardTitle className="text-white text-lg">{movie.title}</CardTitle>
      </CardHeader>
      <CardContent className="relative w-full h-full flex items-center justify-center p-0">
        <img
          src={movie.logoUrl || "/placeholder.svg"}
          alt={`${movie.title} logo`}
          width={150}
          height={150}
          className="object-contain transition-transform duration-300 group-hover:scale-90"
        />
        {/* Rating overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-slate-800/90 transition-opacity duration-300 ${
            showRating ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <StarRating initialRating={currentRating} onRatingChange={handleRatingChange} size={32} />
        </div>
      </CardContent>
    </Card>
  )
}
