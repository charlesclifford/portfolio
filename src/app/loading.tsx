export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        {/* Track */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 40 40"
          fill="none"
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            className="text-border"
          />
        </svg>

        {/* Spinning arc */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 animate-spin"
          viewBox="0 0 40 40"
          fill="none"
          style={{ animationDuration: "0.8s" }}
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="30 70"
            className="text-accent"
          />
        </svg>
      </div>

      {/* Logo — pinned to bottom */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-baseline select-none">
        <span className="font-mono-logo text-accent text-lg font-medium">
          i
        </span>
        <span className="text-foreground text-lg font-medium">NsCliff</span>
      </div>
    </div>
  );
}
