import { loadSettings, applySettings } from './settings.js';
import { loadTasks, addTask, toggleTaskCompletion, deleteTask } from './tasks.js';
import { loadMoodEntries, addMoodEntry, deleteMoodEntry } from './moods.js';
import { loadHabits, saveHabits } from './habits.js';
import { updateOverview, updateStatistics } from './statistics.js';

function initApp() {
    loadSettings();
    loadTasks();
    loadMoodEntries();
    loadHabits();
    updateOverview();
    updateStatistics();

    // Add event listeners
    document.getElementById('task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addTask();
    });

    document.getElementById('mood-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addMoodEntry();
    });

    document.getElementById('settings-form').addEventListener('submit', function(e) {
        e.preventDefault();
        applySettings();
    });

    document.getElementById('priority-slider').addEventListener('input', updatePriorityDisplay);
    document.getElementById('mood-slider').addEventListener('input', updateMoodDisplay);
    document.getElementById('theme-slider').addEventListener('input', updateThemeDisplay);
    document.getElementById('font-size-slider').addEventListener('input', updateFontSizeDisplay);
}

function updatePriorityDisplay() {
    const value = document.getElementById('priority-slider').value;
    const display = document.getElementById('priority-display');
    display.textContent = ['Low Priority', 'Medium Priority', 'High Priority'][value - 1];
}

function updateMoodDisplay() {
    const value = document.getElementById('mood-slider').value;
    const display = document.getElementById('mood-display');
    display.textContent = ['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good'][value - 1];
}

function updateThemeDisplay() {
    const value = document.getElementById('theme-slider').value;
    const display = document.getElementById('theme-display');
    display.textContent = value === '1' ? 'Dark Theme' : 'Light Theme';
}

function updateFontSizeDisplay() {
    const value = document.getElementById('font-size-slider').value;
    const display = document.getElementById('font-size-display');
    display.textContent = ['Small', 'Default', 'Large'][value - 1] + ' Size';
}

document.addEventListener('DOMContentLoaded', initApp);