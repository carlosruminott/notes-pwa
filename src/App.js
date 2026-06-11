/**
 * App — orchestrates all components (calendar/event view)
 */

import { CalendarHeader } from "./components/CalendarHeader.js";
import { WeekDaysBar } from "./components/WeekDaysBar.js";
import { EventList } from "./components/EventList.js";
import { Fab } from "./components/Fab.js";
import { EventEditor } from "./components/EventEditor.js";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByDate,
  getAllEvents,
} from "./db.js";
import "./components/style.css";

const today = new Date();
const todayStr = today.toISOString().split("T")[0];

export default class App {
  constructor() {
    this.currentMonth = new Date(today);
    this.selectedDate = todayStr;
    this.currentEvent = null;
    this.viewMode = "date"; // 'date' or 'all'

    this.calendarHeader = CalendarHeader({
      currentDate: this.currentMonth,
      onMonthChange: (date) => this.onMonthChange(date),
    });

    this.weekDaysBar = WeekDaysBar({
      currentDate: this.currentMonth,
      selectedDate: this.selectedDate,
      onDateSelect: (date) => this.onDateSelect(date),
      onShowAll: () => this.onShowAll(),
    });
    this.weekDaysBar.clearSelection();

    this.eventList = EventList({
      events: [],
      onEventClick: (event) => this.onEventClick(event),
      onEventEdit: (event) => this.onEventEdit(event),
      onEventDelete: (event) => this.onEventDelete(event),
    });

    this.fab = Fab({
      onClick: () => this.onFabClick(),
    });

    this.editor = EventEditor({
      onSave: (data, eventId) => this.onSave(data, eventId),
      onClose: () => this.onCloseEditor(),
      onDelete: (id) => this.onDelete(id),
    });
  }

  async mount(root) {
    root.appendChild(this.calendarHeader.element);
    root.appendChild(this.weekDaysBar.element);
    root.appendChild(this.eventList.element);
    root.appendChild(this.editor.element);
    root.appendChild(this.fab);

    await this.loadAllEvents();
  }

  async loadAllEvents() {
    this.viewMode = "all";
    this.weekDaysBar.clearSelection();
    const events = (await getAllEvents()).slice();
    events.sort((a, b) => this.sortEventsByWeekDayTime(a, b));
    this.eventList.setEvents(events);
    this.eventList.render();
    this.weekDaysBar.updateAllBtn(true);
  }

  async loadEventsForSelectedDate() {
    const events = await getEventsByDate(this.selectedDate);
    this.eventList.setEvents(events);
    this.eventList.render();
  }

  onMonthChange(date) {
    this.currentMonth = date;
    this.calendarHeader.updateDate(date);

    // Update week days bar
    const weekDays = this.getWeekDays(date);
    const todayStr = new Date().toISOString().split("T")[0];

    // Check if today is in this week, if not default to Monday
    const todayInWeek = weekDays.some(
      (d) => d.toISOString().split("T")[0] === todayStr,
    );

    if (todayInWeek) {
      // Keep selected date if it's still in the new month's week
      const selectedInWeek = weekDays.some(
        (d) => d.toISOString().split("T")[0] === this.selectedDate,
      );
      if (!selectedInWeek) {
        this.selectedDate = todayStr;
      }
    } else {
      this.selectedDate = weekDays[0].toISOString().split("T")[0];
    }

    this.weekDaysBar.updateSelected(this.selectedDate);
    this.loadEventsForSelectedDate();
  }

  onDateSelect(date) {
    this.selectedDate = date;
    this.viewMode = "date";
    this.weekDaysBar.updateSelected(date);
    this.weekDaysBar.updateAllBtn(false);
    this.loadEventsForSelectedDate();
  }

  async onShowAll() {
    if (this.viewMode === "all") {
      // Switch back to today
      this.viewMode = "date";
      this.selectedDate = todayStr;
      this.weekDaysBar.updateSelected(this.selectedDate);
      this.weekDaysBar.updateAllBtn(false);
      await this.loadEventsForSelectedDate();
    } else {
      this.viewMode = "all";
      this.weekDaysBar.clearSelection();
      const events = (await getAllEvents()).slice();
      events.sort((a, b) => this.sortEventsByWeekDayTime(a, b));
      this.eventList.setEvents(events);
      this.eventList.render();
      this.weekDaysBar.updateAllBtn(true);
    }
  }

  sortEventsByWeekDayTime(a, b) {
    const dateA = new Date(a.date + "T00:00:00");
    const dateB = new Date(b.date + "T00:00:00");

    // 1. Ordenar por semana ISO (año + número de semana)
    const weekA = this.getISOWeek(dateA);
    const weekB = this.getISOWeek(dateB);
    if (weekA !== weekB) {
      return weekA - weekB;
    }

    // 2. Ordenar por día de la semana (Lunes=0 → Domingo=6)
    const dayA = (dateA.getDay() + 6) % 7;
    const dayB = (dateB.getDay() + 6) % 7;
    if (dayA !== dayB) {
      return dayA - dayB;
    }

    // 3. Ordenar por horario
    return a.time.localeCompare(b.time);
  }

  getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return `${d.getUTCFullYear()}W${Math.ceil(((d - yearStart) / 86400000 + 1) / 7)}`;
  }

  onEventClick(event) {
    this.onEventEdit(event);
  }

  onEventEdit(event) {
    this.currentEvent = event;
    this.editor.show(event);
  }

  async onEventDelete(event) {
    await this.onDelete(event.id);
  }

  async onSave(data, eventId) {
    if (eventId) {
      await updateEvent(eventId, data);
    } else {
      await createEvent(data);
    }
    this.editor.hide();
    this.currentEvent = null;
    await this.loadEventsForSelectedDate();
  }

  async onCloseEditor() {
    this.editor.hide();
    this.currentEvent = null;
  }

  async onDelete(id) {
    await deleteEvent(id);
    this.editor.hide();
    this.currentEvent = null;
    await this.loadEventsForSelectedDate();
  }

  onFabClick() {
    const newEvent = {
      title: "",
      content: "",
      category: "TRABAJO",
      date: this.selectedDate,
      time: "09:00",
    };
    this.currentEvent = newEvent;
    this.editor.show(newEvent);
  }

  getWeekDays(date) {
    const d = new Date(date);
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
}
