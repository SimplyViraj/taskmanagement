import {  Bell, Plus } from "lucide-react";

export function DashboardHeader({children}: { children?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between px-6 py-4  bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {children}
        </h1>
      </div>

      <div className="flex items-center gap-2">

        {/* Create button */}
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200">
          <Plus className="w-4 h-4" />
          Create
        </button>

        <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200">
          <Bell className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
         {children?.toString().charAt(0).toUpperCase() || 'U'}
        </div>

      </div>
    </header>
  );
}