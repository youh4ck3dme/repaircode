const SkeletonLine = ({ width = "w-full", height = "h-3" }) => (
  <div className={`${width} ${height} bg-white/10 rounded-full animate-pulse`} />
);

const LoadingSkeleton = ({
  lines = 3,
  showAvatar = false,
  className = "",
  variant = "panel",
  loadingText = "Načítavam…",
}) => {
  if (variant === "card") {
    return (
      <div className={`p-8 rounded-2xl bg-surface border border-white/5 ${className}`}>
        <div className="w-12 h-12 bg-white/10 rounded-lg animate-pulse mb-6" />
        <SkeletonLine width="w-3/4" height="h-5" />
        <div className="mt-3 space-y-2">
          <SkeletonLine />
          <SkeletonLine width="w-5/6" />
          <SkeletonLine width="w-4/6" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      {showAvatar && (
        <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse mb-4" />
      )}
      <div className="w-full max-w-xs space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine
            key={i}
            width={i % 2 === 0 ? "w-full" : "w-3/4"}
            height="h-3"
          />
        ))}
      </div>
      {loadingText && (
        <p className="text-gray-500 text-sm mt-4 animate-pulse">{loadingText}</p>
      )}
    </div>
  );
};

export default LoadingSkeleton;
