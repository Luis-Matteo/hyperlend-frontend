type CustomIconProps = {
  mainDivStyles?: string;
  iconImage?: string;
  width?: string;
  height?: string;
};
const CustomIcon = ({
  iconImage,
  mainDivStyles,
  width,
  height,
}: CustomIconProps) => {
  return (
    <div className={`w-auto ${mainDivStyles}`}>
      <img src={iconImage} alt='' width={width} height={height} />
    </div>
  );
};

export default CustomIcon;
