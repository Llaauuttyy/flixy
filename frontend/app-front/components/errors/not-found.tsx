import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function NotFound() {
  const { t } = useTranslation();

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
            {t("not_found.title_oops")} <br />
            {t("not_found.it_seems")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              Flixy
            </span>{" "}
            {t("not_found.got_it_wrong")}
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto md:mx-0">
            {t("not_found.description_begin")}
            <br />
            <Link to="/" className="text-purple-400 hover:text-purple-300">
              {t("not_found.link_home")}
            </Link>
            , {t("not_found.description_end")}
          </p>
        </div>
      </main>

      <footer className="container mx-auto py-6 px-4 text-center border-t border-gray-800">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Flixy. {t("general.rights_reserved")}
        </p>
      </footer>
    </div>
  );
}
