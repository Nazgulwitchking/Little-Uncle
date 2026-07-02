let isRegisterMode = false;
// Holt den Token aus dem Speicher, falls er existiert (Automatischer Login beim Start)
let currentToken = localStorage.getItem('authToken') || null;

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

    const endpoint = isRegisterMode ? 'https://little-uncle.onrender.com/api/register' : 'https://little-uncle.onrender.com/api/login';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const data = await response.json();

        if (response.ok) {
            currentToken = data.token; 
            localStorage.setItem('authToken', data.token); // Token im Browser merken!
            document.getElementById('auth-overlay').style.display = 'none'; // Fenster schließt sich!
            
            if(data.userdata) {
                window.applyAllUserBackendData(data.userdata);
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

// Funktion zum Öffnen des Fensters aus dem Zahnrad-Menü
window.openAuthOverlay = function() {
    document.getElementById('auth-overlay').style.display = 'flex';
};

// ==========================================
// AUTOMATISCHES BACKEND-SYNCHRONISATIONS-SYSTEM
// ==========================================

const originalSetItem = localStorage.setItem;

localStorage.setItem = function(key, value) {
    // 1. Immer lokal auf dem Handy speichern
    originalSetItem.apply(this, arguments);

    // 2. Nur an den Server senden, wenn ein Token existiert
    if (currentToken && key !== 'authToken') {
        const allUserData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const localKey = localStorage.key(i);
            if (localKey.startsWith('littleUncle_') || localKey.includes('timetable') || localKey.includes('noten')) {
                try {
                    allUserData[localKey] = JSON.parse(localStorage.getItem(localKey));
                } catch(e) {
                    allUserData[localKey] = localStorage.getItem(localKey);
                }
            }
        }

        // URL korrigiert!
        fetch('https://little-uncle.onrender.com/api/save-all-data', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': currentToken
            },
            body: JSON.stringify({ userData: allUserData })
        })
        .catch(err => console.error('Automatische Sicherung fehlgeschlagen:', err));
    }
};

window.applyAllUserBackendData = function(allUserData) {
    if (!allUserData) return;
    
    Object.keys(allUserData).forEach(key => {
        const val = allUserData[key];
        const stringVal = (typeof val === 'object') ? JSON.stringify(val) : val;
        originalSetItem.call(localStorage, key, stringVal);
    });

    window.location.reload();
};
