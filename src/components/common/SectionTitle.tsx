type SectionTitleProps = {
    title: string;
}

function SectionTitle({ title }: SectionTitleProps) {
  return (
    <p className="italic text-grey-light font-lufga font-light text-xs mb-2">{title}</p>
  );
}

export default SectionTitle;
