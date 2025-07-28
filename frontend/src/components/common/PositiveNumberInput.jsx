const PositiveNumberInput = ({ value, onChange, ...props }) => {
    const handleChange = (e) => {
      const val = e.target.value;
      if (val === "" || parseFloat(val) >= 0) {
        onChange(e);
      }
    };
  
    return (
      <input
        type="number"
        min="0"
        value={value}
        onChange={handleChange}
        {...props}
      />
    );
  };
  

  export default PositiveNumberInput;