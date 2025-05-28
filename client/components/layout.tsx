import { useRouter } from "next/router";


const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Main content */}
      <div className="flex-grow">{children}</div>

      {/* Tab Navigation */}
      <div
        role="tablist"
        className="fixed bottom-0 left-0 right-0 tabs tabs-boxed p-3"
      >
        <a
          role="tab"
          className={`tab h-16 ${isActive("/") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/"
        >
          <img src="/icons/white/home-1.svg" alt="Home" className="w-8 h-8" />
        </a>
        <a
          role="tab"
          className={`tab h-16 ${isActive("/boosts") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/boosts"
        >
          <img src="/icons/white/basket.svg" alt="Boosts" className="w-8 h-8" />
        </a>
        <a
          role="tab"
          className={`tab h-16 ${isActive("/tasks") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/tasks"
        >
          <img src="/icons/white/invoice-1.svg" alt="Tasks" className="w-8 h-8" />
        </a>
        <a
          role="tab"
          className={`tab h-16 ${isActive("/friends") ? "border-2 border-accent shadow-glow" : ""}`}
          href="/friends"
        >
          <img src="/icons/white/user-group.svg" alt="Friends" className="w-8 h-8" />
        </a>
      </div>
    </div>
  );
};

export default Layout;