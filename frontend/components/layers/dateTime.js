import { Stack } from "rsuite";
import "../../src/styles/HorizontalSlider.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateTimePicker = ({ selectedDateTime, setSelectedDateTime }) => {
  const minDate = new Date("2022-11-24T00:00:00");
  return (
    <div>
      <div>
        <Stack direction="column" alignItems="flex-start" spacing={6}>
          <DatePicker
            selected={selectedDateTime}
            onChange={(d) => {
              setSelectedDateTime(d);
            }}
            minDate={minDate}
            dateFormat="yyyy-MM-dd HH:00"
            showTimeSelect
            timeFormat="HH"
            timeIntervals={60}
            timeCaption="time"
          />
        </Stack>
      </div>
    </div>
  );
};

export default DateTimePicker;
