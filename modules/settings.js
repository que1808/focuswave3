export function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    document.getElementById('theme-slider').value = settings.theme === 'light' ? '2' : '1';
    document.getElementById('font-size-slider').value = settings.fontSize || '2';
    applySettings();
}

export function applySettings() {
    const theme = document.getElementById('theme-slider').value === '2' ? 'light' : 'dark';
    const fontSize = document.getElementById('font-size-slider').value;

    if (theme === 'light') {
        document.body.style.backgroundColor = '#FFFFFF';
        document.body.style.color = '#000000';
    } else {
        document.body.style.backgroundColor = '#121212';
        document.body.style.color = '#E0E0E0';
    }

    document.body.style.fontSize = ['14px', '16px', '18px'][fontSize - 1];

    const settings = { theme, fontSize };
    localStorage.setItem('settings', JSON.stringify(settings));
}