import { Film, Heart, MessageSquare, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../button";

export function ShareYourThoughts() {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-8 h-full hover:border-pink-500/40 transition-all duration-300">
      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all duration-500" />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/15 transition-all duration-500" />

      {/* Floating decorative icons */}
      <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
        <Film className="w-20 h-20 text-pink-500" />
      </div>
      <div className="absolute bottom-8 left-6 opacity-5 group-hover:opacity-10 transition-opacity -rotate-12">
        <Heart className="w-14 h-14 text-pink-500" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20">
            <Star className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span className="text-sm font-semibold text-pink-500">
              Community
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
            How Was Your Last Watch?
          </h2>

          <p className="text-slate-400 leading-relaxed">
            Share your thoughts and help others discover great films. Your voice
            matters in our growing community.
          </p>
        </div>

        <Link to="/reviews" className="w-full">
          <Button
            size="lg"
            variant="outline"
            className="w-full border-2 border-pink-500/50 text-pink-500 hover:bg-pink-500 hover:text-white font-semibold rounded-xl transition-all hover:scale-[1.02] group-hover:scale-[1.02] bg-pink-500/5 hover:border-pink-500"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Write a Review
          </Button>
        </Link>
      </div>
    </div>
  );
}
