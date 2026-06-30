export function initStundenplan() {
    const timetableBody = document.getElementById('timetable-body');
    if (!timetableBody) return;

    // 9 Schulstunden pro Tag
    const stundenAnzahl = 9;
    const wochentage = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];
    
    // Daten aus dem Speicher holen oder leeres Objekt erstellen
    let savedData = localStorage.getItem('little_uncle_stundenplan');
    let stundenplanDaten = savedData ? JSON.parse(savedData) : {};

    timetableBody.innerHTML = '';

    // Generiere Zeile für Zeile (Stunde 1 bis 9)
    for (let stunde = 1; stunde <= stundenAnzahl; stunde++) {
        const row = document.createElement('tr');
        
        wochentage.forEach((tag, tagIndex) => {
            const cell = document.createElement('td');
            const cellId = `${tag}-${stunde}`;
            const daten = stundenplanDaten[cellId] || { fach: '', lehrer: '', raum: '' };

            // Klasse für das CSS-Styling und die Spaltenzuordnung (1-5)
            cell.className = `timetable-cell col-${tagIndex + 1}`;

            // Input-Felder für Fach, Lehrer und Raum
            cell.innerHTML = `
                <div class="cell-hour">${stunde}. Std.</div>
                <input type="text" class="cell-subject" placeholder="Fach" value="${daten.fach}" data-id="${cellId}" data-field="fach">
                <input type="text" class="cell-info" placeholder="Lehrer" value="${daten.lehrer}" data-id="${cellId}" data-field="lehrer">
                <input type="text" class="cell-info" placeholder="Raum" value="${daten.raum}" data-id="${cellId}" data-field="raum">
            `;
            row.appendChild(cell);
        });
        
        timetableBody.appendChild(row);
    }

    // Event-Listener: Erkennt Änderungen sofort beim Tippen und merkt sie sich im Objekt
    timetableBody.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (e) => {
            const id = e.target.getAttribute('data-id');
            const field = e.target.getAttribute('data-field');
            if (!stundenplanDaten[id]) stundenplanDaten[id] = { fach: '', lehrer: '', raum: '' };
            stundenplanDaten[id][field] = e.target.value;
        });
    });

    // Speicher-Button Logik registrieren
    window.saveTimetable = () => {
        localStorage.setItem('little_uncle_stundenplan', JSON.stringify(stundenplanDaten));
        alert('Stundenplan erfolgreich gespeichert! 💾');
    };

    // Live-Highlight für den heutigen Wochentag aktivieren
    highlightAktuellenTag();

    // Kalender-Bereich initialisieren
    initKalender();
}

function highlightAktuellenTag() {
    const heute = new Date();
    let aktuellerTagIndex = heute.getDay(); // 0 = So, 1 = Mo, 2 = Di, ..., 6 = Sa

    // Alle vorherigen Highlights sicherheitshalber entfernen
    document.querySelectorAll('.timetable th, .timetable td').forEach(el => {
        el.classList.remove('today-glow');
    });

    // Wenn heute ein Schultag ist (Mo-Fr -> 1-5)
    if (aktuellerTagIndex >= 1 && aktuellerTagIndex <= 5) {
        // Kopfzeile (Mo, Di, Mi...) zum Leuchten bringen
        const headerCell = document.getElementById(`day-${aktuellerTagIndex}`);
        if (headerCell) headerCell.classList.add('today-glow');

        // Die komplette Spalte der td-Zellen zum Leuchten bringen
        document.querySelectorAll(`.col-${aktuellerTagIndex}`).forEach(cell => {
            cell.classList.add('today-glow');
        });
    }
}

// ==========================================
// KALEBDER-STEUERUNG (Bleibt voll integriert)
// ==========================================
let currentYear = 2026;
let currentMonth = 5; // Juni (0-indiziert, also 5 = Juni)
let isCompactView = true;

function initKalender() {
    const titleEl = document.getElementById('calendar-title');
    if (titleEl) {
        renderKompaktKalender();
    }
}

