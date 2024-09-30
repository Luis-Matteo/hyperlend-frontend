type ProgressBarProps = {
  progress: number;
  className?: string;
  control?: boolean;
};

function ProgressBar({
  progress,
  className,
  control = false,
}: ProgressBarProps) {
  return (
    <div className={`w-full bg-gray rounded-full relative ${className}`}>
      {/* Progress bar */}
      <div
        className='bg-secondary h-full rounded-full'
        style={{ width: `${progress}%` }}
      />
      {control && (
        <div
          className='absolute top-1/2 transform -translate-y-1/2 bg-secondary rounded-full'
          style={{
            left: `${progress}%`,
            width: '16px',
            height: '16px',
            marginLeft: '-8px',
          }}
        />
      )}
    </div>
  );
}

export default ProgressBar;
