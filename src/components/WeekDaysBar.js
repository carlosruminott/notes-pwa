/**
 * WeekDaysBar — horizontal strip of 7 days for the current week
 */

const DAYS_SHORT = ["D", "L", "M", "Mi", "J", "V", "S"];

function getWeekDays(date) {
  const d = new Date(date);
  // Get the Monday of the current week
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    weekDays.push(dayDate);
  }
  return weekDays;
}

export function WeekDaysBar({
  currentDate,
  selectedDate,
  onDateSelect,
  onShowAll,
}) {
  const container = document.createElement("div");
  container.className = "week-days-bar";

  const weekDays = getWeekDays(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayElements = [];

  // "Todos" button
  const allBtn = document.createElement("button");
  allBtn.className = "week-days-all-btn";
  allBtn.textContent = "Todos";
  allBtn.addEventListener("click", () => {
    if (onShowAll) onShowAll();
  });
  container.appendChild(allBtn);

  weekDays.forEach((dayDate) => {
    const dayEl = document.createElement("div");
    dayEl.className = "week-day";

    const dayNum = dayDate.getDate();
    const dayName = DAYS_SHORT[dayDate.getDay()];
    const dateStr = dayDate.toISOString().split("T")[0];
    const isToday = dayDate.getTime() === today.getTime();
    const isSelected = selectedDate === dateStr;

    if (isToday) dayEl.classList.add("today");
    if (isSelected) dayEl.classList.add("selected");

    dayEl.innerHTML = `
      <span class="day-name">${dayName}</span>
      <span class="day-num">${dayNum}</span>
    `;

    dayEl.addEventListener("click", () => {
      onDateSelect(dateStr);
    });

    dayElements.push(dayEl);
    container.appendChild(dayEl);
  });

  return {
    element: container,
    updateSelected(dateStr) {
      dayElements.forEach((el) => el.classList.remove("selected"));
      // Find the day that matches
      const weekDays2 = getWeekDays(currentDate);
      dayElements.forEach((el, i) => {
        if (weekDays2[i].toISOString().split("T")[0] === dateStr) {
          el.classList.add("selected");
        }
      });
    },
    updateAllBtn(active) {
      const btn = container.querySelector(".week-days-all-btn");
      if (btn) {
        btn.classList.toggle("active", active);
      }
    },
  };
}
