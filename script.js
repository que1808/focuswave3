import { loadSettings, applySettings } from './modules/settings.js';
import { loadTasks, addTask, toggleTaskCompletion, deleteTask } from './modules/tasks.js';
import { loadMoodEntries, addMoodEntry, deleteMoodEntry } from './modules/moods.js';
import { loadHabits, saveHabits } from './modules/habits.js';
import { updateOverview, updateStatistics } from './modules/statistics.js';

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    loadSettings();
    loadTasks();
    loadMoodEntries();
    loadHabits();
    updateOverview();
    updateStatistics();
}
