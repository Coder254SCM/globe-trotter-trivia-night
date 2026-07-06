import { Link } from "react-router-dom";

export const SiteFooter = () => (
  <footer className="mt-12 border-t bg-background/60">
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} Global Quiz Game</p>
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link to="/terms" className="hover:text-foreground">Terms</Link>
        <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
        <Link to="/account" className="hover:text-foreground">Account</Link>
        <a href="mailto:scmcoded@gmail.com" className="hover:text-foreground">Contact</a>
      </nav>
    </div>
  </footer>
);

export default SiteFooter;
