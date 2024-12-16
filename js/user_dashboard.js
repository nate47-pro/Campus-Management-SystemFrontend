// DOM Elements
const eventsList = document.getElementById('eventsList');

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
        <div class="event-card">
            <div class="event-content">
                <h3 class="event-title">${event.name}</h3>
                <p class="event-description">${event.description || 'No description available'}</p>
                <div class="event-info">
                    <p><i class="fas fa-calendar"></i> ${formatDate(event.event_date)}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${event.location || 'TBA'}</p>
                    <p><i class="fas fa-users"></i> Available Seats: ${event.available_seats || 'Unlimited'}</p>
                </div>
                <div class="event-actions">
                    <button onclick="registerForEvent('${event.id}')" class="action-btn register-btn">
                        <i class="fas fa-ticket-alt"></i> Register
                    </button>
                </div>
            </div>
        </div>
    `;
};

// Function to fetch and display events
const loadEvents = async () => {
    try {
        // Show loading state
        eventsList.innerHTML = '<div class="loading">Loading events...</div>';

        const response = await fetch('http://localhost:5000/api/v2/events/getEvents');
        
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        const events = await response.json();

        // If no events found
        if (events.length === 0) {
            eventsList.innerHTML = `
                <div class="no-events">
                    <i class="fas fa-calendar-times"></i>
                    <p>No events available at this time.</p>
                </div>
            `;
            return;
        }

        // Display events
        eventsList.innerHTML = events.map(event => createEventCard(event)).join('');

    } catch (error) {
        console.error('Error loading events:', error);
        eventsList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                Failed to load events. Please try again later.
            </div>
        `;
    }
};

// Function to handle event registration
const registerForEvent = async (eventId) => {
    let user = JSON.parse(localStorage.getItem("user"))
    if(!user){
        window.location.href = "index.html"
    }

    try {
        await fetch(`http://localhost:5000/api/v2/events/rsvp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                event_id: eventId, 
                user_id: JSON.parse(localStorage.getItem('user'))?.id
            })
        }).then(response => response.json())
        .then(data => {
            if(data.message === "User registered successfully"){
                alert(data.message);
            }
            else if(data.message === "Event is full"){
                alert(data.message);
            }
            else if(data.message === "User already registered for this event"){
                alert(data.message);
            }
            else{
                alert(data.message);
            }
        });
    } catch (error) {
        console.error('Error registering for event:', error);
        showNotification('Failed to register for event. Please try again later.', 'error');
    }
};

// Function to show notifications
const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    // Add show class after a small delay to trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// Load events when the page loads
document.addEventListener('DOMContentLoaded', loadEvents);
