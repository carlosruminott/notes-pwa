/**
 * CalendarHeader — month/year navigation bar
 */

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function CalendarHeader({ currentDate, onMonthChange }) {
  const container = document.createElement("div");
  container.className = "calendar-header";

  const year = new Date(currentDate).getFullYear();
  const month = new Date(currentDate).getMonth();

  const leftArrow = document.createElement("button");
  leftArrow.className = "nav-arrow";
  leftArrow.innerHTML = "‹";

  const monthYearLabel = document.createElement("span");
  monthYearLabel.className = "month-year-label";
  monthYearLabel.textContent = `${MONTHS[month]} ${year}`;

  const rightArrow = document.createElement("button");
  rightArrow.className = "nav-arrow";
  rightArrow.innerHTML = "›";

  leftArrow.addEventListener("click", () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    onMonthChange(d);
  });

  rightArrow.addEventListener("click", () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    onMonthChange(d);
  });

  container.appendChild(leftArrow);
  container.appendChild(monthYearLabel);
  container.appendChild(rightArrow);

  return {
    element: container,
    updateDate(date) {
      const y = date.getFullYear();
      const m = date.getMonth();
      monthYearLabel.textContent = `${MONTHS[m]} ${y}`;
    },
  };
}
