let isRegisterMode = false;
let currentToken = null;

window.toggleAuthMode = function() {
    isRegisterMode = !isRegisterMode;
    document.getElementById('auth-title').innerText = isRegisterMode ? 'Konto erstellen' : 'Anmelden bei Little Uncle';
    document.getElementById('btn-auth-primary').innerText = isRegisterMode ? 'Registrieren' : 'Einloggen';
    document.getElementById('auth-switch-text').innerText = isRegisterMode ? 'Bereits ein Konto? Hier anmelden' : 'Noch kein Konto? Jetzt registrieren';
};

window.executeAuth = async function() {
    const user = document.getElementById('auth-username').value;
    const pass = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');

    if(!user || !pass) {
        errorEl.innerText = "Bitte fülle alle Felder aus.";
        errorEl.style.display = "block";
        return;
    }

    const endpoint = isRegisterMode ? 'http://localhost:3000/api/register' : 'http://localhost:3000/api/login';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const data = await response.json();

        if (response.ok) {
            currentToken = data.token; // Merken uns den Login-Token
            document.getElementById('auth-overlay').style.display = 'none'; // App freischalten!
            
            // Hier laden wir gleich die Daten des Nutzers aus der Datenbank
            if(data.userdata) {
                applyUserBackendData(data.userdata);
            }
        } else {
            errorEl.innerText = data.error || "Fehler beim Login.";
            errorEl.style.display = "block";
        }
    } catch (err) {
        errorEl.innerText = "Verbindung zum Server fehlgeschlagen.";
        errorEl.style.display = "block";
    }
};

// Diese Funktion gibt die geladenen Daten sicher an deine bestehenden Systeme weiter
function applyUserBackendData(userdata) {
    if(userdata.timetable) {
        localStorage.setItem('littleUncle_timetable', JSON.stringify(userdata.timetable));
        // Falls der Stundenplan offen ist, wird er aktualisiert
        if(typeof initStundenplan === 'function') initStundenplan();
    }
    // Hier können später auch Noten eingetragen werden
}
// ==========================================
// AUTOMATISCHES BACKEND-SYNCHRONISATIONS-SYSTEM
// ==========================================

// Wir merken uns die originale Speicher-Funktion des Browsers
const originalSetItem = localStorage.setItem;

// Wir überschreiben sie mit einer intelligenten Weiche
localStorage.setItem = function(key, value) {
    // 1. Zuerst ganz normal lokal im Browser speichern (damit die App wie gewohnt läuft)
    originalSetItem.apply(this, arguments);

    // 2. WICHTIG: Wenn der User eingeloggt ist, schicken wir JEDE Änderung an den Server
    if (window.currentToken) {
        // Wir holen alle Daten, die aktuell im LocalStorage liegen
        const allUserData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const localKey = localStorage.key(i);
            // Wir filtern nach deinen App-Daten (falls andere Webseiten auch was speichern)
            if (localKey.startsWith('littleUncle_') || localKey.includes('timetable') || localKey.includes('noten')) {
                try {
                    allUserData[localKey] = JSON.parse(localStorage.getItem(localKey));
                } catch(e) {
                    allUserData[localKey] = localStorage.getItem(localKey);
                }
            }
        }

        // Wir senden das gesamte Datenpaket gesammelt an den Server
        fetch('http://localhost:3000/api/save-all-data', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': window.currentToken
            },
            body: JSON.stringify({ userData: allUserData })
        })
        .catch(err => console.error('Automatische Sicherung fehlgeschlagen:', err));
    }
};

// Diese Funktion lädt beim Login ALLE Daten wieder zurück in den Speicher
window.applyAllUserBackendData = function(allUserData) {
    if (!allUserData) return;
    
    // Wir gehen alle gespeicherten Keys durch und klatschen sie in den lokalen Speicher
    Object.keys(allUserData).forEach(key => {
        const val = allUserData[key];
        const stringVal = (typeof val === 'object') ? JSON.stringify(val) : val;
        originalSetItem.call(localStorage, key, stringVal);
    });

    // Seite einmal sanft neu laden, damit alle UI-Komponenten (Stundenplan, Noten) die neuen Daten sehen
    window.location.reload();
};
