/**
 * CalendarHeader — month/year and week navigation bars
 */

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/**
 * Helper: get the Monday of the week containing the given date
 */
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust to Monday
  return new Date(d.setDate(diff));
}

/**
 * Helper: get the Sunday of the week containing the given date
 */
function getWeekEnd(date) {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

export function CalendarHeader({ currentDate, onMonthChange, onWeekChange }) {
  const container = document.createElement("div");
  container.className = "calendar-header";

  // Track the active date (mutable, not a closure constant)
  let activeDate = new Date(currentDate);

  // ── Month selector row ──────────────────────────────
  const monthRow = document.createElement("div");
  monthRow.className = "calendar-row month-row";

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const monthLeftArrow = document.createElement("button");
  monthLeftArrow.className = "nav-arrow";
  monthLeftArrow.innerHTML = "‹";

  const monthYearLabel = document.createElement("span");
  monthYearLabel.className = "month-year-label";
  monthYearLabel.textContent = `${MONTHS[month]} ${year}`;

  const monthRightArrow = document.createElement("button");
  monthRightArrow.className = "nav-arrow";
  monthRightArrow.innerHTML = "›";

  monthLeftArrow.addEventListener("click", () => {
    const d = new Date(activeDate);
    d.setMonth(d.getMonth() - 1);
    onMonthChange(d);
  });

  monthRightArrow.addEventListener("click", () => {
    const d = new Date(activeDate);
    d.setMonth(d.getMonth() + 1);
    onMonthChange(d);
  });

  monthRow.appendChild(monthLeftArrow);
  monthRow.appendChild(monthYearLabel);
  monthRow.appendChild(monthRightArrow);

  // ── Week selector row ───────────────────────────────
  const weekRow = document.createElement("div");
  weekRow.className = "calendar-row week-row";

  const weekStart = getWeekStart(activeDate);
  const weekEnd = getWeekEnd(activeDate);

  const weekLeftArrow = document.createElement("button");
  weekLeftArrow.className = "nav-arrow";
  weekLeftArrow.innerHTML = "‹";

  const weekLabel = document.createElement("span");
  weekLabel.className = "week-year-label";
  const sDay = weekStart.getDate();
  const sMonth = MONTHS[weekStart.getMonth()];
  const eDay = weekEnd.getDate();
  const eMonth = MONTHS[weekEnd.getMonth()];
  const wYear = weekStart.getFullYear();
  weekLabel.textContent = `${sDay} ${sMonth} – ${eDay} ${eMonth} ${wYear}`;

  const weekRightArrow = document.createElement("button");
  weekRightArrow.className = "nav-arrow";
  weekRightArrow.innerHTML = "›";

  weekLeftArrow.addEventListener("click", () => {
    const d = new Date(activeDate);
    d.setDate(d.getDate() - 7);
    onWeekChange(d);
  });

  weekRightArrow.addEventListener("click", () => {
    const d = new Date(activeDate);
    d.setDate(d.getDate() + 7);
    onWeekChange(d);
  });

  weekRow.appendChild(weekLeftArrow);
  weekRow.appendChild(weekLabel);
  weekRow.appendChild(weekRightArrow);

  //container.appendChild(monthRow);
  container.appendChild(weekRow);

  return {
    element: container,
    updateDate(date) {
      activeDate = new Date(date);
      // Update month row
      const y = date.getFullYear();
      const m = date.getMonth();
      monthYearLabel.textContent = `${MONTHS[m]} ${y}`;

      // Update week row
      const ws = getWeekStart(activeDate);
      const we = getWeekEnd(activeDate);
      const wsDay = ws.getDate();
      const wsMonth = MONTHS[ws.getMonth()];
      const weDay = we.getDate();
      const weMonth = MONTHS[we.getMonth()];
      const wy = ws.getFullYear();
      weekLabel.textContent = `${wsDay} ${wsMonth} – ${weDay} ${weMonth} ${wy}`;
    },
  };
}
