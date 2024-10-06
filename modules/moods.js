let moodEntries = JSON.parse(localStorage.getItem('moodEntries')) || [];

export function loadMoodEntries() {
    const moodTable = document.getElementById('mood-table');
    moodTable.innerHTML = `
        <tr>
            <th>Date</th>
            <th>M.O.O.D.</th>
            <th>Notes</th>
            <th>Delete</th>
        </tr>
    `;

    moodEntries.forEach((entry, index) => {
        const row = moodTable.insertRow();
        row.innerHTML = `
            <td>${new Date(entry.date).toLocaleString()}</td>
            <td>${entry.mood}</td>
            <td>${entry.notes}</td>
            <td><button onclick="window.deleteMoodEntry(${index})">🗑️</button></td>
        `;
    });
}

export function addMoodEntry() {
    const mood = ['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good'][document.getElementById('mood-slider').value - 1];
    const notes = document.getElementById('notes').value.trim();
    const date = new Date().toISOString();

    const moodEntry = { date, mood, notes };

    moodEntries.push(moodEntry);
    saveMoodEntries();
    loadMoodEntries();
    document.getElementById('mood-form').reset();
}

export function deleteMoodEntry(index) {
    moodEntries.splice(index, 1);
    saveMoodEntries();
    loadMoodEntries();
}

function saveMoodEntries() {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
}

window.deleteMoodEntry = deleteMoodEntry;