import { useEffect, useState } from "react";
import "./LoadingPage.css";

export default function LoadingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex animate-fade-in flex-col items-center gap-8">
        <div className="relative">
          <div className="h-20 w-20 animate-spin-slow rounded-full border-4 border-muted dark:border-muted/50">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary dark:border-t-primary/90" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 animate-pulse rounded-full bg-primary/20 dark:bg-primary/30" />
            <div className="absolute h-8 w-8 animate-ping rounded-full bg-primary/40 dark:bg-primary/50" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-primary dark:text-primary/90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="animate-pulse font-medium text-foreground text-lg dark:text-foreground/95">
            Preparing your workspace
            <span className="ml-1 inline-flex">
              <span className="animate-bounce [animation-delay:0ms]">.</span>
              <span className="animate-bounce [animation-delay:150ms]">.</span>
              <span className="animate-bounce [animation-delay:300ms]">.</span>
            </span>
          </p>
        </div>

        <div className="h-1 w-64 overflow-hidden rounded-full bg-muted dark:bg-muted/50">
          <div className="h-full animate-progress-indeterminate rounded-full bg-primary dark:bg-primary/90 dark:shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
        </div>
      </div>
    </div>
  );
}
