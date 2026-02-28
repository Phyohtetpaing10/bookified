import { BookOpen } from "lucide-react";

const LoadingOverlay = () => {
  return (
    <div className="loading-wrapper">
      <div className="loading-shadow-wrapper">
        <div className="loading-shadow bg-[#f8f4e9] p-8 border border-[#8B7355]/20 shadow-xl">
          <BookOpen className="loading-animation w-12 h-12 text-[#663820]" />
          <h2 className="loading-title">Synthesizing...</h2>
          <div className="loading-progress">
            <div className="loading-progress-item">
              <span className="loading-progress-status"></span>
              <span className="text-[#3d485e] font-medium">
                Processing your library addition
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
