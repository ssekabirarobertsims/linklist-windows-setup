import { useState, type FunctionComponent, useMemo } from "react";

import "../../stylesheets/Components/Reusable.Components.Stylesheet.css";
import "../../stylesheets/Configurations/Application.Styles.Configurations.css";

interface SavedLink {
  id: number;
  savedAt: string;
}

// Sample data
// The number of objects on a particular date represents
// the number of links saved on that day.
const savedLinks: SavedLink[] = [
  { id: 1, savedAt: "2026-09-02" },
  { id: 2, savedAt: "2026-09-02" },

  { id: 3, savedAt: "2026-09-05" },

  { id: 4, savedAt: "2026-09-10" },
  { id: 5, savedAt: "2026-09-10" },
  { id: 6, savedAt: "2026-09-10" },

  { id: 7, savedAt: "2026-09-14" },

  { id: 8, savedAt: "2026-09-17" },
  { id: 9, savedAt: "2026-09-17" },
  { id: 10, savedAt: "2026-09-17" },
  { id: 11, savedAt: "2026-09-17" },
  { id: 12, savedAt: "2026-09-17" },
  { id: 13, savedAt: "2026-09-17" },
  { id: 14, savedAt: "2026-09-17" },

  { id: 14, savedAt: "2026-09-25" },

  { id: 15, savedAt: "2026-09-22" },
  { id: 16, savedAt: "2026-09-22" },

  { id: 17, savedAt: "2026-09-27" },
];

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const ApplicationCalendarComponent: FunctionComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 17));

  /**
   * Group saved links by date.
   *
   * Example:
   *
   * {
   *   "2026-09-02": 2,
   *   "2026-09-05": 1,
   *   "2026-09-17": 7
   * }
   */
  const linksPerDay = useMemo(() => {
    const counts: Record<string, number> = {};

    savedLinks.forEach((link) => {
      counts[link.savedAt] = (counts[link.savedAt] || 0) + 1;
    });

    return counts;
  }, []);

  /**
   * Generate all calendar cells.
   *
   * We display Monday -> Sunday.
   */
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);

    // JS:
    // Sunday = 0
    // Monday = 1
    //
    // Convert it so:
    // Monday = 0
    // Sunday = 6
    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

    const previousMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month's days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = previousMonthDays - i;

      days.push({
        date: new Date(year, month - 1, day),
        currentMonth: false,
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        currentMonth: true,
      });
    }

    // Next month's days
    let nextDay = 1;

    while (days.length < 42) {
      days.push({
        date: new Date(year, month + 1, nextDay),
        currentMonth: false,
      });

      nextDay++;
    }

    return days;
  }, [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const todayKey = getDateKey(new Date());

  return (
    <>
      <div className="mini-calendar">
        {/* Calendar header */}
        <div className="mini-calendar-header">
          <h2>
            Today: {new Date().getDate()} {monthNames[currentDate.getMonth()]},{" "}
            {currentDate.getFullYear()}
          </h2>

          <div className="mini-calendar-navigation">
            <button
              type="button"
              onClick={goToPreviousMonth}
              aria-label="Previous month"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              ›
            </button>
          </div>
        </div>

        {/* Weekday header */}
        <div className="mini-calendar-weekdays">
          {weekDays.map((day) => (
            <div key={day} className="mini-calendar-weekday">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="mini-calendar-grid">
          {calendarDays.map(({ date, currentMonth }) => {
            const dateKey = getDateKey(date);

            const linkCount = linksPerDay[dateKey] || 0;

            const hasLinks = linkCount > 0;

            const isToday = dateKey === todayKey;

            return (
              <div
                key={dateKey}
                className={`mini-calendar-day ${
                  currentMonth ? "" : "mini-calendar-day-other-month"
                } ${isToday ? "mini-calendar-day-today" : ""}`}
              >
                <div className="mini-calendar-day-content">
                  <span
                    className={`mini-calendar-date ${
                      hasLinks ? "mini-calendar-date-has-links" : ""
                    }`}
                  >
                    {date.getDate()}

                    {/* Tooltip */}
                    {hasLinks && (
                      <span className="mini-calendar-tooltip">
                        {linkCount} {linkCount === 1 ? "link" : "links"} saved
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <br />
        <h2 className="mini-calendar-aside-content-h2">Analytics Over Time</h2>
        <br />
        <article className="mini-calendar-aside-content"></article>
      </div>
    </>
  );
};

export default ApplicationCalendarComponent;
