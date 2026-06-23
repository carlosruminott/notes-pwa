/**
 * EventCard — event card for the calendar view
 */

const CATEGORY_COLORS = {
  TRABAJO: { bg: "#854d0e33", text: "#fbbf24", border: "#a16207" },
  PERSONAL: { bg: "#1e40af33", text: "#60a5fa", border: "#3b82f6" },
  SALUD:   { bg: "#065f4633", text: "#34d399", border: "#10b981" },
  ESTUDIO: { bg: "#5b21b633", text: "#a78bfa", border: "#8b5cf6" },
  OTRO:    { bg: "#37415133", text: "#9ca3af", border: "#4b5563" },
};

function formatTime(time) {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  const displayHour = hour % 12 || 12;
  return `${displayHour} ${ampm}`;
}

function formatDayInfo(dateStr) {
  if (!dateStr) return { dayName: "", dayNum: "" };
  const date = new Date(dateStr + "T00:00:00");
  const dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
  const dayName = dayNames[date.getDay()];
  const dayNum = date.getDate();
  return { dayName, dayNum };
}

export function EventCard({ event, onClick, onEdit, onDelete }) {
  const card = document.createElement("div");
  card.className = "event-card";

  const colors = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.OTRO;
  const { dayName, dayNum } = formatDayInfo(event.date);

  card.innerHTML = `
    <div class="event-card-time">
      <div class="sticky">
        <span class="event-card-day">${dayName} ${dayNum}</span>
        <span class="event-card-time-value">${formatTime(event.time)}</span>
        <div class="event-card-category" style="background:${colors.bg};color:${colors.text};border-color:${colors.border}">${event.category}</div>
      </div>
    </div>
    <div class="event-card-content">
      <div class="event-card-title">${event.title || ""}</div>
      ${event.content ? `<div class="event-card-preview">${event.content}</div>` : ""}
    </div>
  `;

  card.addEventListener("click", () => onClick(event));

  return card;
}
