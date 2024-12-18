// Get the form element
const createEventForm = document.getElementById('create-event-form');

// Function to handle form submission
createEventForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get user information from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please log in to create an event');
        window.location.href = 'index.html';
        return;
    }

    // Get form data
    const formData = new FormData(this);

    // Create event object
    const eventData = {
        name: formData.get('title'),
        description: formData.get('description'),
        event_date: formData.get('date'),
        event_time: formData.get('time'),
        location: formData.get('location'),
        capacity: parseInt(formData.get('capacity')),
        // available_seats: parseInt(formData.get('capacity')), // Initially, available seats equals capacity
        type: formData.get('category'),
        created_by: user.id
    };

    try {
        const response = await fetch('https://campus-management-systembackend.onrender.com/api/v2/events/createEvents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Event created successfully!');
            window.location.href = 'admin.html'; // Redirect to admin dashboard
        } else {
            throw new Error(data.message || 'Failed to create event');
        }
    } catch (error) {
        console.error('Error creating event:', error);
        alert('Error: ' + error.message);
    }
});

// Add event listener to check if user is logged in when page loads
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please log in to create an event');
        window.location.href = 'index.html';
    }
});
