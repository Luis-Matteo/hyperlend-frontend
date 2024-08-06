type ProgressBarProps = {
  progress: number;
};

function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray rounded-full h-1.5">
      <div
        className="bg-secondary h-full rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default ProgressBar;
