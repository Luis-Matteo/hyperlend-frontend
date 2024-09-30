type SectionTitleProps = {
  title: string;
  className?: string;
};

function SectionTitle({ title, className }: SectionTitleProps) {
  return (
    <p
      className={`italic ${className} text-grey-light font-lufga font-light text-xs mb-2"`}
    >
      {title}
    </p>
  );
}

export default SectionTitle;
