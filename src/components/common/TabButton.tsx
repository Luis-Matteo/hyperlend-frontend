interface TabButtonProps {
  isActive: boolean;
  label: string;
  activeButton: string | number;
  setActiveButton: React.Dispatch<React.SetStateAction<any>>;
}

const TabButton: React.FC<TabButtonProps> = ({
  isActive,
  activeButton,
  label,
  setActiveButton,
}) => {
  return (
    <div className='flex flex-col items-center'>
      <button onClick={() => setActiveButton(activeButton)}>
        <p
          className={`text-base font-lufga capitalize transition-colors duration-300 ease-in-out ${isActive ? 'text-white' : 'text-[#CAEAE566] hover:text-white'}`}
        >
          {label}
        </p>
      </button>
      <hr
        className={`w-full mt-4 border transition-colors duration-300 ease-in-out ${isActive ? 'text-white' : 'text-[#546764]'}`}
      />
    </div>
  );
};

export default TabButton;
