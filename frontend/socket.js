// socket.js

const socket = io.connect('http://localhost:3000'); // replace with your backend URL

socket.on('connect', () => {
    console.log('Connected to the server',socket.id);
});

const notificationIcon = document.getElementById('notification-icon');
const notificationCount = document.getElementById('notification-count');
const notificationSidebar = document.getElementById('notification-sidebar');
const notificationsList = document.getElementById('notifications-list');
const closeSidebarBtn = document.getElementById('close-sidebar');

// Notification count
let unreadCount = 0;

// Handle incoming notifications
socket.on('notification', (data) => {
    console.log(data.message);
    unreadCount++;
    notificationCount.textContent = unreadCount;
    notificationCount.style.display = 'block';
    console.log("ewww");
    notificationSidebar.innerHTML="enti ra";
    const notificationItem = document.createElement('li');
    notificationSidebar.textContent = `${data.message} at ${new Date(data.createdAt).toLocaleTimeString()}`;
    notificationsList.appendChild(notificationItem);
});




socket.on('missedNotifications', (notifications) => {
    notifications.forEach(notification => {
        const notificationItem = document.createElement('li');
        notificationItem.textContent = `${notification.message} at ${new Date(notification.createdAt).toLocaleTimeString()}`;
        notificationsList.appendChild(notificationItem);
    });
});


function markNotificationsAsRead() {
    fetch('/api/notifications/markAsRead', {
        method: 'PUT',
    }).then(response => {
        if (response.ok) {
            console.log('Notifications marked as read');
        }
    });
}
// Show notification sidebar
notificationIcon.addEventListener('click', () => {
    notificationSidebar.style.display = 'block';
    notificationCount.style.display = 'none';
    console.log("ewwhn");
    unreadCount = 0;
});

// Close notification sidebar
closeSidebarBtn.addEventListener('click', () => {
    notificationSidebar.style.display = 'none';
});



// socket.on('disconnect', () => {
//     console.log('Disconnected from the server');
// });
// export { socket };
