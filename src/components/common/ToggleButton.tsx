import React from "react";

type ToggleButtonPropsProps = {
    status: boolean;
    setStatus: React.Dispatch<React.SetStateAction<boolean>>;
    onClick?: any;
};

function ToggleButton({ status, setStatus, onClick }: ToggleButtonPropsProps) {
    return (
        <button
            type="button"
            className={`p-0.5 rounded-full flex items-center duration-500 ${
              status ? "bg-green-500" : "bg-[#081916]"
            }`}
            onClick={() => { setStatus((prev) => !prev); onClick ? onClick() : '' }}
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
