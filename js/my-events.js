// Function to fetch user's events from RSVP table
async function fetchUserEvents() {
    try {
        const response = await fetch('/api/my-events', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // to include session cookies
        });

        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        // Handle error state - maybe show an error message to user
    }
}

// Function to display events in the UI
function displayEvents(events) {
    const eventsContainer = document.getElementById('myEventsList');
    eventsContainer.innerHTML = ''; // Clear existing content

    if (events.length === 0) {
        eventsContainer.innerHTML = `
            <div class="no-events">
                <p>You haven't registered for any events yet.</p>
            </div>
        `;
        return;
    }

    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
    });
}

// Function to create event card
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    // Determine event status
    const eventDate = new Date(event.event_date);
    const now = new Date();
    let statusClass = 'status-upcoming';
    let statusText = 'Upcoming';
    
    if (eventDate < now) {
        statusClass = 'status-past';
        statusText = 'Past';
    } else if (eventDate.toDateString() === now.toDateString()) {
        statusClass = 'status-ongoing';
        statusText = 'Today';
    }

    card.innerHTML = `
        <div class="event-content">
            <h3 class="event-title">${event.event_name}</h3>
            <div class="event-info">
                <p><i class="fas fa-calendar"></i> ${new Date(event.event_date).toLocaleDateString()}</p>
                <p><i class="fas fa-clock"></i> ${event.event_time}</p>
                <p><i class="fas fa-location-dot"></i> ${event.venue}</p>
            </div>
            <span class="event-status ${statusClass}">${statusText}</span>
            <div class="event-actions">
                <button class="action-btn details-btn" onclick="viewEventDetails(${event.event_id})">
                    <i class="fas fa-info-circle"></i> Details
                </button>
                ${eventDate > now ? `
                    <button class="action-btn cancel-btn" onclick="cancelRegistration(${event.event_id})">
                        <i class="fas fa-times"></i> Cancel Registration
                    </button>
                ` : ''}
            </div>
        </div>
    `;

    return card;
}

// Function to handle event cancellation
async function cancelRegistration(eventId) {
    if (!confirm('Are you sure you want to cancel your registration for this event?')) {
        return;
    }

    try {
        const response = await fetch(`/api/rsvp/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to cancel registration');
        }

        // Refresh the events list
        fetchUserEvents();
    } catch (error) {
        console.error('Error canceling registration:', error);
        // Handle error - show error message to user
    }
}

// Function to view event details
function viewEventDetails(eventId) {
    window.location.href = `/event-details.html?id=${eventId}`;
}

// Filter events based on type (upcoming, past, all)
function filterEvents(filterType) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filterType) {
            btn.classList.add('active');
        }
    });

    // Re-fetch events with filter
    fetchUserEvents(filterType);
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchUserEvents();

    // Add click listeners to filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterEvents(button.dataset.filter);
        });
    });
});
