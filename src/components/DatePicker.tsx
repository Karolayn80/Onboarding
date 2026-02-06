import React, { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const yearListRef = useRef<HTMLDivElement>(null);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

  // Generar lista de años (100 años hacia atrás y 10 hacia adelante)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 111 }, (_, i) => currentYear + 10 - i);

  useEffect(() => {
    // Scroll automático al año seleccionado cuando se abre el selector
    if (showYearPicker && yearListRef.current) {
      const selectedYearElement = yearListRef.current.querySelector('.year-option.selected');
      if (selectedYearElement) {
        selectedYearElement.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
    }
  }, [showYearPicker]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const selectedDate = new Date(year, month, day);
    const formattedDate = `${months[month]} ${day.toString().padStart(2, '0')} del ${year}`;
    onChange(formattedDate);
    setShowCalendar(false);
  };

  const changeMonth = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction));
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
    setShowYearPicker(false);
  };

  const toggleYearPicker = () => {
    setShowYearPicker(!showYearPicker);
  };

  return (
    <div className="date-picker-container">
      <input
        type="text"
        value={value}
        onClick={() => setShowCalendar(!showCalendar)}
        readOnly
        placeholder="Selecciona una fecha"
        className="date-input"
      />
      {showCalendar && (
        <div className="calendar-dropdown">
          {!showYearPicker ? (
            <>
              <div className="calendar-year-selector">
                <button type="button" onClick={toggleYearPicker} className="year-selector-button">
                  {currentMonth.getFullYear()} ▼
                </button>
              </div>
              <div className="calendar-header">
                <button type="button" onClick={() => changeMonth(-1)}>‹</button>
                <span>{months[currentMonth.getMonth()]}</span>
                <button type="button" onClick={() => changeMonth(1)}>›</button>
              </div>
              <div className="calendar-grid">
                {daysOfWeek.map((day) => (
                  <div key={day} className="calendar-day-header">
                    {day}
                  </div>
                ))}
                {getDaysInMonth(currentMonth).map((day, index) => (
                  <div
                    key={index}
                    className={`calendar-day ${day ? 'active' : 'empty'}`}
                    onClick={() => day && handleDateSelect(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="year-picker">
              <div className="year-picker-header">
                <button type="button" onClick={toggleYearPicker} className="back-button">
                  ← Volver
                </button>
              </div>
              <div className="year-list" ref={yearListRef}>
                {years.map((year) => (
                  <div
                    key={year}
                    className={`year-option ${year === currentMonth.getFullYear() ? 'selected' : ''}`}
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;