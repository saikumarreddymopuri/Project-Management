document.addEventListener('DOMContentLoaded', () => {
    const addProjectBtn = document.getElementById('addProjectBtn');
    const removeProjectBtn = document.getElementById('removeProjectBtn');
    const addProjectForm = document.getElementById('addProjectForm');
    const projectForm = document.getElementById('projectForm');
    const projectTableBody = document.getElementById('projectTableBody');
    const projectDetails = document.getElementById('projectDetails');
    const backButton = document.getElementById('backButton');
    const detailsContainer = document.getElementById('detailsContainer');
    const phaseBoxes = document.getElementById('phaseBoxes');
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    const projectTable = document.getElementById('projectTable');
    const searchInput = document.getElementById('searchInput');
    const cancel=document.getElementById('cancel-class')
    let projects = [];

    // Toggle Add Project Form
    addProjectBtn.addEventListener('click', () => {
        addProjectForm.classList.toggle('hidden');
    });
    
    // Handle Project Form Submission
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const projectId = document.getElementById('projectId').value.trim();
        const projectName = document.getElementById('projectTitle').value.trim();
        const teamLead = document.getElementById('teamLead').value.trim();
        
        if (projectId && projectName && teamLead) {
            const newProject = {
                projectId: projectId,
                projectName: projectName,
                teamLead: teamLead
            };
            
            try {
                const response = await fetch('http://localhost:3000/api/v1/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify(newProject)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Project added:', result);
                    displayProjects(); // Refresh project list
                    addProjectForm.classList.add('hidden');
                    projectForm.reset();
                } else {
                    const error = await response.json();
                    console.error('Error adding project:', error.message);
                    alert('Failed to add project: ' + error.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while adding the project.');
            }
        }
    });

    // Handle Remove Project
    // Event listener for the remove project button (this button triggers the modal)
document.getElementById('removeProjectBtn').addEventListener('click', function() {
    // Open the remove project modal
    $('#removeProjectModal').modal('show');
});

// Event listener for the confirm remove button inside the modal
document.getElementById('confirmRemoveProject').addEventListener('click', async function() {
    const projectId = document.getElementById('removeProjectId').value;

    if (projectId) {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/projects/${projectId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                alert('Project removed successfully!');
                $('#removeProjectModal').modal('hide'); // Close the modal
                displayProjects(); // Refresh the project list
            } else {
                const error = await response.json();
                console.error('Error removing project:', error.message);
                alert('Failed to remove project: ' + error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while removing the project.');
        }
    } else {
        alert('Please enter a project ID.');
    }
});


    // Show Project Details
    async function showProjectDetails(project) {
        projectTable.classList.add('hidden');
        projectDetails.classList.remove('hidden');
    
        try {
            const response = await fetch(`http://localhost:3000/api/v1/phases/p/${project.projectId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('projectMongoId', data._id);
            } else {
                const error = await response.json();
                throw new Error(`Project fetch error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error fetching project: ${error.message}`);
        }
    
        const projectId = localStorage.getItem('projectMongoId');
        const response = await fetch(`http://localhost:3000/api/v1/projects/${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
    
        if (response.ok) {
            const projectDetails = await response.json();
            detailsContainer.innerHTML = `
                <h3>Project ID: ${projectDetails.projectId}</h3>
                <h3>Title: ${projectDetails.projectName}</h3>
                <h3>Team Lead: ${projectDetails.teamLead}</h3>
            `;
    
            const phaseNames = [
                "IDEATION",
                "HARDWARE DEVELOPMENT",
                "SOFTWARE INTEGRATION",
                "DESIGN",
                "MANUFACTURING & PRODUCTION",
                "DEPLOYMENT & TESTING"
            ];
    
            phaseBoxes.innerHTML = projectDetails.phases.map((phase, index) => `
                <div class="phase-box ${getPhaseClass(phase.status)}" data-phase-id="${phase._id}">
                    <p><strong>Phase Name:</strong> ${phaseNames[index]}</p>
                    <p>Monitor: ${phase.monitor}</p>
                    <p>Deadline: ${phase.deadline ? new Date(phase.deadline).toLocaleDateString('en-IN') : ""}</p>
                    <p><strong>Completion Date:</strong> ${phase.completionDate ? new Date(phase.completionDate).toLocaleDateString('en-IN') : ""}</p>
                    <p>Status: ${phase.status}</p>
                    <p><strong>Is On Time:</strong> ${phase.isOnTime}</p>
                    <p><strong>Submission Time:</strong> ${phase.timeDifference || ""}</p>
                </div>
            `).join('');
            const completedPhases = projectDetails.phases.filter(phase => phase.status === 'completed').length;
            const totalPhases = projectDetails.phases.length;
            const percentage = (completedPhases / totalPhases) * 100;
            progressBar.value = percentage;
            progressPercentage.textContent = `${percentage.toFixed(2)}%`;
        } else {
            console.error('Error fetching project details');
            alert('Failed to load project details.');
        }
    }

    // Update Table with Projects
    async function displayProjects() {
        try {
            const response = await fetch('http://localhost:3000/api/v1/projects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                projects = await response.json();
                projectTableBody.innerHTML = '';
                projects.forEach((project, index) => {
                    const row = document.createElement('tr');
                    
                    let currentPhaseIndex = project.phases.findIndex(phase => phase.status !== 'completed');
                    if (currentPhaseIndex === -1) currentPhaseIndex = project.phases.length; // If all are completed, no blinking
                    row.innerHTML = `
                      <td>${index + 1}</td>
                      <td>${project.projectId}</td>
                      <td>${project.projectName}</td>
                      <td>${project.teamLead}</td>
                      ${project.phases.length > 0 ? 
                        project.phases.map((phase, phaseIndex) => `
                          <td class="phase-box ${phaseIndex === currentPhaseIndex ? 'blinking' : getPhaseClass(phase.status)}">
                              ${phase.status === 'completed' ? '✅' : ' '}
                          </td>
                        `).join('') : 
                        '<td colspan="6">!!!Phases not created yet!!!</td>' // Adjust colspan based on your table structure
                      }
                      <td><button class="edit-project-btn" data-project-id="${project._id}">Edit</button></td>
                    `;

                    function showPhaseDetailsPopup(details, x, y) {
                        let popup = document.getElementById('phaseDetailsPopup');
                        
                        if (popup) {
                            popup.remove(); // Remove existing popup if it exists
                        }
                    
                        // Create the popup div
                        popup = document.createElement('div');
                        popup.id = 'phaseDetailsPopup';
                        popup.style.position = 'absolute';
                        popup.style.left = `${x + 10}px`;
                        popup.style.top = `${y + 10}px`;
                        popup.style.backgroundColor = 'white';
                        popup.style.border = '1px solid black';
                        popup.style.padding = '10px';
                        popup.style.zIndex = '1000';
                        popup.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
                    
                        // Fill the popup with phase details
                        popup.innerHTML = `
                            <strong>Phase Name:</strong> ${details.name || 'N/A'}<br>
                            <strong>Monitor:</strong> ${details.monitor || 'N/A'}<br>
                            <strong>Status:</strong> ${details.status || 'N/A'}<br>
                            <strong>Completion Date:</strong> ${details.completionDate ? new Date(details.completionDate).toLocaleDateString('en-IN') : 'N/A'}<br>
                            <strong>Deadline:</strong> ${details.deadline ? new Date(details.deadline).toLocaleDateString('en-IN') : 'N/A'}<br>
                            <strong>Is On Time:</strong> ${details.isOnTime ? 'Yes' : 'No'}<br>
                            <strong>Submission Time:</strong> ${details.timeDifference || 'N/A'}
                        `;
                    
                        // Append the popup to the body
                        document.body.appendChild(popup);
                    }
                    
                    // Function to hide the popup
                    function hidePhaseDetailsPopup() {
                        const popup = document.getElementById('phaseDetailsPopup');
                        if (popup) {
                            popup.remove();
                        }
                    }
                    
                    // Function to set the blinking effect
                    function setBlinkingEffect() {
                        const phaseColumns = document.querySelectorAll('#projectTable td');
                    
                        phaseColumns.forEach((column, index) => {
                            if (column.innerText === '✔') {
                                const nextColumn = phaseColumns[index + 1];
                                if (nextColumn && nextColumn.innerText.trim() === '') {
                                    nextColumn.classList.add('blinking');
                                }
                            }
                        });
                    }
                    
                    // Event listeners for phase boxes
                    const phaseCells = document.querySelectorAll('#projectTableBody .phase-box');
                    
                    phaseCells.forEach(cell => {
                        cell.addEventListener('mouseenter', async (event) => {
                            const phaseId = cell.getAttribute('data-phase-id'); // Correctly retrieving the phaseId
                            const { clientX: x, clientY: y } = event; // Get mouse position
                    
                            if (phaseId) {
                                try {
                                    const phaseResponse = await fetch(`http://localhost:3000/api/v1/phases/m/${phaseId}`, {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                                        }
                                    });
                    
                                    if (phaseResponse.ok) {
                                        const phaseDetails = await phaseResponse.json();
                                        showPhaseDetailsPopup(phaseDetails, x, y); // Show popup with phase details
                                    } else {
                                        console.error('Error fetching phase details');
                                    }
                                } catch (error) {
                                    console.error('Error fetching phase details:', error);
                                }
                            }
                        });
                    
                        cell.addEventListener('mouseleave', () => {
                            hidePhaseDetailsPopup(); // Hide the popup when the mouse leaves
                        });
                    });

                    row.addEventListener('click', () => handleProjectClick(project.projectId));
                    projectTableBody.appendChild(row);
                    // console.log(project._id);
                });
                // Attach Edit Button Event Listeners
                // Event listener for the Edit button
    document.querySelectorAll('.edit-project-btn').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const projectId = this.getAttribute('data-project-id');

        // Open the modal
        $('#editProjectModal').modal('show');

        // Save changes button logic
        document.getElementById('saveChanges').addEventListener('click', async () => {
            const projectName = document.getElementById('editProjectName').value;
            const teamLead = document.getElementById('editTeamLead').value;

            if (projectName || teamLead) {
                try {
                    const updateFields = {};
                    if (projectName) updateFields.projectName = projectName;
                    if (teamLead) updateFields.teamLead = teamLead;

                    const response = await fetch(`http://localhost:3000/api/v1/projects/k2/${projectId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        },
                        body: JSON.stringify(updateFields)
                    });

                    if (response.ok) {
                        alert('Project updated successfully!');
                        $('#editProjectModal').modal('hide'); // Close the modal
                        displayProjects(); // Refresh the project list
                    } else {
                        const error = await response.json();
                        console.error('Error updating project:', error.message);
                        alert('Failed to update project: ' + error.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while updating the project.');
                }
            } else {
                alert('Please fill in at least one field.');
            }
        }, { once: true }); // Ensure the event listener is attached only once
    });
});

            } else {
                const error = await response.json();
                console.error('Error fetching projects:', error.message);
                alert('Failed to load projects.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading projects.');
        }
    }
    displayProjects();
    function getPhaseClass(status) {
        return status === 'completed' ? 'completed' : 'in-progress';
    }

    function handleProjectClick(projectId) {
        const project = projects.find(p => p.projectId === projectId);
        if (project) {
            showProjectDetails(project);
        } else {
            console.error('Project not found');
            alert('Project not found.');
        }
    }

    backButton.addEventListener('click', () => {
        projectTable.classList.remove('hidden');
        projectDetails.classList.add('hidden');
        detailsContainer.innerHTML = '';
        phaseBoxes.innerHTML = '';
    });
    cancel.addEventListener('click', () => {
        projectTable.classList.remove('hidden');
        projectDetails.classList.add('hidden');
        detailsContainer.innerHTML = '';
        phaseBoxes.innerHTML = '';
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        projectTableBody.querySelectorAll('tr').forEach(row => {
            const projectName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            row.style.display = projectName.includes(searchTerm) ? '' : 'none';
        });
    });

    // Initial load of projects
    // displayProjects();







    // Connect to the Socket.IO server
// const socket = io.connect('http://localhost:3000'); // Replace with your server URL if different

// // Elements
// const notificationIcon = document.getElementById('notification-icon');
// const notificationCount = document.getElementById('notification-count');
// const notificationSidebar = document.getElementById('notification-sidebar');
// const notificationsList = document.getElementById('notifications-list');
// const closeSidebarBtn = document.getElementById('close-sidebar');

// // Notification count
// let unreadCount = 0;

// // Handle incoming notifications
// socket.on('notification', (data) => {
//     unreadCount++;
//     notificationCount.textContent = unreadCount;
//     notificationCount.style.display = 'block';
//     console.log("ewww");
//     const notificationItem = document.createElement('li');
//     notificationItem.textContent = `${data.message} at ${new Date(data.createdAt).toLocaleTimeString()}`;
//     notificationsList.appendChild(notificationItem);
// });

// // Show notification sidebar
// notificationIcon.addEventListener('click', () => {
//     notificationSidebar.style.display = 'block';
//     notificationCount.style.display = 'none';
//     console.log("ewwhn");
//     unreadCount = 0;
// });

// // Close notification sidebar
// closeSidebarBtn.addEventListener('click', () => {
//     notificationSidebar.style.display = 'none';
// });


});
