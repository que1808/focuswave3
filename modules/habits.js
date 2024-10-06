let habits = JSON.parse(localStorage.getItem('habits')) || {};

export function loadHabits() {
    const habitCheckboxes = document.querySelectorAll('.habit-checkbox');
    habitCheckboxes.forEach(checkbox => {
        const habitName = checkbox.dataset.habit;
        checkbox.checked = habits[habitName] || false;
        checkbox.addEventListener('change', () => {
            habits[habitName] = checkbox.checked;
            saveHabits();
        });
    });
}

export function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}