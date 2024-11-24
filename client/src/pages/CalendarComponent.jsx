import React, { useState, useEffect } from 'react';
import { Calendar, DatePicker } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const CalendarComponent = () => {
  const [value, setValue] = useState(dayjs());

  useEffect(() => {
    const currentValue = dayjs();
    setValue(currentValue);
  }, []);

  const onPanelChange = (date, mode) => {
    console.log('panel change', date, mode);
  };

  const onChange = (date, dateString) => {
    console.log('selected time is: ', date, dateString);
    setValue(date);
  };

  return (
    <div style={{ width: 400, margin: 'auto', marginTop: 50 }}>
      <Calendar
        value={value}
        onChange={onChange}
        onPanelChange={onPanelChange}
        fullscreen={false}
      />
      <RangePicker
        value={value}
        onChange={onChange}
        onCalendarChange={onChange}
      />
    </div>
  );
};

export default CalendarComponent;
