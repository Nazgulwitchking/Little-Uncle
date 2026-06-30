// Extensions/Stundenplan/stundenplan.js

let currentYear, currentMonth;
let selectedDateStr;
let isMonthView = false; // Startet im Kompaktmodus

export function initStundenplan() {
    // ... DEIN BESTEHENDER STUNDENPLAN-CODE (Tabelle generieren, laden, etc.) von vorhin ...
    // [Hier den alten Inhalt der Funktion stehen lassen!]

    // INIT KALENDER
    const heute = new Date();
    currentYear = heute.getFullYear();
    currentMonth = heute.getMonth();
    selectedDateStr = getFormattedDate(heute);

    renderCalendar();
    selectDate(selectedDateStr);
}

function getFormattedDate(date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${y}-${m}-${d}`;
}

// Schaltet zwischen Kompakt (nur heute) und vollem Monat um
window.toggleCalendarView = function() {
    isMonthView = !isMonthView;
    const grid = document.getElementById('calendar-grid');
    const nav = document.getElementById('calendar-nav');
    const title = document.getElementById('calendar-title');
    const btn = document.getElementById('btn-calendar-view');

    if (isMonthView) {
        grid.classList.remove('compact');
        nav.style.display = 'flex';
        title.innerText = '📅 Monatsplaner';
        btn.innerText = '📱 Heute zeigen';
    } else {
        grid.classList.add('compact');
        nav.style.display = 'none';
        title.innerText = '📅 Heute (Kompaktmodus)';
        btn.innerText = '📅 Ganzer Monat';
        // Zurück zum aktuellen Monat springen
        const heute = new Date();
        currentYear = heute.getFullYear();
        currentMonth = heute.getMonth();
    }
    renderCalendar();
};

window.changeMonth = function(direction) {
    currentMonth += direction;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
};

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthYearSign = document.getElementById('current-month-year');
    grid.innerHTML = '';

    const heute = new Date();
    const heuteStr = getFormattedDate(heute);
    const monatsNamen = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    
    if (monthYearSign) monthYearSign.innerText = `${monatsNamen[currentMonth]} ${currentYear}`;

    const savedEvents = JSON.parse(localStorage.getItem('little_uncle_calendar_events') || '{}');

    if (!isMonthView) {
        // KOMPAKTMODUS: Nur den heutigen Tag rendern
        createDayElement(heute.getDate(), heuteStr, savedEvents, grid, true);
    } else {
        // MONATSMODUS: Alle Tage des Monats berechnen
        const ersterTagIndex = new Date(currentYear, currentMonth, 1).getDay(); // Wochentag von Tag 1
        const anzahlTage = new Date(currentYear, currentMonth + 1, 0).getDate(); // Tage im Monat
        
        // Verschiebung für Montag als ersten Tag der Woche (JS startet mit Sonntag = 0)
        let leerTage = ersterTagIndex === 0 ? 6 : ersterTagIndex - 1;

        for (let i = 0; i < leerTage; i++) {
            const emptyDiv = document.createElement('div');
            grid.appendChild(emptyDiv);
        }

        for (let tag = 1; tag <= anzahlTage; tag++) {
            const dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(tag).padStart(2, '0')}`;
            createDayElement(tag, dStr, savedEvents, grid, dStr === heuteStr);
        }
    }
}

function createDayElement(tagNum, dateStr, savedEvents, targetGrid, isToday) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    if (isToday) dayDiv.classList.add('today-glow'); // Unser Lila-Blau Glow!
    if (dateStr === selectedDateStr) dayDiv.classList.add('selected-day');

    const eventText = savedEvents[dateStr] || '';
    dayDiv.innerHTML = `
        <div class="day-number">${tagNum}</div>
        <div class="day-preview">${eventText}</div>
    `;

    dayDiv.onclick = () => selectDate(dateStr);
    targetGrid.appendChild(dayDiv);
}

function selectDate(dateStr) {
    selectedDateStr = dateStr;
    
    // Visuelles Feedback aktualisieren
    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected-day'));
    renderCalendar(); // Re-render setzt die Klasse für das neue Datum

    // Formular updaten
    const [y, m, d] = dateStr.split('-');
    document.getElementById('selected-date-title').innerText = `Eintrag für den ${d}.${m}.${y}:`;
    
    const savedEvents = JSON.parse(localStorage.getItem('little_uncle_calendar_events') || '{}');
    document.getElementById('calendar-event-input').value = savedEvents[dateStr] || '';
}

window.saveCalendarEvent = function() {
    const inputVal = document.getElementById('calendar-event-input').value;
    const savedEvents = JSON.parse(localStorage.getItem('little_uncle_calendar_events') || '{}');
    
    if (inputVal.trim() === '') {
        delete savedEvents[selectedDateStr];
    } else {
        savedEvents[selectedDateStr] = inputVal;
    }
    
    localStorage.setItem('little_uncle_calendar_events', JSON.stringify(savedEvents));
    renderCalendar();
    alert("Eintrag erfolgreich gespeichert! 📌");
};
