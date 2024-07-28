type SetionTitleProps = {
    title: string;
}

function SetionTitle({ title }: SetionTitleProps) {
  return (
    <p className="italic text-grey-light font-lufga font-light text-xs">{title}</p>
  );
}

export default SetionTitle;
