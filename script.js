// Initialize data storage
let quests = JSON.parse(localStorage.getItem('quests')) || [];
let moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
let userXP = parseInt(localStorage.getItem('userXP')) || 0; // User XP
let userLevel = parseInt(localStorage.getItem('userLevel')) || 1; // User Level

// Function to add a new quest
function addQuest() {
    const questInput = document.getElementById('questInput');
    const questText = questInput.value.trim();
    if (questText) {
        const newQuest = {
            text: questText,
            completed: false,
            date: new Date().toISOString()
        };
        quests.push(newQuest);
        questInput.value = '';
        updateQuestList();
        saveData();
        userXP += 10; // Gain 10 XP for adding a quest
        updateLevel();
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
        li.setAttribute('data-id', quest.id);
        li.innerHTML = `
            <div class="checkbox">
                <span class="close"><i class="fa fa-times"></i></span>
                <label>
                    <span class="checkbox-mask"></span>
                    <input type="checkbox" ${quest.completed ? 'checked' : ''} />
                    ${quest.text}
                </label>
            </div>
        `;
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleQuest(index));
        const deleteButton = li.querySelector('.close');
        deleteButton.addEventListener('click', () => deleteQuest(index));
        questList.appendChild(li);
        if (quest.completed) completedCount++;
    });
    document.getElementById('completedCount').textContent = completedCount;
    updateProgressBar(completedCount);
    updateDailyProgress();
    updateCharts();
}

// Function to update the overall progress bar
function updateProgressBar(completedCount) {
    const totalQuests = quests.length;
    const progressBar = document.getElementById('questProgress');
    const progressPercentage = totalQuests ? (completedCount / totalQuests) * 100 : 0;
    progressBar.style.width = `${progressPercentage}%`;
}

// Function to update daily progress
function updateDailyProgress() {
    const today = new Date().toDateString();
    const completedToday = quests.filter(
        quest => quest.completed && new Date(quest.date).toDateString() === today
    ).length;
    const totalToday = quests.filter(
        quest => new Date(quest.date).toDateString() === today
    ).length;

    const progressPercentage = totalToday ? (completedToday / totalToday) * 100 : 0;
    const progressBar = document.getElementById('dailyProgressBar');
    const progressValue = document.getElementById('progressValue');

    progressBar.style.width = `${progressPercentage}%`;
    progressValue.textContent = `${Math.round(progressPercentage)}%`;
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
    if (now - lastMoodLogTime < 1000) {
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
    localStorage.setItem('userXP', userXP); // Save user XP
    localStorage.setItem('userLevel', userLevel); // Save user Level
}

// Function to filter mood logs based on time frame
function filterMoodLogs(timeFrame) {
    const filteredMoodLog = document.getElementById('filteredMoodLog');
    filteredMoodLog.innerHTML = '';
    const now = new Date();
    let filteredLogs;

    switch (timeFrame) {
        case '24h':
            filteredLogs = moodLogs.filter(log =>
                new Date(log.date) > new Date(now - 24 * 60 * 60 * 1000)
            );
            break;
        case '1w':
            filteredLogs = moodLogs.filter(log =>
                new Date(log.date) > new Date(now - 7 * 24 * 60 * 60 * 1000)
            );
            break;
        case '2w':
            filteredLogs = moodLogs.filter(log =>
                new Date(log.date) > new Date(now - 14 * 24 * 60 * 60 * 1000)
            );
            break;
        case '4w':
            filteredLogs = moodLogs.filter(log =>
                new Date(log.date) > new Date(now - 28 * 24 * 60 * 60 * 1000)
            );
            break;
        default:
            filteredLogs = [];
    }

    // Remove specific mood log entries
    filteredLogs = filteredLogs.filter(log => {
        const logDate = new Date(log.date);
        return !(logDate.getDate() === 6 && logDate.getMonth() === 9 && logDate.getFullYear() === 2024);
    });

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
    if (window.moodChartInstance) {
        window.moodChartInstance.destroy();
    }

    const lastWeekMoods = moodLogs.filter(
        log => new Date(log.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    const moodData = {
        happy: [],
        sad: [],
        anxious: [],
        excited: [],
        tired: []
    };
    lastWeekMoods.forEach(log => {
        for (let mood in log.mood) {
            moodData[mood].push(parseInt(log.mood[mood]));
        }
    });

    // Prepare data for chart
    const labels = lastWeekMoods.map(log => new Date(log.date).toLocaleDateString());
    const datasets = Object.keys(moodData).map(mood => ({
        label: mood.charAt(0).toUpperCase() + mood.slice(1),
        data: moodData[mood],
        borderColor: getColorForMood(mood),
        fill: false,
        tension: 0.1
    }));

    window.moodChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Mood Trends Over Last Week' }
            },
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });
}

// Function to get color for moods
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
    if (window.taskChartInstance) {
        window.taskChartInstance.destroy();
    }

    const lastWeekTasks = quests.filter(
        quest => new Date(quest.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
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
                legend: { position: 'top' },
                title: { display: true, text: 'Task Completion (Last Week)' }
            }
        }
    });
}

// Function to update user level based on XP
function updateLevel() {
    const levelUpXP = 100; // XP required to level up
    if (userXP >= levelUpXP * userLevel) {
        userLevel++;
        alert(`Congratulations! You've reached Level ${userLevel}!`);
    }
    document.getElementById('levelDisplay').textContent = `Level: ${userLevel} | XP: ${userXP}/${levelUpXP * userLevel}`;
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
updateLevel(); // Update level display on load