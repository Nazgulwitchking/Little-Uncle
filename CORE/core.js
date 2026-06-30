// ==========================================
// PWA WEICHEN-STEUERUNG & INITIALISIERUNG
// ==========================================
let deferredPrompt; // Nur einmal ganz oben deklarieren!

// Korrigierte Infotexte für die Apps (IDs exakt an HTML-Struktur angepasst)
// Korrigierte Infotexte für die Apps (IDs exakt an HTML-Struktur angepasst)
const infoTexts = {
    "klassen-page": "Dieser Rechner ermöglicht es dir, mit Hilfe von komplexen mathematischen Systemen, eine ungefähre Wahrscheinlichkeit für das Zusammenkommen mit einer anderen Person in der 11. Klasse. Das Ergebnis wird genauer wenn ebenfalls die Wunschpartner der Zielperson angegeben werden.",
    
    // Jetzt korrekt: rechner-page zeigt nun den Text für den Wahrscheinlichkeitsrechner
    "rechner-page": "Dieser Rechner ermöglicht es dir, mit Hilfe von komplexen mathematischen Systemen, eine ungefähre Wahrscheinlichkeit für das Zusammenkommen mit einer anderen Person in der 11. Klasse. Das Ergebnis wird genauer wenn ebenfalls die Wunschpartner der Zielperson angegeben werden.",
    
    "match-page": "Mit dem „Matchpartner-Finder“ kannst du direkt zwei verschiedene Personen miteinander vergleichen, um mathematisch zu sehen, mit wem deine Chancen auf eine gemeinsame Klasse höher stehen.",
    
    "noten-page": "Hier kannst du deine Noten für die hessische Mittelstufe (1-6) oder Oberstufe (0-15 Punkte) verwalten. Nutze den Rechner für aktuelle Stände oder den Planer für Wunschnoten."
};
let aktuelleGeoeffneteApp = "";

// DAS ÜBERSETZUNGS-WÖRTERBUCH
const translations = {
    de: {
        "landing-title": "Willkommen bei Little Uncle",
        "dash-tile1-title": "Klassen-Verteilung & Matcher",
        "dash-tile1-desc": "Berechne deine Chancen und finde deinen optimalen Matchpartner aus der Stufe.",
        "dash-tile2-title": "Hessischer Noten-Rechner",
        "dash-tile2-desc": "Verwalte deine Fächer, berechne exakte Zeugnisnoten und plane Wunschergebnisse."
    },
    en: {
        "landing-title": "Welcome to Little Uncle",
        "dash-tile1-title": "Class Distribution & Matcher",
        "dash-tile1-desc": "Calculate your chances and find your perfect match in your grade.",
        "dash-tile2-title": "Hessian Grade Calculator",
        "dash-tile2-desc": "Manage your subjects, calculate exact report card grades, and plan target results."
    },
    zh: {
        "landing-title": "欢迎来到 Little Uncle",
        "dash-tile1-title": "班级分配与匹配器",
        "dash-tile1-desc": "计算 your 概率并从年级中找到最佳匹配伙伴。",
        "dash-tile2-title": "黑森州成绩计算器",
        "dash-tile2-desc": "管理你的科目，计算精确的成绩单分数并规划目标结果。"
    }
};

