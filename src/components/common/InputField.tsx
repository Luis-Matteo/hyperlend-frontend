function InputField({
  value,
  setValue,
  min,
  step,
}: {
  value: number;
  setValue: (value: number) => void;
  min: number;
  step: number;
}) {
  return (
    <input
      type='number'
      className='form-control-plaintext text-xl text-secondary border-0 p-0 text-left '
      value={value}
      step={step}
      min={min}
      onChange={(e) => {
        setValue(Number(e.target.value));
      }}
      style={{
        background: 'transparent',
        outline: 'none',
        boxShadow: 'none',
        width: 'auto',
        minWidth: '50px',
      }}
    />
  );
}

export default InputField;
