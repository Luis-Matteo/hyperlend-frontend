import React from "react";

type ToggleButtonPropsProps = {
    status: boolean;
    setStatus: React.Dispatch<React.SetStateAction<boolean>>;
};

function ToggleButton({ status, setStatus }: ToggleButtonPropsProps) {
    return (
        <button
            type="button"
            className="p-0.5 bg-[#081916] rounded-full flex items-center"
            onClick={() => { setStatus((prev) => !prev) }}
        >
            <div
                className={`p-2 rounded-full transition-all duration-500 ${status
                    ? "bg-secondary translate-x-0"
                    : "bg-transparent translate-x-full"
                    }`}
            />
            <div
                className={`p-2 rounded-full transition-all duration-500 ${!status
                    ? "bg-secondary translate-x-0"
                    : "bg-transparent -translate-x-full"
                    }`}
            />
        </button>
    );
}

export default ToggleButton;
