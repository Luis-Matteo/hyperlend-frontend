import InfoItem from './InfoItem';

type TitleProps = {
  title: string;
  infoItem?: string;
  titleStyles?: string;
  infoItemStyles?: string;
  currentTitle?: string;
};
const CustomTitle = ({
  title,
  infoItem,
  titleStyles,
  infoItemStyles,
  currentTitle,
}: TitleProps) => {
  return (
    <div className='flex gap-1 justify-center items-center mb-2 align-middle'>
      <span className={`${titleStyles}`}>{title}</span>
      <InfoItem
        title={<span className={`${infoItemStyles}`}>{infoItem}</span>}
        className='w-[200px]'
        currentTitle={currentTitle}
      />
    </div>
  );
};

export default CustomTitle;