function renderKompaktKalender() {
    const grid = document.getElementById('calendar-grid');
    const nav = document.getElementById('calendar-nav');
    const viewBtn = document.getElementById('btn-calendar-view');
    const title = document.getElementById('calendar-title');
    
    if (!grid) return;
    
    grid.className = "calendar-grid compact";
    if (nav) nav.style.display = 'none';
    if (viewBtn) viewBtn.innerText = "📅 Ganzer Monat";
    if (title) title.innerText = "📅 Heute (Kompaktmodus)";

    grid.innerHTML = '';
    
    // Speziell für heute: Dienstag, 30. Juni 2026
    const heuteCard = document.createElement('div');
    heuteCard.className = 'calendar-day today';
    heuteCard.style.border = '2px solid #7c3aed';
    heuteCard.style.boxShadow = '0 0 15px rgba(124, 58, 237, 0.4)';
    heuteCard.innerHTML = `<strong>30</strong><div style="font-size:11px; color:#a78bfa;">Juni</div>`;
    
    heuteCard.onclick = () => selectDate(2026, 5, 30);
    grid.appendChild(heuteCard);
    
    selectDate(2026, 5, 30);
}

function renderVollKalender() {
    const grid = document.getElementById('calendar-grid');
    const nav = document.getElementById('calendar-nav');
    const viewBtn = document.getElementById('btn-calendar-view');
    const title = document.getElementById('calendar-title');
    const monthYearLabel = document.getElementById('current-month-year');

    if (!grid) return;

    grid.className = "calendar-grid full";
    if (nav) nav.style.display = 'flex';
    if (viewBtn) viewBtn.innerText = "📱 Kompaktmodus";
    if (title) title.innerText = "📅 Monatsübersicht";

    const monatsNamen = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    if (monthYearLabel) monthYearLabel.innerText = `${monatsNamen[currentMonth]} ${currentYear}`;

    grid.innerHTML = '';

    const ersterTag = new Date(currentYear, currentMonth, 1).getDay();
    const tageImMonat = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Wochentag-Korrektur für Montag als Wochenstart
    let startVersatz = ersterTag === 0 ? 6 : ersterTag - 1;

    // Leere Felder vor dem ersten Tag des Monats auffüllen
    for (let i = 0; i < startVersatz; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        grid.appendChild(emptyCell);
    }

    // Tage des Monats rendern
    for (let tag = 1; tag <= tageImMonat; tag++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.innerText = tag;

        // Abgleich ob es sich um den heutigen Tag handelt (30.06.2026)
        if (currentYear === 2026 && currentMonth === 5 && tag === 30) {
            dayCell.classList.add('today');
        }

        dayCell.onclick = () => selectDate(currentYear, currentMonth, tag);
        grid.appendChild(dayCell);
    }
}

window.toggleCalendarView = () => {
    isCompactView = !isCompactView;
    if (isCompactView) {
        renderKompaktKalender();
    } else {
        renderVollKalender();
    }
};

window.changeMonth = (richtung) => {
    currentMonth += richtung;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderVollKalender();
};

function selectDate(jahr, monat, tag) {
    const dateTitle = document.getElementById('selected-date-title');
    const input = document.getElementById('calendar-event-input');
    
    const formatierterMonat = String(monat + 1).padStart(2, '0');
    const formatierterTag = String(tag).padStart(2, '0');
    const datumsSchluessel = `${jahr}-${formatierterMonat}-${formatierterTag}`;
    
    if (dateTitle) dateTitle.innerText = `Eintrag für den ${formatierterTag}.${formatierterMonat}.${jahr}:`;
    if (input) {
        input.setAttribute('data-current-date', datumsSchluessel);
        const gespeicherterEintrag = localStorage.getItem(`note_${datumsSchluessel}`) || '';
        input.value = gespeicherterEintrag;
    }
}

window.saveCalendarEvent = () => {
    const input = document.getElementById('calendar-event-input');
    if (!input) return;

    const datumsSchluessel = input.getAttribute('data-current-date');
    if (datumsSchluessel) {
        localStorage.setItem(`note_${datumsSchluessel}`, input.value);
        alert('Termin/Notiz erfolgreich gesichert! 📌');
    }
};
