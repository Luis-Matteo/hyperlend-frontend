import { formatUnit } from "../../utils/functions";

type PositionBarProps = {
  total: number;
  available: number;
};

function PositionBar({ total, available }: PositionBarProps) {
  return (
    <>
      <div className={`w-full rounded-lg border h-6 border-[#2A2A2A]`}>
        <div
          className="bg-secondary h-full rounded-lg"
          style={{ width: `${(available * 100) / total}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between">
        {new Array(9).fill(0).map((_, index) => (
          <span className="w-0.5 h-2 bg-[#2A2A2A]" key={index}></span>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-center">
        {new Array(5).fill(0).map((_, index) => (
          <span className="text-white text-sm" key={index}>
            {formatUnit((total * index) / 4, 1)}
          </span>
        ))}
      </div>
    </>
  );
}

export default PositionBar;
