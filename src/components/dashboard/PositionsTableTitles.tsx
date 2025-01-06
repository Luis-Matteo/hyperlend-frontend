import InfoItem from '../common/InfoItem';

type TitleProps = {
  title: string;
  infoItem?: string;
  titleStyles?: string;
  infoItemStyles?: string;
};
const PositionsTableTitles = ({
  title,
  infoItem,
  titleStyles,
  infoItemStyles,
}: TitleProps) => {
  return (
    <div className='flex gap-1 justify-center items-center align-middle'>
      <span className={titleStyles}>{title}</span>
      <InfoItem
        title={
          <span className={infoItemStyles}>
            {infoItem}
          </span>
        }
        className='w-[200px]'
      />
    </div>
  );
};

export default PositionsTableTitles;
