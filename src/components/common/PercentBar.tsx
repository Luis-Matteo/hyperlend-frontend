type ProgressBarProps = {
  progress: number;
  className?:string;
};

function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className={`w-full bg-gray rounded-full ${className}`}>
      <div
        className="bg-secondary h-full rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default ProgressBar;