function applyLanguage(lang) {
    const langData = translations[lang];
    if (!langData) return;

    for (const [id, text] of Object.entries(langData)) {
        const element = document.getElementById(id);
        if (element) {
            element.innerText = text;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('installBtn');
    const iosHint = document.getElementById('ios-hint');
    const landing = document.getElementById('landing-page');
    const dash = document.getElementById('dashboard-page');

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone;

    if (isStandalone) {
        if (landing) {
            landing.style.display = 'none';
            landing.classList.remove('active');
        }
        if (dash) {
            dash.style.display = 'block';
            dash.classList.add('active');
        }
    } else {
        if (landing) {
            landing.style.display = 'block';
            landing.classList.add('active');
        }
        if (dash) {
            dash.style.display = 'none';
            dash.classList.remove('active');
        }
        if (isIos) {
            if (iosHint) iosHint.style.display = 'block';
            if (installBtn) installBtn.style.display = 'none';
        }
    }

    if (typeof setStufe === 'function') {
        setStufe('mittel');
    }

    const setupInstallBtn = document.getElementById('installBtn');
    if (setupInstallBtn) {
        setupInstallBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Installation: ${outcome}`);
                deferredPrompt = null;
                setupInstallBtn.style.display = 'none';
            } else {
                switchToRealAppMode();
            }
        });
    }

    const savedLang = localStorage.getItem('littleUncle_lang') || 'de';
    const savedRegion = localStorage.getItem('littleUncle_region');
    
    if (document.getElementById('settings-lang')) {
        document.getElementById('settings-lang').value = savedLang;
    }
    if (savedRegion && document.getElementById('settings-region')) {
        document.getElementById('settings-region').value = savedRegion;
    }
    
    applyLanguage(savedLang);
});

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'block';
    }
});

function switchToRealAppMode() {
    const landing = document.getElementById('landing-page');
    if (landing) {
        landing.style.display = 'none';
        landing.classList.remove('active');
    }
    const dash = document.getElementById('dashboard-page');
    if (dash) {
        dash.style.display = 'block';
        dash.classList.add('active');
    }
}

// ==========================================
// INFO-DRAWER STEUERUNG
// ==========================================
function toggleInfo(show) {
    const drawer = document.getElementById('info-drawer');
    const textEl = document.getElementById('info-drawer-text');
    if (!drawer || !textEl) return;

    if (show === false || (show === undefined && drawer.style.left === '0px')) {
        drawer.style.left = '-300px';
    } else {
        textEl.innerText = infoTexts[aktuelleGeoeffneteApp] || "Keine zusätzlichen Informationen für diese Ansicht verfügbar.";
        drawer.style.left = '0px';
    }
}

// ==========================================
// EINSTELLUNGEN-STEUERUNG (ZAHNRAD)
// ==========================================
function toggleSettings(show) {
    const overlay = document.getElementById('settings-overlay');
    if (!overlay) return;

    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
        const langVal = document.getElementById('settings-lang').value;
        const regionVal = document.getElementById('settings-region').value;
        
        localStorage.setItem('littleUncle_lang', langVal);
        localStorage.setItem('littleUncle_region', regionVal);
        applyLanguage(langVal);
    }
}

// ==========================================
// NAVIGATIONSSYSTEM (PERFEKTE HEADER LOGIK)
// ==========================================
function openApp(appId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    
    const target = document.getElementById(appId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }

    if (appId === 'klassen-page') {
        aktuelleGeoeffneteApp = 'rechner-page'; 
    } else {
        aktuelleGeoeffneteApp = appId;
    }
    
    // Info-Button wird auf der Unterseite mathematisch exakt eingeblendet
    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) infoBtn.style.visibility = 'visible';
}

function goBackToDashboard() {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    
    const dash = document.getElementById('dashboard-page');
    if (dash) {
        dash.classList.add('active');
        dash.style.display = 'block';
    }

    aktuelleGeoeffneteApp = "";
    
    // Info-Button wird auf dem Dashboard versteckt (Platzhalter bleibt symmetrisch aktiv)
    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) infoBtn.style.visibility = 'hidden';
    
    toggleInfo(false);
}

function switchSubTab(subPageId) {
    document.querySelectorAll('.sub-tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    
    const target = document.getElementById(subPageId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }
    
    aktuelleGeoeffneteApp = subPageId;

    const btnRechner = document.getElementById('btn-sub-rechner');
    const btnMatch = document.getElementById('btn-sub-match');
    
    if (btnRechner) btnRechner.classList.toggle('active', subPageId === 'rechner-page');
    if (btnMatch) btnMatch.classList.toggle('active', subPageId === 'match-page');
}

// ==========================================
// KLASSEN-ALGORITHMUS
// ==========================================
function berechneKernWahrscheinlichkeit(meinGeschlecht, meineKlasse, meineWuensche, zielGeschlecht, zielKlasse, zielClique) {
    let chance = 0.20;
    let anzahlAlteKlasse = 0;
    let anzahlMaenner = 0;
    let anzahlFrauen = 0;

    let meineGruppeNurMaenner = (meinGeschlecht === 'M');
    let meineGruppeNurFrauen = (meinGeschlecht === 'F');
    let zielGruppeNurMaenner = (zielGeschlecht === 'M');
    let zielGruppeNurFrauen = (zielGeschlecht === 'F');

    let klassenSet = new Set();
    klassenSet.add(meineKlasse);

    if (meinGeschlecht === 'M') anzahlMaenner++; else anzahlFrauen++;
    anzahlAlteKlasse++; 

    meineWuensche.forEach(w => {
        if (w.G === 'M') { anzahlMaenner++; meineGruppeNurFrauen = false; }
        else if (w.G === 'F') { anzahlFrauen++; meineGruppeNurMaenner = false; }
        if (w.klasse !== "unbekannt") klassenSet.add(w.klasse);
        if (w.klasse === meineKlasse) anzahlAlteKlasse++;
    });

    if (zielGeschlecht === 'M') anzahlMaenner++; else anzahlFrauen++;
    klassenSet.add(zielKlasse);
    if (zielKlasse === meineKlasse) anzahlAlteKlasse++;

    zielClique.forEach(c => {
        if (c.G === 'M') { anzahlMaenner++; zielGruppeNurFrauen = false; }
        else if (c.G === 'F') { anzahlFrauen++; zielGruppeNurMaenner = false; }
        if (c.klasse !== "unbekannt") klassenSet.add(c.klasse);
        if (zielKlasse === meineKlasse && c.klasse === meineKlasse) anzahlAlteKlasse++;
    });

    let anzahlBeteiligtePersonen = 1 + meineWuensche.length + 1 + zielClique.length;
    let einzigartigeKlassenZahl = klassenSet.size;

    if (einzigartigeKlassenZahl >= 3) chance *= 1.55; 
    else if (einzigartigeKlassenZahl === 1 && anzahlBeteiligtePersonen > 1) chance *= 0.70; 

    if (meinGeschlecht !== zielGeschlecht) chance *= 1.35; else chance *= 0.85;

    if (anzahlAlteKlasse > 1) chance *= Math.pow(0.85, anzahlAlteKlasse - 1);

    let gesamtPersonen = anzahlMaenner + anzahlFrauen;
    if (anzahlMaenner / gesamtPersonen > 0.7) chance *= 0.65;

    if ((meineGruppeNurMaenner && zielGruppeNurFrauen) || (meineGruppeNurFrauen && zielGruppeNurMaenner)) {
        chance *= 1.60;
    }

    if (anzahlAlteKlasse > 10) return -1; 

    let endChance = chance * 0.98;
    if (endChance > 0.98) endChance = 0.98;
    if (endChance < 0.01) endChance = 0.01;

    return endChance;
}

function berechneRechner() {
    const meinGeschlecht = document.getElementById("meinGeschlecht").value;
    const meineKlasse = document.getElementById("meineKlasse").value;
    const zielGeschlecht = document.getElementById("zielGeschlecht").value;
    const zielKlasse = document.getElementById("zielKlasse").value;

    const meineWuensche = [];
    const w1_G = document.getElementById("wunsch1_G").value;
    if (w1_G) meineWuensche.push({ G: w1_G, klasse: document.getElementById("wunsch1_klasse").value });
    const w2_G = document.getElementById("wunsch2_G").value;
    if (w2_G) meineWuensche.push({ G: w2_G, klasse: document.getElementById("wunsch2_klasse").value });

    const zielClique = [];
    const c1_G = document.getElementById("clique1_G").value;
    if (c1_G) zielClique.push({ G: c1_G, klasse: document.getElementById("clique1_klasse").value });
    const c2_G = document.getElementById("clique2_G").value;
    if (c2_G) zielClique.push({ G: c2_G, klasse: document.getElementById("clique2_klasse").value });

    const ergebnis = berechneKernWahrscheinlichkeit(meinGeschlecht, meineKlasse, meineWuensche, zielGeschlecht, zielKlasse, zielClique);

    const resBox = document.getElementById("rechner-result-box");
    const resVal = document.getElementById("rechner-result-value");
    const resTxt = document.getElementById("rechner-result-text");
    const simBox = document.getElementById("rechner-simulator-box");

    if (ergebnis < 0) {
        resTxt.innerText = "Hinweis:";
        resVal.innerText = "0.00% (Über 10 Personen aus alter Klasse!)";
        resVal.style.color = "#dc2626";
        simBox.style.display = "none";
    } else {
        resTxt.innerText = "Die Wahrscheinlichkeit beträgt:";
        resVal.innerText = (ergebnis * 100).toFixed(2) + "%";
        resVal.style.color = "var(--cyber-cyan)";

        let anzahlAlte = 1;
        meineWuensche.forEach(w => { if(w.klasse === meineKlasse) anzahlAlte++; });
        if(zielKlasse === meineKlasse) anzahlAlte++;
        zielClique.forEach(c => { if(zielKlasse === meineKlasse && c.klasse === meineKlasse) anzahlAlte++; });

        const neueKlassen = ["11A", "11B", "11C", "11D", "11E"];
        document.getElementById("rechner-simulator-content").innerHTML = 
            `Du wirst voraussichtlich in die neue Klasse <span style="color:var(--space-purple-glow); font-weight:700;">${neueKlassen[Math.floor(Math.random()*5)]}</span> kommen.<br>` +
            `Dort werden exakt <strong>14 Jungs</strong> and <strong>14 Mädchen</strong> sein.<br>` +
            `Von deiner alten Klasse (<strong>${meineKlasse.toUpperCase()}</strong>) kommen genau <strong>${anzahlAlte} Personen</strong> mit dir.`;
        simBox.style.display = "block";
    }
    resBox.style.display = "block";
}

function berechneMatchpartner() {
    const meinG = document.getElementById("matchMeinG").value;
    const meineKlasse = document.getElementById("matchMeineKlasse").value;

    const persA_G = document.getElementById("persA_G").value;
    const persA_klasse = document.getElementById("persA_klasse").value;
    const cliqueA = [];
    const cA_G = document.getElementById("persAClique_G").value;
    if (cA_G) cliqueA.push({ G: cA_G, klasse: document.getElementById("persAClique_klasse").value });

    const persB_G = document.getElementById("persB_G").value;
    const persB_klasse = document.getElementById("persB_klasse").value;
    const cliqueB = [];
    const cB_G = document.getElementById("persBClique_G").value;
    if (cB_G) cliqueB.push({ G: cB_G, klasse: document.getElementById("persBClique_klasse").value });

    let ergA = berechneKernWahrscheinlichkeit(meinG, meineKlasse, [], persA_G, persA_klasse, cliqueA);
    let ergB = berechneKernWahrscheinlichkeit(meinG, meineKlasse, [], persB_G, persB_klasse, cliqueB);

    const matchBox = document.getElementById("match-result-box");
    const matchContent = document.getElementById("match-result-content");

    let textA = ergA < 0 ? "Regelverstoß (0.00%)" : (ergA * 100).toFixed(2) + "%";
    let textB = ergB < 0 ? "Regelverstoß (0.00%)" : (ergB * 100).toFixed(2) + "%";

    let gewinner = "Gleichstand oder unmöglich";
    if (ergA > ergB) gewinner = "👑 Vergleichsperson A ist der bessere Matchpartner!";
    else if (ergB > ergA) gewinner = "👑 Vergleichsperson B ist der bessere Matchpartner!";

    matchContent.innerHTML = 
        `Chance mit <strong>Vergleichsperson A:</strong> <span style="color:var(--space-purple-glow); font-weight:700;">${textA}</span><br>` +
        `Chance mit <strong>Vergleichsperson B:</strong> <span style="color:var(--cyber-cyan); font-weight:700;">${textB}</span><br><br>` +
        `<span style="font-size:16px; font-weight:800; color:var(--text-pure); display:block; text-align:center;">${gewinner}</span>`;

    matchBox.style.display = "block";
}

// ==========================================
// HESSISCHER NOTEN- & WUNSCHPLANER-CODE
// ==========================================
let aktuelleStufe = "mittel"; 
let aktuellerModus = "rechner"; 

const notenListe = [
    { text: "Bitte wählen...", val: "" }, { text: "1", val: 1.0 }, { text: "1-", val: 1.33 },
    { text: "2+", val: 1.67 }, { text: "2", val: 2.0 }, { text: "2-", val: 2.33 },
    { text: "3+", val: 2.67 }, { text: "3", val: 3.0 }, { text: "3-", val: 3.33 },
    { text: "4+", val: 3.67 }, { text: "4", val: 4.0 }, { text: "4-", val: 4.33 },
    { text: "5+", val: 4.67 }, { text: "5", val: 5.0 }, { text: "5-", val: 5.33 }, { text: "6", val: 6.0 }
];

const punkteListe = [
    { text: "Bitte wählen...", val: "" },
    { text: "15 Punkte (1+)", val: 0.67 }, { text: "14 Punkte (1)", val: 1.0 }, { text: "13 Punkte (1-)", val: 1.33 },
    { text: "12 Punkte (2+)", val: 1.67 }, { text: "11 Punkte (2)", val: 2.0 }, { text: "10 Punkte (2-)", val: 2.33 },
    { text: "09 Punkte (3+)", val: 2.67 }, { text: "08 Punkte (3)", val: 3.0 }, { text: "07 Punkte (3-)", val: 3.33 },
    { text: "06 Punkte (4+)", val: 3.67 }, { text: "05 Punkte (4)", val: 4.0 }, { text: "04 Punkte (4-)", val: 4.33 },
    { text: "03 Punkte (5+)", val: 4.67 }, { text: "02 Punkte (5)", val: 5.0 }, { text: "01 Punkt (5-)", val: 5.33 }, { text: "00 Punkte (6)", val: 6.0 }
];

function setStufe(stufe) {
    aktuelleStufe = stufe;
    const bm = document.getElementById("btn-mittel");
    const bo = document.getElementById("btn-ober");
    if(bm) bm.classList.toggle("active", stufe === "mittel");
    if(bo) bo.classList.toggle("active", stufe === "ober");
    
    const fc = document.getElementById("feedbackCard");
    if(fc) fc.style.display = "none";
    
    const fachTyp = document.getElementById("fachTyp");
    if(!fachTyp) return;
    fachTyp.innerHTML = "";

    if (stufe === "mittel") {
        fachTyp.options.add(new Option("Hauptfach (50% Mündlich / 2x 25% Arbeiten)", "haupt"));
        fachTyp.options.add(new Option("Nebenfach (66.67% Mündlich / 1x 33.33% Arbeit)", "neben"));
        befuelleDropdowns(notenListe);
    } else {
        fachTyp.options.add(new Option("Leistungskurs / Hauptfach (50% Mündlich / 2x 25% Klausuren)", "haupt"));
        fachTyp.options.add(new Option("Grundkurs / Nebenfach (66.67% Mündlich / 1x 33.33% Klausur)", "neben"));
        befuelleDropdowns(punkteListe);
    }
    
    const wunschSelect = document.getElementById("wunschNote");
    if(wunschSelect) {
        wunschSelect.innerHTML = "";
        const aktuelleWunschListe = (stufe === "mittel") ? notenListe : punkteListe;
        aktuelleWunschListe.forEach(item => { wunschSelect.options.add(new Option(item.text, item.val)); });
    }
    setModus(aktuellerModus);
}

function setModus(modus) {
    aktuellerModus = modus;
    const br = document.getElementById("btn-rechner");
    const bp = document.getElementById("btn-planer");
    if(br) br.classList.toggle("active", modus === "rechner");
    if(bp) bp.classList.toggle("active", modus === "planer");
    
    const fc = document.getElementById("feedbackCard");
    if(fc) fc.style.display = "none";

    const isPlaner = (modus === "planer");
    const wg = document.getElementById("wunsch-group");
    const vg = document.getElementById("vorher-group");
    if(wg) wg.style.display = isPlaner ? "block" : "none";
    if(vg) vg.style.display = isPlaner ? "none" : "block";
    
    const mt = document.getElementById("noten-main-title");
    const ms = document.getElementById("noten-main-sub");
    const cb = document.getElementById("calcBtn");
    if(mt) mt.innerText = isPlaner ? "Der Wunschnoten-Planer" : "Der Noten-Rechner";
    if(ms) ms.innerText = isPlaner ? "Welche Noten brauchst du noch?" : "Berechne deine exakte hessische Zeugnisnote.";
    if(cb) cb.innerText = isPlaner ? "Kombinationen berechnen" : "Note berechnen";

    anpassenFachfelder();
}

function befuelleDropdowns(liste) {
    ["noteMuendlich", "noteArbeit1", "noteArbeit2", "vorherigeNote"].forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.innerHTML = "";
            liste.forEach(item => { el.options.add(new Option(item.text, item.val)); });
        }
    });
}

function anpassenFachfelder() {
    const ftEl = document.getElementById("fachTyp");
    if(!ftEl) return;
    const fachTyp = ftEl.value;
    const arbeit2Group = document.getElementById("arbeit2-group");
    const arbeit1Label = document.getElementById("arbeit1-label");
    const isPlaner = (aktuellerModus === "planer");

    if (fachTyp === "neben") {
        if(arbeit2Group) arbeit2Group.style.display = "none";
        if(arbeit1Label) arbeit1Label.innerText = isPlaner ? "Klassenarbeit (Optional):" : "Klassenarbeit:";
    } else {
        if(arbeit2Group) arbeit2Group.style.display = "block";
        if(arbeit1Label) arbeit1Label.innerText = isPlaner ? "1. Arbeit (Optional):" : "1. Klassenarbeit:";
    }
}

function dezimalZuPunkten(dezimal) {
    let besteDistanz = 999, bestePunkte = 0;
    let karten = [{p:15,v:0.67},{p:14,v:1.0},{p:13,v:1.33},{p:12,v:1.67},{p:11,v:2.0},{p:10,v:2.33},{p:9,v:2.67},{p:8,v:3.0},{p:7,v:3.33},{p:6,v:3.67},{p:5,v:4.0},{p:4,v:4.33},{p:3,v:4.67},{p:2,v:5.0},{p:1,v:5.33},{p:0,v:6.0}];
    karten.forEach(k => {
        let dist = Math.abs(k.v - dezimal);
        if(dist < besteDistanz) { besteDistanz = dist; bestePunkte = k.p; }
    });
    return bestePunkte;
}

function fuehreBerechnungAus() {
    if (aktuellerModus === "rechner") berechneZeugnisnote();
    else berechneWunschKombinationen();
}

// ==========================================
// NOTEN-BERECHNUNG
// ==========================================
function berechneZeugnisnote() {
    const fachTyp = document.getElementById("fachTyp").value;
    const muendlich = document.getElementById("noteMuendlich").value;
    const arbeit1 = document.getElementById("noteArbeit1").value;
    const vorherigeRaw = document.getElementById("vorherigeNote").value;

    if (muendlich === "" || arbeit1 === "") { alert("Bitte wähle mindestens mündlich und die erste Arbeit."); return; }
    const mVal = parseFloat(muendlich); const a1Val = parseFloat(arbeit1); let schnitt = 0;

    if (fachTyp === "haupt") {
        const arbeit2 = document.getElementById("noteArbeit2").value;
        if (arbeit2 === "") { alert("Bitte wähle auch die 2. Arbeit aus."); return; }
        schnitt = (mVal * 0.5) + (((a1Val + parseFloat(arbeit2)) / 2) * 0.5);
    } else {
        schnitt = (mVal * (2/3)) + (a1Val * (1/3));
    }

    let endanzeige = "";
    let hinweis = `Schnitt liegt bei <strong>${schnitt.toFixed(2)}</strong>.`;
    let farbKategorie = 3; 

    if (aktuelleStufe === "mittel") {
        let endnote = Math.round(schnitt);
        const nachkomma = schnitt - Math.floor(schnitt);
        if (Math.abs(nachkomma - 0.5) < 0.03 && vorherigeRaw !== "") {
            const vVal = parseFloat(vorherigeRaw);
            if (Math.ceil(schnitt) > Math.round(vVal)) { endnote = Math.ceil(schnitt); hinweis = `Trend nach unten. Lehrer tendiert meist zu Note <strong>${endnote}</strong>.`; }
            else { endnote = Math.floor(schnitt); hinweis = `Trend nach oben! Wahrscheinlich kriegst du Note <strong>${endnote}</strong>.`; }
        }
        endanzeige = "Note " + endnote; farbKategorie = endnote;
    } else {
        let punkte = dezimalZuPunkten(schnitt); endanzeige = punkte + " Punkte";
        if (punkte >= 10) farbKategorie = 1; else if (punkte >= 5) farbKategorie = 3; else farbKategorie = 5;
    }

    styleFeedbackCard(farbKategorie);
    document.getElementById("res-card-title").innerText = "Errechnetes Zeugnis-Ergebnis";
    document.getElementById("gradeOutput").innerText = endanzeige;
    document.getElementById("descOutput").innerHTML = hinweis;
    document.getElementById("empfehlungOutput").style.display = "none";
    document.getElementById("feedbackCard").style.display = "block";
}

function berechneWunschKombinationen() {
    const wunsch = document.getElementById("wunschNote").value;
    if(wunsch === "") { alert("Bitte wähle eine Wunschnote aus!"); return; }
    const zielDezimal = parseFloat(wunsch);
    const wunschText = document.getElementById("wunschNote").options[document.getElementById("wunschNote").selectedIndex].text;
    const fachTyp = document.getElementById("fachTyp").value;
    const mSel = document.getElementById("noteMuendlich").value;
    const a1Sel = document.getElementById("noteArbeit1").value;
    const a2Sel = document.getElementById("noteArbeit2").value;

    const pool = (aktuelleStufe === "mittel") ? notenListe : punkteListe;
    const optionen = pool.filter(o => o.val !== "");
    let guetigeKombis = [];

    optionen.forEach(oM => {
        if(mSel !== "" && Math.abs(parseFloat(mSel) - oM.val) > 0.01) return;
        optionen.forEach(oA1 => {
            if(a1Sel !== "" && Math.abs(parseFloat(a1Sel) - oA1.val) > 0.01) return;
            if(fachTyp === "haupt") {
                optionen.forEach(oA2 => {
                    if(a2Sel !== "" && Math.abs(parseFloat(a2Sel) - oA2.val) > 0.01) return;
                    let schnitt = (oM.val * 0.5) + (((oA1.val + oA2.val) / 2) * 0.5);
                    if(Math.abs(schnitt - zielDezimal) < 0.025) guetigeKombis.push({ m: oM.text, a1: oA1.text, a2: oA2.text });
                });
            } else {
                let schnitt = (oM.val * (2/3)) + (oA1.val * (1/3));
                if(Math.abs(schnitt - zielDezimal) < 0.025) guetigeKombis.push({ m: oM.text, a1: oA1.text });
            }
        });
    });

    const card = document.getElementById("feedbackCard");
    const gradeOut = document.getElementById("gradeOutput");
    const descOut = document.getElementById("descOutput");

    document.getElementById("res-card-title").innerText = "Mögliche Noten-Wege";
    gradeOut.innerText = "Ziel: " + wunschText;

    if(guetigeKombis.length === 0) {
        descOut.innerHTML = "❌ Dieses exakte Ziel ist mathematisch leider nicht mehr erreichbar.";
        styleFeedbackCard(5);
    } else {
        styleFeedbackCard(2);
        let html = "<ul>";
        guetigeKombis.slice(0, 5).forEach(k => {
            html += fachTyp === "haupt" ? `<li>Mündlich: <strong>${k.m}</strong> | 1.Arbeit: <strong>${k.a1}</strong> | 2.Arbeit: <strong>${k.a2}</strong></li>` : `<li>Mündlich: <strong>${k.m}</strong> | Arbeit: <strong>${k.a1}</strong></li>`;
        });
        html += "</ul>"; descOut.innerHTML = html;
    }
    card.style.display = "block";
}

function styleFeedbackCard(kat) {
    if (kat <= 2) {
        document.documentElement.style.setProperty('--status-bg', 'rgba(16, 185, 129, 0.08)');
        document.documentElement.style.setProperty('--status-border', 'rgba(16, 185, 129, 0.3)');
        document.documentElement.style.setProperty('--status-text', '#34d399');
        document.getElementById("gradeOutput").style.color = "#34d399";
    } else if (kat === 3 || kat === 4) {
        document.documentElement.style.setProperty('--status-bg', 'rgba(99, 102, 241, 0.08)');
        document.documentElement.style.setProperty('--status-border', 'rgba(99, 102, 241, 0.3)');
        document.documentElement.style.setProperty('--status-text', '#a5b4fc');
        document.getElementById("gradeOutput").style.color = "var(--cyber-cyan)";
    } else {
        document.documentElement.style.setProperty('--status-bg', 'rgba(239, 68, 68, 0.08)');
        document.documentElement.style.setProperty('--status-border', 'rgba(239, 68, 68, 0.3)');
        document.documentElement.style.setProperty('--status-text', '#f87171');
        document.getElementById("gradeOutput").style.color = "#f87171";
    }
}

// ==========================================
// AUTOMATISCHES HINTERGRUND-UPDATE-SYSTEM
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('Service Worker erfolgreich registriert.');
                registration.update();

                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    if (installingWorker == null) return;

                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                console.log('Neuer Code erkannt! Automatischer Reload wird ausgeführt...');
                                alert('App hat ein Update gefunden und lädt jetzt neu!'); 
                                window.location.reload(true);
                            }                                
                        }
                    };
                };
            })
            .catch((error) => {
                console.error('Fehler beim Service Worker Update-Check:', error);
            });
    });

    let isRefreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!isRefreshing) {
            isRefreshing = true;
            window.location.reload(true);
        }
    });
}

// ==========================================
// MANUELLES UPDATE-TRIGGERSYSTEM
// ==========================================
function checkForUpdatesManual() {
    const popup = document.getElementById('manual-update-popup');
    const text = document.getElementById('update-modal-text');
    const btn = document.getElementById('update-modal-btn');

    if (!popup || !text || !btn) {
        alert("Update-Popup im HTML nicht gefunden!");
        return;
    }

    popup.style.display = 'flex';
    text.innerText = 'Suche nach Updates gestartet...';
    btn.style.display = 'none';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.update().then(() => {
                setTimeout(() => {
                    const updateVerfuegbar = registration.waiting || registration.installing;
                    btn.style.display = 'block';

                    if (updateVerfuegbar) {
                        text.innerText = 'Update gefunden, Neustart erforderlich';
                        btn.onclick = function() {
                            if (registration.waiting) {
                                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                            }
                            window.location.reload(true);
                        };
                    } else {
                        text.innerText = 'Keine Updates gefunden';
                        btn.onclick = function() {
                            popup.style.display = 'none';
                        };
                    }
                }, 2500);
            }).catch(error => {
                console.error('Fehler beim manuellen Update-Check:', error);
                text.innerText = 'Fehler bei der Update-Suche.';
                btn.style.display = 'block';
                btn.onclick = () => popup.style.display = 'none';
            });
        }).catch(() => {
            text.innerText = 'Der Service Worker ist noch nicht bereit.';
            btn.style.display = 'block';
            btn.onclick = () => popup.style.display = 'none';
        });
    } else {
        text.innerText = 'Updates werden von diesem Browser nicht unterstützt.';
        btn.style.display = 'block';
        btn.onclick = () => popup.style.display = 'none';
    }
}
// ========================================================
// ERWEITERUNGS-SYSTEM (Ganz unten an die core.js anhängen)
// ========================================================
function erweiterungLaden(ordnerName) {
    import(`../Extensions/${ordnerName}/extension.js`)
        .then(modul => {
            modul.starten();
        })
        .catch(fehler => {
            console.log(`Hinweis: Die Erweiterung "${ordnerName}" ist nicht aktiv oder fehlt.`);
        });
}


erweiterungLaden('Extension1');

// Funktionen für das HTML sichtbar machen
window.toggleInfo = toggleInfo;
window.toggleSettings = toggleSettings;
window.switchToRealAppMode = switchToRealAppMode;
window.openApp = openApp;
window.switchSubTab = switchSubTab;
window.berechneRechner = berechneRechner;
window.berechneMatchpartner = berechneMatchpartner;
window.setStufe = setStufe;
window.setModus = setModus;
window.anpassenFachfelder = anpassenFachfelder;
window.fuehreBerechnungAus = fuehreBerechnungAus;
window.checkForUpdatesManual = checkForUpdatesManual;