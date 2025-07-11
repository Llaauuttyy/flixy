import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center justify-center gap-2">
          <img src="./flixy-logo.png" alt="Flixy Logo" width={40} height={40} />
          <span className="text-white font-medium">Flixy</span>
        </div>
      </header>

      <main className="flex-1 container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 px-4 py-10">
        <div className="w-full md:w-5/8 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Oops! <br/>
            It seems {" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
               Flixy 
            </span>
            {" "} got it wrong...
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto md:mx-0">
            It doesn't look like the place to be hanging out.<br/>
            <Link to="/" className="text-purple-400 hover:text-purple-300">
                Go back home
            </Link>
            , instead!
          </p>
        </div>

      </main>

      <footer className="container mx-auto py-6 px-4 text-center border-t border-gray-800">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Flixy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
