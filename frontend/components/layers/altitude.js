import Select from "react-select";

const VerticalSlider = ({
  altitudeOptions,
  sliderValue,
  handleSliderChange,
}) => {
  const optionsObject = altitudeOptions.map((opt) => {
    return {
      value: opt,
      label: `${opt / 10} hPa`,
    };
  });

  return (
    <div style={{ color: "black", fontWeight: "bolder" }}>
      <Select
        value={sliderValue}
        onChange={handleSliderChange}
        options={optionsObject}
      />
    </div>
  );
};

export default VerticalSlider;
