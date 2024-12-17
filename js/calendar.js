let currentViewMonth;
let currentViewYear;

const renderRegularCalendar = async () => {
  const calendarContainer = document.getElementById("calendar-section");
  
  // Initialize current view if not set
  if (currentViewMonth === undefined) {
    const date = new Date();
    currentViewMonth = date.getMonth();
    currentViewYear = date.getFullYear();
  }

  // Fetch events from the backend
  let events = [];
  try {
    const response = await fetch('https://campus-management-systembackend.onrender.com/api/v2/events/getEvents');
    if (response.ok) {
      events = await response.json();
    }
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  // Clear previous content
  calendarContainer.innerHTML = "";
  
  // Add controls
  calendarContainer.appendChild(renderCalendarControls());
  
  // Update month-year display
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  document.getElementById('month-year-display').textContent = 
    `${monthNames[currentViewMonth]} ${currentViewYear}`;

  // Create calendar grid container
  const gridContainer = document.createElement('div');
  gridContainer.className = 'calendar-grid';

  // Generate calendar
  const firstDay = new Date(currentViewYear, currentViewMonth, 1);
  const lastDay = new Date(currentViewYear, currentViewMonth + 1, 0);
  const totalDays = lastDay.getDate();
  const firstDayOfWeek = firstDay.getDay();

  // Create day labels
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach((day) => {
    const dayLabel = document.createElement("div");
    dayLabel.className = "day day-label";
    dayLabel.textContent = day;
    gridContainer.appendChild(dayLabel);
  });

  // Add empty slots for leading days
  for (let i = 0; i < firstDayOfWeek; i++) {
    const emptySlot = document.createElement("div");
    emptySlot.className = "day empty";
    gridContainer.appendChild(emptySlot);
  }

  // Add days with events
  for (let i = 1; i <= totalDays; i++) {
    const day = document.createElement("div");
    day.className = "day";
    
    // Create date container
    const dateContainer = document.createElement("div");
    dateContainer.className = "date-number";
    dateContainer.textContent = i;
    day.appendChild(dateContainer);

    // Check for events on this day
    const currentDate = `${currentViewYear}-${String(currentViewMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.event_date).toISOString().split('T')[0];
      return eventDate === currentDate;
    });

    // Add events to the day
    if (dayEvents.length > 0) {
      const eventsContainer = document.createElement("div");
      eventsContainer.className = "events-container";
      
      dayEvents.forEach(event => {
        const eventElement = document.createElement("div");
        eventElement.className = "event-indicator";
        eventElement.title = event.name;
        eventElement.addEventListener('click', () => showEventDetails(event));
        eventsContainer.appendChild(eventElement);
      });

      day.appendChild(eventsContainer);
      day.classList.add("has-events");
    }

    gridContainer.appendChild(day);
  }

  calendarContainer.appendChild(gridContainer);
};

// Function to show event details
const showEventDetails = (event) => {
  // You can implement a modal or tooltip here to show event details
  alert(`
    Event: ${event.name}
    Date: ${new Date(event.event_date).toLocaleDateString()}
    Location: ${event.location || 'TBA'}
    Description: ${event.description || 'No description available'}
  `);
};

// Add corresponding CSS
const style = document.createElement('style');
style.textContent = `
  #calendar-section {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .day {
    aspect-ratio: 1;
    padding: 5px;
    border: 1px solid #eee;
    border-radius: 5px;
    background: white;
    min-height: 80px;
    display: flex;
    flex-direction: column;
  }

  .day-label {
    font-weight: bold;
    color: #666;
    aspect-ratio: auto;
    min-height: auto;
    text-align: center;
    padding: 10px;
  }

  .empty {
    background: #f9f9f9;
  }

  .has-events {
    background: #f8f9ff;
  }

  .date-number {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .events-container {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .event-indicator {
    background: var(--primary-color, #3498db);
    height: 4px;
    border-radius: 2px;
    margin: 2px 0;
    cursor: pointer;
  }

  .event-indicator:hover {
    height: 6px;
    margin: 1px 0;
  }

  .calendar-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 10px;
  }

  .calendar-controls button {
    background: var(--primary-color, #3498db);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 15px;
    cursor: pointer;
    font-size: 16px;
  }

  .calendar-controls button:hover {
    opacity: 0.9;
  }

  #month-year-display {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }
`;

document.head.appendChild(style);

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', renderRegularCalendar);

const renderCalendarControls = () => {
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'calendar-controls';
  
  const prevButton = document.createElement('button');
  prevButton.innerHTML = '&lt;';
  prevButton.onclick = () => changeMonth(-1);
  
  const nextButton = document.createElement('button');
  nextButton.innerHTML = '&gt;';
  nextButton.onclick = () => changeMonth(1);
  
  const monthYearDisplay = document.createElement('div');
  monthYearDisplay.id = 'month-year-display';
  
  controlsContainer.appendChild(prevButton);
  controlsContainer.appendChild(monthYearDisplay);
  controlsContainer.appendChild(nextButton);
  
  return controlsContainer;
};

// Add function to change months
const changeMonth = (delta) => {
  currentViewMonth += delta;
  
  if (currentViewMonth > 11) {
    currentViewMonth = 0;
    currentViewYear++;
  } else if (currentViewMonth < 0) {
    currentViewMonth = 11;
    currentViewYear--;
  }
  
  renderRegularCalendar();
};