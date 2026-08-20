import { getCurrentUser } from "@/lib/auth";
import { Sidebar, MobileTopBar } from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const sidebarUser = user ? { username: user.username } : null;

  return (
    <div className="flex min-h-full flex-1">
      <Sidebar user={sidebarUser} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar user={sidebarUser} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
