// DOM Elements
const eventsList = document.getElementById('events-list');

// Function to format date
const formatDate = (dateString) => {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

// Function to create event card HTML
const createEventCard = (event) => {
    return `
        <div class="event">
            <h3>${event.name}</h3>
            <p>${event.description || 'No description available'}</p>
            <p>Date: ${formatDate(event.event_date)}</p>
            <p>Location: ${event.location || 'TBA'}</p>
            <p>Available Seats: ${event.available_seats || 'Unlimited'}</p>
            <button onclick="registerForEvent(${event.id})" class="register-btn">
                Register for Event
            </button>
        </div>
    `;
};

// Function to fetch and display events
const loadEvents = async () => {
    try {
        // Show loading state
        eventsList.innerHTML = '<div class="loading">Loading events...</div>';

        const response = await fetch('https://campus-management-systembackend.onrender.com/api/v2/events/getEvents');
        
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        const events = await response.json();

        // If no events found
        if (events.length === 0) {
            eventsList.innerHTML = '<div class="no-events">No events available at this time.</div>';
            return;
        }

        // Display events
        eventsList.innerHTML = events.map(event => createEventCard(event)).join('');

    } catch (error) {
        console.error('Error loading events:', error);
        eventsList.innerHTML = `
            <div class="error">
                Failed to load events. Please try again later.
            </div>
        `;
    }
};

// Function to handle event registration
const registerForEvent = async (eventId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`https://campus-management-systembackend.onrender.com/api/v2/events/register/${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to register for event');
        }

        alert('Successfully registered for event!');
        loadEvents(); // Refresh the events list

    } catch (error) {
        console.error('Error registering for event:', error);
        alert('Failed to register for event. Please try again later.');
    }
};

// Load events when the page loads
document.addEventListener('DOMContentLoaded', loadEvents);
