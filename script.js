// Initialize data storage
let quests = JSON.parse(localStorage.getItem('quests')) || [];
let moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];

// Function to add a new quest
function addQuest() {
    const questInput = document.getElementById('questInput');
    const questText = questInput.value.trim();
    if (questText) {
        const newQuest = { text: questText, completed: false, date: new Date().toISOString() };
        quests.push(newQuest);
        questInput.value = '';
        updateQuestList();
        saveData();
    } else {
        alert('Please enter a quest.');
    }
}

// Function to update the quest list display
function updateQuestList() {
    const questList = document.getElementById('quests');
    questList.innerHTML = '';
    let completedCount = 0;
    quests.forEach((quest, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${quest.completed ? 'checked' : ''} />
            <span class="${quest.completed ? 'completed' : ''}">${quest.text}</span>
            <small>Added on: ${new Date(quest.date).toLocaleDateString()}</small>
            <button class="delete-btn">Delete</button>
        `;
        // Add event listeners
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleQuest(index));
        const deleteButton = li.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => deleteQuest(index));
        
        questList.appendChild(li);
        if (quest.completed) completedCount++;
    });
    document.getElementById('completedCount').textContent = completedCount;
    updateProgressBar(completedCount);
    updateCharts();
}

// Function to update progress bar
function updateProgressBar(completedCount) {
    const totalQuests = quests.length;
    const progressBar = document.getElementById('questProgress');
    const progressPercentage = totalQuests ? (completedCount / totalQuests) * 100 : 0;
    progressBar.style.width = `${progressPercentage}%`;
}

// Function to toggle quest completion
function toggleQuest(index) {
    quests[index].completed = !quests[index].completed;
    updateQuestList();
    saveData();
}

// Function to delete a quest
function deleteQuest(index) {
    if (confirm('Are you sure you want to delete this quest?')) {
        quests.splice(index, 1);
        updateQuestList();
        saveData();
    }
}

// Function to log mood
let lastMoodLogTime = 0;
function logMood() {
    const now = Date.now();
    if (now - lastMoodLogTime < 1000) { // 1 second interval
        alert('Please wait a moment before logging again.');
        return;
    }
    lastMoodLogTime = now;

    const moodValues = {
        happy: document.getElementById('happy').value,
        sad: document.getElementById('sad').value,
        anxious: document.getElementById('anxious').value,
        excited: document.getElementById('excited').value,
        tired: document.getElementById('tired').value
    };
    const mood = { mood: moodValues, date: new Date().toISOString() };
    moodLogs.push(mood);
    updateMoodLog();
    saveData();
    updateCharts();
    resetMoodSliders();
}

// Function to update mood log display
function updateMoodLog() {
    const moodLog = document.getElementById('moodLog');
    moodLog.innerHTML = '';
    moodLogs.slice(-5).reverse().forEach(log => {
        const p = document.createElement('p');
        p.textContent = `${new Date(log.date).toLocaleString()}: ${JSON.stringify(log.mood)}`;
        moodLog.appendChild(p);
    });
}

// Function to reset mood sliders
function resetMoodSliders() {
    ['happy', 'sad', 'anxious', 'excited', 'tired'].forEach(mood => {
        document.getElementById(mood).value = 50;
        document.getElementById(`${mood}Value`).textContent = 50;
    });
}

// Function to save data to localStorage
function saveData() {
    localStorage.setItem('quests', JSON.stringify(quests));
    localStorage.setItem('moodLogs', JSON.stringify(moodLogs));
}

// Function to filter mood logs based on time frame
function filterMoodLogs(timeFrame) {
    const filteredMoodLog = document.getElementById('filteredMoodLog');
    filteredMoodLog.innerHTML = ''; // Clear previous logs
    const now = new Date();
    let filteredLogs;

    switch (timeFrame) {
        case '24h':
            filteredLogs = moodLogs.filter(log => new Date(log.date) > new Date(now - 24 * 60 * 60 * 1000));
            break;
        case '1w':
            filteredLogs = moodLogs.filter(log => new Date(log.date) > new Date(now - 7 * 24 * 60 * 60 * 1000));
            break;
        case '2w':
            filteredLogs = moodLogs.filter(log => new Date(log.date) > new Date(now - 14 * 24 * 60 * 60 * 1000));
            break;
        case '4w':
            filteredLogs = moodLogs.filter(log => new Date(log.date) > new Date(now - 28 * 24 * 60 * 60 * 1000));
            break;
        default:
            filteredLogs = [];
    }

    if (filteredLogs.length === 0) {
        filteredMoodLog.innerHTML = '<p>No mood logs found for this time frame.</p>';
    } else {
        filteredLogs.forEach(log => {
            const p = document.createElement('p');
            p.textContent = `${new Date(log.date).toLocaleString()}: ${JSON.stringify(log.mood)}`;
            filteredMoodLog.appendChild(p);
        });
    }
}

// Function to update charts
function updateCharts() {
    updateMoodChart();
    updateTaskChart();
}

// Function to update mood chart
function updateMoodChart() {
    const ctx = document.getElementById('moodChart').getContext('2d');
    // Clear previous chart
    if (window.moodChartInstance) {
        window.moodChartInstance.destroy();
    }

    const lastWeekMoods = moodLogs.filter(log => new Date(log.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const moodData = {
        happy: [], sad: [], anxious: [], excited: [], tired: []
    };
    lastWeekMoods.forEach(log => {
        for (let mood in log.mood) {
            moodData[mood].push(parseInt(log.mood[mood]));
        }
    });

    // Calculate averages
    const averageMood = {};
    for (let mood in moodData) {
        const total = moodData[mood].reduce((a, b) => a + b, 0);
        averageMood[mood] = moodData[mood].length ? (total / moodData[mood].length).toFixed(2) : 0;
    }

    // Update average moods display
    const averageMoodsDiv = document.getElementById('averageMoods');
    if (averageMoodsDiv) {
        averageMoodsDiv.innerHTML = `
            <h3>Average Moods (Last Week)</h3>
            <ul>
                ${Object.keys(averageMood).map(mood => `<li>${mood.charAt(0).toUpperCase() + mood.slice(1)}: ${averageMood[mood]}</li>`).join('')}
            </ul>
        `;
    }

    window.moodChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: lastWeekMoods.map(log => new Date(log.date).toLocaleDateString()),
            datasets: Object.keys(moodData).map(mood => ({
                label: mood.charAt(0).toUpperCase() + mood.slice(1),
                data: moodData[mood],
                borderColor: getColorForMood(mood),
                fill: false,
                tension: 0.1
            }))
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Mood Trends Over Last Week'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Function to get color for mood
function getColorForMood(mood) {
    const colors = {
        happy: '#FFD700',
        sad: '#4682B4',
        anxious: '#8B0000',
        excited: '#32CD32',
        tired: '#A9A9A9'
    };
    return colors[mood] || '#0000';
}

// Function to update task chart
function updateTaskChart() {
    const ctx = document.getElementById('taskChart').getContext('2d');
    // Clear previous chart
    if (window.taskChartInstance) {
        window.taskChartInstance.destroy();
    }

    const lastWeekTasks = quests.filter(quest => new Date(quest.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const completedTasks = lastWeekTasks.filter(quest => quest.completed).length;
    const incompleteTasks = lastWeekTasks.length - completedTasks;

    window.taskChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Completed', 'Incomplete'],
            datasets: [{
                data: [completedTasks, incompleteTasks],
                backgroundColor: ['#4CAF50', '#FF5722']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Task Completion (Last Week)'
                }
            }
        }
    });
}

// Event listeners for mood sliders
['happy', 'sad', 'anxious', 'excited', 'tired'].forEach(mood => {
    const slider = document.getElementById(mood);
    const valueDisplay = document.getElementById(`${mood}Value`);
    slider.addEventListener('input', function() {
        valueDisplay.textContent = this.value;
    });
});

// Event listeners for buttons
document.getElementById('addQuestButton').addEventListener('click', addQuest);
document.getElementById('logMoodButton').addEventListener('click', logMood);

// Initial setup
updateQuestList();
updateMoodLog();
updateCharts();