import { tasks } from './tasks.js';
import { moodEntries } from './moods.js';

export function updateOverview() {
    const totalTasks = tasks.length;
    const tasksCompleted = tasks.filter(task => task.completed).length;

    document.getElementById('tasks-completed').textContent = tasksCompleted;
    document.getElementById('total-tasks').textContent = totalTasks;

    const tasksProgress = document.getElementById('tasks-progress');
    tasksProgress.max = totalTasks;
    tasksProgress.value = tasksCompleted;

    const today = new Date().toISOString().split('T')[0];
    const todayMood = moodEntries.find(entry => entry.date.startsWith(today));

    const currentMoodEl = document.getElementById('current-mood');
    currentMoodEl.textContent = todayMood ? todayMood.mood : 'No mood logged today.';
}

export function updateStatistics() {
    updateTasksChart();
    updateMoodChart();
}

function updateTasksChart() {
    const ctx = document.getElementById('tasksChart').getContext('2d');
    const taskData = getTaskData();

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Today', 'This Week', 'This Month'],
            datasets: [{
                label: 'Tasks Completed',
                data: taskData,
                backgroundColor: 'rgba(187, 134, 252, 0.8)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateMoodChart() {
    const ctx = document.getElementById('moodChart').getContext('2d');
    const moodData = getMoodData();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: moodData.labels,
            datasets: [{
                label: 'Mood',
                data: moodData.data,
                borderColor: 'rgba(3, 218, 197, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return ['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good'][value - 1];
                        }
                    }
                }
            }
        }
    });
}

function getTaskData() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const tasksCompletedToday = tasks.filter(task => task.completed && task.createdAt.startsWith(today)).length;
    const tasksCompletedThisWeek = tasks.filter(task => task.completed && task.createdAt >= weekAgo).length;
    const tasksCompletedThisMonth = tasks.filter(task => task.completed && task.createdAt >= monthAgo).length;

    return [tasksCompletedToday, tasksCompletedThisWeek, tasksCompletedThisMonth];
}

function getMoodData() {
    const moodValues = {
        'Very Bad': 1,
        'Bad': 2,
        'Neutral': 3,
        'Good': 4,
        'Very Good': 5
    };

    const last7Days = moodEntries
        .slice(-7)
        .map(entry => ({
            date: new Date(entry.date).toLocaleDateString(),
            value: moodValues[entry.mood]
        }));

    return {
        labels: last7Days.map(day => day.date),
        data: last7Days.map(day => day.value)
    };
}