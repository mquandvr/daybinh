import { UI_TEXT } from "@/constants";

export function Footer() {
  return (
    <footer className="py-12 border-t border-gray-100 mt-12 bg-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          &copy; {new Date().getFullYear()} {UI_TEXT.APP_TITLE}
        </p>
        <p className="text-[10px] text-gray-300 font-medium uppercase tracking-[0.2em]">
          {UI_TEXT.DATA_SOURCE}
        </p>
      </div>
    </footer>
  );
}
