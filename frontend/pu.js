document.addEventListener('DOMContentLoaded', function() {
    console.log(localStorage.getItem('authToken'))
    function showPhaseDetails() {
        const projectId = document.getElementById('projectId').value;
        const projectName = document.getElementById('projectName').value;
        const teamLead = document.getElementById('teamLead').value;
    
        // Update the summary section
        document.getElementById('projectId').textContent = projectId;
        document.getElementById('projectName').textContent = projectName;
        document.getElementById('teamLead').textContent = teamLead;
    
        // Show phase details section
        document.getElementById('project-info-form').style.display = 'none';
        // document.getElementById('work-progress').style.display = 'block';
    }

    document.getElementById('project-info-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log("hi")
        const projectId = document.getElementById('projectId').value;
        
        
        try {
            const response = await fetch(`http://localhost:3000/api/v1/phases/${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
            if(response.ok){
                const data=await response.json();
                console.log(data)
                const projectName =document.getElementById('projectName').value;
                console.log(data._id)
                console.log(data.projectId)
                console.log(data.projectName)
                localStorage.setItem('projectMongoId', data._id);
                // console.log("hira")
                document.getElementById('summaryProjectId').innerText = data.projectId;
                document.getElementById('summaryProjectName').innerText = data.projectName;
                document.getElementById('summaryTeamLead').textContent = data.teamLead;
                console.log(data.phases)
               
                
                fetchAndDisplayPhases(data.phases)
                
                
                 // Pre-fill checkboxes based on phase data
            } else {
                const error = await response.json();
                throw new Error(`Project ID fetch error: ${error.message}`);
                
            }
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error fetching project ID: ${error.message}`);
        }
    });

    
    document.getElementById("project-info-form").addEventListener('submit', async function(event) {
        event.preventDefault();
        

        // const projectId = document.getElementById('projectId').value.trim();

        
        try {
            // Fetch project details from the backend
            const projectResponse = await fetch(`http://localhost:3000/api/v1/projects`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
           
            if (projectResponse.ok) {
                const projectData = await projectResponse.json();
                console.log(projectData.projectId)
                console.log(projectData)

                // Update the summary section
                

                
               
                // Fetch and display phase details
               

                document.getElementById('project-summary').classList.remove('hidden');
                document.getElementById('project-info-form').classList.add('hidden');
                document.getElementById('phase-details').classList.remove('hidden');
                console.log(JSON.stringify(projectData.phases))
                // await fetchAndDisplayPhases(projectData.phases);
                console.log("correct aa")
            } else {
                const error = await projectResponse.json();
                throw new Error(`Project fetch error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Error fetching project details: ${error.message}`);
        }
    });
    
    // async function fetchPhaseDetails(phaseId) {
    //     try {
    //         const phaseResponse = await fetch(`http://localhost:3000/api/v1/phases/m/${phaseId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    //             }
    //         });
    
    //         if (phaseResponse.ok) {
    //             const phaseDetails = await phaseResponse.json();
    //             showPhaseDetailsPopup(phaseDetails); // Show popup with phase details
    //         } else {
    //             console.error('Error fetching phase details');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching phase details:', error);
    //     }
    // }
    
    // function showPhaseDetailsPopup(details) {
    //     let popup = document.getElementById('phaseDetailsPopup');
    
    //     if (popup) {
    //         popup.remove(); // Remove existing popup if it exists
    //     }
    
    //     // Create the popup div
    //     popup = document.createElement('div');
    //     popup.id = 'phaseDetailsPopup';
       
    
    //     // Fill the popup with phase details
    //     popup.innerHTML = `
    //         <strong>Phase Name:</strong> ${details.name || 'N/A'}<br>
    //         <strong>Monitor:</strong> ${details.monitor || 'N/A'}<br>
    //         <button id="closePopupBtn">Close</button>
    //     `;
    
    //     // Append the popup to the body
    //     document.body.appendChild(popup);
    
    //     // Add event listener to close the popup
    //     document.getElementById('closePopupBtn').addEventListener('click', () => {
    //         popup.remove();
    //     });
    // }
    async function fetchAndDisplayPhases(phaseIds) {
        const phaseContainer = document.getElementById('phase-container');
        phaseContainer.innerHTML = ''; // Clear existing content
        

        for (const [index, phaseId] of phaseIds.entries()) {
            try {
                const phaseResponse = await fetch(`http://localhost:3000/api/v1/phases/m/${phaseId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (phaseResponse.ok) {
                    const phaseData = await phaseResponse.json();

                    // Create and display phase details
                    const phaseBox = document.createElement('div');
                    // phaseBox.style.backgroundColor="red";
                    phaseBox.style.margin="10px";
                    phaseBox.style.border="1px solid black";
                    phaseBox.className = `phase-box ${getPhaseClass(phaseData.status)}`; // Use status for class
                    console.log(phaseData.status)
                    const phaseName = document.createElement('h3');
                    phaseName.textContent = `Phase ${index + 1}: ${phaseData.name}`;
                    phaseBox.appendChild(phaseName);

                    const monitorName = document.createElement('p');
                    monitorName.textContent = `Monitor: ${phaseData.monitor}`;
                    phaseBox.appendChild(monitorName);

                    const editButton = document.createElement('button');
                    editButton.className = 'edit-button';
                   
                    editButton.textContent = 'Edit';
                    editButton.style.display="flex"
                    editButton.style.justifyContent="center"
                    editButton.style.alignItems="center"
                    //  editButton.style.paddingLeft="80px"
                    editButton.style.marginLeft="30px";
                    
                    editButton.addEventListener('click', function () {
                        editMonitorName(phaseId, phaseData.monitor);
                    });
                    phaseBox.appendChild(editButton);

                    phaseContainer.appendChild(phaseBox);
                } else {
                    throw new Error(`Failed to fetch phase ${index + 1}`);
                }
            } catch (error) {
                console.error('Error:', error.message);
                alert(`Error fetching phase details: ${error.message}`);
            }
        }
    }

    // function editMonitorName(phaseId, currentMonitorName) {
    //     const popup = document.getElementById('editMonitorPopup');
    //     const newMonitorNameInput = document.getElementById('newMonitorNameInput');
    //     const saveButton = document.getElementById('saveMonitorNameBtn');
    //     const cancelButton = document.getElementById('cancelMonitorNameBtn');
    
    //     // Display the popup
    //     popup.style.display = 'block';
    //     newMonitorNameInput.value = currentMonitorName;
    
    //     // Handle the save button click
       
    //         const newMonitorName = newMonitorNameInput.value.trim();
    
        

    //     if (monitor) {
    //         fetch(`http://localhost:3000/api/v1/phases/so/${currentMonitorName}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    //             },
    //             body: JSON.stringify({ monitor: newMonitorName })
                
    //         })
    //         .then(response => {
    //             if (response.ok) {
    //                 alert('Monitor name updated successfully');
    //                 fetchAndDisplayPhases([phaseId]); // Refresh the specific phase details
    //             } else {
    //                 return response.json().then(error => {
    //                     throw new Error(`Error updating monitor name: ${error.message}`);
    //                 });
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //             alert(`Error updating monitor name: ${error.message}`);
    //         });
    //     }
    // }
    function editMonitorName(phaseId, currentMonitorName) {
        const popup = document.getElementById('editMonitorPopup');
        const newMonitorNameInput = document.getElementById('newMonitorNameInput');
        const saveButton = document.getElementById('saveMonitorNameBtn');
        const cancelButton = document.getElementById('cancelMonitorNameBtn');
    
        // Display the popup
        popup.style.display = 'block';
        newMonitorNameInput.value = currentMonitorName;
    
        // Handle the save button click
        saveButton.onclick = function() {
            const newMonitorName = newMonitorNameInput.value.trim();
            console.log(newMonitorName)
            if (newMonitorName) {
                fetch(`http://localhost:3000/api/v1/phases/so/${phaseId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify({ monitor: newMonitorName })
                })
                .then(response => {
                    if (response.ok) {
                        alert('Monitor name updated successfully');
                        // window.location.reload()
                        fetchAndDisplayPhases([phaseId]); // Refresh the specific phase details
                    } else {
                        return response.json().then(error => {
                            throw new Error(`Error updating monitor name: ${error.message}`);
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(`Error updating monitor name: ${error.message}`);
                })
                .finally(() => {
                    popup.style.display = 'none'; // Hide the popup after the process
                });
            }
        };
    
        // Handle the cancel button click
        cancelButton.onclick = function() {
            popup.style.display = 'none'; // Hide the popup without saving
        };
    }
    
    function getPhaseClass(status) {
        switch (status) {
            case 'Completed': return 'completed';
            case 'On Track': return 'on-track';
            case 'Not Completed': return 'not-completed';
            default: return '';
        }
    }

    // Handle Back button to return to the search form
    document.getElementById('backBtn').addEventListener('click', function() {
        document.getElementById('project-summary').classList.add('hidden');
        document.getElementById('phase-details').classList.add('hidden');
        document.getElementById('project-info-form').classList.remove('hidden');
    });
});
