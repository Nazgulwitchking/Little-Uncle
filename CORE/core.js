import { initStundenplan } from '../Extensions/Stundenplan/stundenplan.js';

// ==========================================
// PWA WEICHEN-STEUERUNG & INITIALISIERUNG
// ==========================================
let deferredPrompt; 

// Korrigierte Infotexte für die Apps (Eindeutige Texte für jede ID)
const infoTexts = {
    "klassen-page": "Hier findest du die Übersicht der Verteilungs-Werkzeuge. Wähle entweder den Wahrscheinlichkeitsrechner oder den Matchpartner-Finder, um deine Analysen zu starten.",
    "rechner-page": "Dieser Rechner ermöglicht es dir, mit Hilfe von komplexen mathematischen Systemen, eine ungefähre Wahrscheinlichkeit für das Zusammenkommen mit einer anderen Person in der 11. Klasse zu berechnen. Das Ergebnis wird genauer, wenn ebenfalls die Wunschpartner der Zielperson angegeben werden.",
    "match-page": "Mit dem „Matchpartner-Finder“ kannst du direkt zwei verschiedene Personen miteinander vergleichen, um mathematisch zu sehen, mit wem deine Chancen auf eine gemeinsame Klasse höher stehen.",
    "noten-page": "Hier kannst du deine Noten für die hessische Mittelstufe (1-6) oder Oberstufe (0-15 Punkte) verwalten. Nutze den Rechner für aktuelle Stände oder den Planer für Wunschnoten."
};
let aktuelleGeoeffneteApp = "";

// DAS ÜBERSETZUNGS-WÖRTERBUCH (ALLE 20 SPRACHEN VOLLSTÄNDIG AUSGESCHRIEBEN)
const translations = {
    en: {
        "landing-title": "Welcome to Little Uncle",
        "dash-tile1-title": "Class Distribution & Matcher",
        "dash-tile1-desc": "Calculate your chances and find your perfect match in your grade.",
        "dash-tile2-title": "Hessian Grade Calculator",
        "dash-tile2-desc": "Manage your subjects, calculate exact report card grades, and plan target results.",
        "info-klassen": "This calculator uses complex mathematical systems to estimate the probability of ending up in the same 11th-grade class with another person.",
        "info-match": "With the Match Finder, you can compare two different people to see with whom your chances are mathematically higher.",
        "info-noten": "Manage your grades for the Hessian lower or upper secondary school. Use the calculator or the target planner.",
        "info-fallback": "No additional information available for this view.",
        "text-hint": "Note:",
        "text-probability-is": "The probability is:",
        "text-rule-violation": "Rule violation (0.00%)",
        "text-more-than-10": "0.00% (Over 10 people from old class!)",
        "text-winner-a": "👑 Comparison person A is the better match!",
        "text-winner-b": "👑 Comparison person B is the better match!",
        "text-tie": "Tie or impossible",
        "text-chance-with": "Chance with",
        "text-class-sim-1": "You will likely be assigned to the new class",
        "text-class-sim-2": "There will be exactly 14 boys and 14 girls.",
        "text-class-sim-3": "From your old class, exactly {anzahl} people will be with you.",
        "noten-title-calc": "The Grade Calculator",
        "noten-sub-calc": "Calculate your exact Hessian report card grade.",
        "noten-title-plan": "The Target Grade Planner",
        "noten-sub-plan": "Which grades do you still need?",
        "btn-calc-label": "Calculate Grade",
        "btn-plan-label": "Calculate Combinations",
        "label-work1-calc": "Class Exam:",
        "label-work1-plan": "Class Exam (Optional):",
        "label-work1-calc-haupt": "1. Class Exam:",
        "label-work1-plan-haupt": "1. Exam (Optional):",
        "alert-select-grades": "Please select at least oral and the first exam.",
        "alert-select-exam2": "Please also select the 2nd exam.",
        "alert-select-target": "Please select a target grade!",
        "trend-down": "Trend downwards. Teacher usually tends to grade {grade}.",
        "trend-up": "Trend upwards! You will likely get grade {grade}.",
        "schnitt-at": "Average is at <strong>{schnitt}</strong>.",
        "res-title-calc": "Calculated Report Card Result",
        "res-title-plan": "Possible Grade Paths",
        "target-label": "Target: ",
        "target-unreachable": "❌ This exact goal is mathematically no longer reachable.",
        "list-oral": "Oral: ",
        "list-exam": " | Exam: ",
        "list-exam1": " | 1.Exam: ",
        "list-exam2": " | 2.Exam: ",
        "update-start": "Search for updates started...",
        "update-found": "Update found! The app is reloading...",
        "update-latest": "Your app is already up to date! ✓",
        "update-error": "Error searching for updates on the server.",
        "update-not-supported": "Updates are not supported by this browser.",
        "update-not-ready": "The Service Worker is not ready yet.",
        "btn-close": "Close"
    },
    de: {
        "landing-title": "Willkommen bei Little Uncle",
        "dash-tile1-title": "Klassen-Verteilung & Matcher",
        "dash-tile1-desc": "Berechne deine Chancen und finde deinen optimalen Matchpartner aus der Stufe.",
        "dash-tile2-title": "Hessischer Noten-Rechner",
        "dash-tile2-desc": "Verwalte deine Fächer, berechne exakte Zeugnisnoten und plane Wunschergebnisse.",
        "info-klassen": "Dieser Rechner ermöglicht es dir, mit Hilfe von komplexen mathematischen Systemen, eine ungefähre Wahrscheinlichkeit für das Zusammenkommen mit einer anderen Person in der 11. Klasse zu berechnen.",
        "info-match": "Mit dem „Matchpartner-Finder“ kannst du direkt zwei verschiedene Personen miteinander vergleichen, um mathematisch zu sehen, mit wem deine Chancen höher stehen.",
        "info-noten": "Hier kannst du deine Noten für die hessische Mittelstufe (1-6) oder Oberstufe (0-15 Punkte) verwalten.",
        "info-fallback": "Keine zusätzlichen Informationen für diese Ansicht verfügbar.",
        "text-hint": "Hinweis:",
        "text-probability-is": "Die Wahrscheinlichkeit beträgt:",
        "text-rule-violation": "Regelverstoß (0.00%)",
        "text-more-than-10": "0.00% (Über 10 Personen aus alter Klasse!)",
        "text-winner-a": "👑 Vergleichsperson A ist der bessere Matchpartner!",
        "text-winner-b": "👑 Vergleichsperson B ist der bessere Matchpartner!",
        "text-tie": "Gleichstand oder unmöglich",
        "text-chance-with": "Chance mit",
        "text-class-sim-1": "Du wirst voraussichtlich in die neue Klasse",
        "text-class-sim-2": "Dort werden exakt 14 Jungs und 14 Mädchen sein.",
        "text-class-sim-3": "Von deiner alten Klasse kommen genau {anzahl} Personen mit dir.",
        "noten-title-calc": "Der Noten-Rechner",
        "noten-sub-calc": "Berechne deine exakte hessische Zeugnisnote.",
        "noten-title-plan": "Der Wunschnoten-Planer",
        "noten-sub-plan": "Welche Noten brauchst du noch?",
        "btn-calc-label": "Note berechnen",
        "btn-plan-label": "Kombinationen berechnen",
        "label-work1-calc": "Klassenarbeit:",
        "label-work1-plan": "Klassenarbeit (Optional):",
        "label-work1-calc-haupt": "1. Klassenarbeit:",
        "label-work1-plan-haupt": "1. Arbeit (Optional):",
        "alert-select-grades": "Bitte wähle mindestens mündlich und die erste Arbeit.",
        "alert-select-exam2": "Bitte wähle auch die 2. Arbeit aus.",
        "alert-select-target": "Bitte wähle eine Wunschnote aus!",
        "trend-down": "Trend nach unten. Lehrer tendiert meist zu Note {grade}.",
        "trend-up": "Trend nach oben! Wahrscheinlich kriegst du Note {grade}.",
        "schnitt-at": "Schnitt liegt bei <strong>{schnitt}</strong>.",
        "res-title-calc": "Errechnetes Zeugnis-Ergebnis",
        "res-title-plan": "Mögliche Noten-Wege",
        "target-label": "Ziel: ",
        "target-unreachable": "❌ Dieses exakte Ziel ist mathematisch leider nicht mehr erreichbar.",
        "list-oral": "Mündlich: ",
        "list-exam": " | Arbeit: ",
        "list-exam1": " | 1.Arbeit: ",
        "list-exam2": " | 2.Arbeit: ",
        "update-start": "Suche nach Updates gestartet...",
        "update-found": "Update gefunden! Die App wird neu geladen...",
        "update-latest": "Deine App ist bereits auf dem neuesten Stand! ✓",
        "update-error": "Fehler bei der Update-Suche auf dem Server.",
        "update-not-supported": "Updates werden von diesem Browser nicht unterstützt.",
        "update-not-ready": "Der Service Worker ist noch nicht bereit.",
        "btn-close": "Schließen"
    },
    es: {
        "landing-title": "Bienvenido a Little Uncle",
        "dash-tile1-title": "Distribución de Clases y Matcher",
        "dash-tile1-desc": "Calcula tus posibilidades y encuentra tu pareja perfecta en tu grado.",
        "dash-tile2-title": "Calculadora de Notas de Hesse",
        "dash-tile2-desc": "Gestiona tus asignaturas, calcula notas exactas y planifica resultados objetivos.",
        "info-klassen": "Esta calculadora utiliza sistemas matemáticos complejos para estimar la probabilidad de coincidir en la misma clase de 11º grado.",
        "info-match": "Con el Buscador de Match, puedes comparar dos personas para ver con quién son matemáticamente mayores tus posibilidades.",
        "info-noten": "Gestiona tus notas para la escuela secundaria inferior o superior de Hesse.",
        "info-fallback": "No hay información adicional disponible para esta vista.",
        "text-hint": "Nota:",
        "text-probability-is": "La probabilidad es:",
        "text-rule-violation": "Violación de regla (0.00%)",
        "text-more-than-10": "0.00% (¡Más de 10 personas de la clase anterior!)",
        "text-winner-a": "👑 ¡La persona de comparación A es la mejor opción!",
        "text-winner-b": "👑 ¡La persona de comparación B es la mejor opción!",
        "text-tie": "Empate o imposible",
        "text-chance-with": "Probabilidad con",
        "text-class-sim-1": "Es probable que te asignen a la nueva clase",
        "text-class-sim-2": "Habrá exactamente 14 chicos y 14 chicas.",
        "text-class-sim-3": "De tu antigua clase, exactamente {anzahl} personas estarán contigo.",
        "noten-title-calc": "La Calculadora de Notas",
        "noten-sub-calc": "Calcula tu nota exacta del boletín de Hesse.",
        "noten-title-plan": "El Planificador de Notas Objetivo",
        "noten-sub-plan": "¿Qué notas necesitas todavía?",
        "btn-calc-label": "Calcular Nota",
        "btn-plan-label": "Calcular Combinaciones",
        "label-work1-calc": "Examen de clase:",
        "label-work1-plan": "Examen de clase (Opcional):",
        "label-work1-calc-haupt": "1. Examen de clase:",
        "label-work1-plan-haupt": "1. Examen (Opcional):",
        "alert-select-grades": "Por favor, selecciona al menos la nota oral y el primer examen.",
        "alert-select-exam2": "Por favor, selecciona también el segundo examen.",
        "alert-select-target": "¡Por favor, selecciona una nota objetivo!",
        "trend-down": "Tendencia a la baja. El profesor suele tender a la nota {grade}.",
        "trend-up": "¡Tendencia al alza! Es probable que obtengas la nota {grade}.",
        "schnitt-at": "El promedio está en <strong>{schnitt}</strong>.",
        "res-title-calc": "Resultado de Boletín Calculado",
        "res-title-plan": "Posibles Rutas de Notas",
        "target-label": "Objetivo: ",
        "target-unreachable": "❌ Este objetivo exacto ya no es alcanzable matemáticamente.",
        "list-oral": "Oral: ",
        "list-exam": " | Examen: ",
        "list-exam1": " | 1.Examen: ",
        "list-exam2": " | 2.Examen: ",
        "update-start": "Búsqueda de actualizaciones iniciada...",
        "update-found": "¡Actualización encontrada! La aplicación se está recargando...",
        "update-latest": "¡Tu aplicación ya está actualizada! ✓",
        "update-error": "Error al buscar actualizaciones en el servidor.",
        "update-not-supported": "Este navegador no soporta actualizaciones.",
        "update-not-ready": "El Service Worker aún no está listo.",
        "btn-close": "Cerrar"
    },
    fr: {
        "landing-title": "Bienvenue chez Little Uncle",
        "dash-tile1-title": "Répartition des Classes & Matcher",
        "dash-tile1-desc": "Calculez vos chances et trouvez votre partenaire idéal dans votre promotion.",
        "dash-tile2-title": "Calculateur de Notes de Hesse",
        "dash-tile2-desc": "Gerez vos matières, calculez les notes exactes du bulletin et planifiez vos objectifs.",
        "info-klassen": "Ce calculateur utilise des systèmes mathématiques complexes pour estimer la probabilité de se retrouver dans la même classe de 11ème.",
        "info-match": "Avec le Match Finder, comparez deux personnes pour voir avec laquelle vos chances sont mathématiquement plus élevées.",
        "info-noten": "Gérez vos notes pour le collège ou le lycée en Hesse.",
        "info-fallback": "Aucune information supplémentaire disponible pour cette vue.",
        "text-hint": "Remarque :",
        "text-probability-is": "La probabilité est de :",
        "text-rule-violation": "Violation de règle (0.00%)",
        "text-more-than-10": "0.00% (Plus de 10 personnes de l'ancienne classe !)",
        "text-winner-a": "👑 La personne A est le meilleur choix !",
        "text-winner-b": "👑 La personne B est le meilleur choix !",
        "text-tie": "Égalité ou impossible",
        "text-chance-with": "Chance avec",
        "text-class-sim-1": "Vous serez probablement affecté à la nouvelle classe",
        "text-class-sim-2": "Il y aura exactement 14 garçons et 14 filles.",
        "text-class-sim-3": "De votre ancienne classe, exactement {anzahl} personnes seront avec vous.",
        "noten-title-calc": "Le Calculateur de Notes",
        "noten-sub-calc": "Calculez votre note exacte du bulletin de Hesse.",
        "noten-title-plan": "Le Planificateur de Notes Cibles",
        "noten-sub-plan": "De quelles notes avez-vous encore besoin ?",
        "btn-calc-label": "Calculer la Note",
        "btn-plan-label": "Calculer les Combinaisons",
        "label-work1-calc": "Contrôle :",
        "label-work1-plan": "Contrôle (Optionnel) :",
        "label-work1-calc-haupt": "1. Contrôle :",
        "label-work1-plan-haupt": "1. Contrôle (Optionnel) :",
        "alert-select-grades": "Veuillez sélectionner au moins la note orale et le premier contrôle.",
        "alert-select-exam2": "Veuillez également sélectionner le deuxième contrôle.",
        "alert-select-target": "Veuillez sélectionner une note cible !",
        "trend-down": "Tendance à la baisse. L'enseignant a tendance à attribuer la note {grade}.",
        "trend-up": "Tendance à la hausse ! Vous obtiendrez probablement la note {grade}.",
        "schnitt-at": "La moyenne est de <strong>{schnitt}</strong>.",
        "res-title-calc": "Résultat du Bulletin Calculé",
        "res-title-plan": "Chemins de Notes Possibles",
        "target-label": "Cible : ",
        "target-unreachable": "❌ Cet objectif exact n'est plus atteignable mathématiquement.",
        "list-oral": "Oral : ",
        "list-exam": " | Contrôle : ",
        "list-exam1": " | 1.Contrôle : ",
        "list-exam2": " | 2.Contrôle : ",
        "update-start": "Recherche de mises à jour lancée...",
        "update-found": "Mise à jour trouvée ! L'application se recharge...",
        "update-latest": "Votre application est déjà à jour ! ✓",
        "update-error": "Erreur lors de la recherche de mises à jour sur le serveur.",
        "update-not-supported": "Les mises à jour ne sont pas supportées par ce navigateur.",
        "update-not-ready": "Le Service Worker n'est pas encore prêt.",
        "btn-close": "Fermer"
    },
    it: {
        "landing-title": "Benvenuto su Little Uncle",
        "dash-tile1-title": "Distribuzione Classi & Matcher",
        "dash-tile1-desc": "Calcola le tue possibilità e trova il tuo partner ideale nel tuo anno.",
        "dash-tile2-title": "Calcolatore Voti dell'Assia",
        "dash-tile2-desc": "Gestisci le tue materie, calcola i voti esatti della pagella e pianifica i risultati.",
        "info-klassen": "Questo calcolatore utilizza sistemi matematici complessi per stimare la probabilità di finire nella stessa classe di 11° grado.",
        "info-match": "Con il Match Finder puoi confrontare due persone per vedere con chi le tue possibilità sono matematicamente più alte.",
        "info-noten": "Gestisci i tuoi voti per la scuola secondaria inferiore o superiore dell'Assia.",
        "info-fallback": "Nessuna informazione aggiuntiva disponibile per questa vista.",
        "text-hint": "Nota:",
        "text-probability-is": "La probabilità è:",
        "text-rule-violation": "Violazione della regola (0.00%)",
        "text-more-than-10": "0.00% (Più di 10 persone dalla vecchia classe!)",
        "text-winner-a": "👑 La persona di confronto A è il match migliore!",
        "text-winner-b": "👑 La persona di confronto B è il match migliore!",
        "text-tie": "Pareggio o impossibile",
        "text-chance-with": "Possibilità con",
        "text-class-sim-1": "Probabilmente sarai assegnato alla nuova classe",
        "text-class-sim-2": "Ci saranno esattamente 14 ragazzi e 14 ragazze.",
        "text-class-sim-3": "Dalla tua vecchia classe, esattamente {anzahl} persone saranno con te.",
        "noten-title-calc": "Il Calcolatore di Voti",
        "noten-sub-calc": "Calcola il tuo voto esatto della pagella dell'Assia.",
        "noten-title-plan": "Il Pianificatore di Voti Obiettivo",
        "noten-sub-plan": "Di quali voti hai ancora bisogno?",
        "btn-calc-label": "Calcola Voto",
        "btn-plan-label": "Calcola Combinazioni",
        "label-work1-calc": "Compito in classe:",
        "label-work1-plan": "Compito in classe (Opzionale):",
        "label-work1-calc-haupt": "1. Compito in classe:",
        "label-work1-plan-haupt": "1. Compito (Opzionale):",
        "alert-select-grades": "Per favore, seleziona almeno il voto orale e il primo compito.",
        "alert-select-exam2": "Per favore, seleziona anche il secondo compito.",
        "alert-select-target": "Per favore, seleziona un voto obiettivo!",
        "trend-down": "Tendenza al ribasso. L'insegnante di solito tende al voto {grade}.",
        "trend-up": "Tendenza al rialzo! Probabilmente otterrai il voto {grade}.",
        "schnitt-at": "La media è <strong>{schnitt}</strong>.",
        "res-title-calc": "Risultato della Pagella Calcolato",
        "res-title-plan": "Possibili Percorsi di Voto",
        "target-label": "Obiettivo: ",
        "target-unreachable": "❌ Questo obiettivo esatto non è più raggiungibile matematicamente.",
        "list-oral": "Orale: ",
        "list-exam": " | Compito: ",
        "list-exam1": " | 1.Compito: ",
        "list-exam2": " | 2.Compito: ",
        "update-start": "Ricerca aggiornamenti avviata...",
        "update-found": "Aggiornamento trovato! L'applicazione si sta ricaricando...",
        "update-latest": "La tua applicazione è già aggiornata! ✓",
        "update-error": "Errore durante la ricerca di aggiornamenti sul server.",
        "update-not-supported": "Gli aggiornamenti non sono supportati da questo browser.",
        "update-not-ready": "Il Service Worker non è ancora pronto.",
        "btn-close": "Chiudi"
    },
    pt: {
        "landing-title": "Bem-vindo ao Little Uncle",
        "dash-tile1-title": "Distribuição de Classes & Matcher",
        "dash-tile1-desc": "Calcule suas chances e encontre seu par perfeito no seu ano letivo.",
        "dash-tile2-title": "Calculadora de Notas de Hesse",
        "dash-tile2-desc": "Gerencie suas disciplinas, calcule notas exatas do boletim e planeje resultados.",
        "info-klassen": "Esta calculadora usa complexos sistemas matemáticos para estimar a probabilidade de ficar na mesma turma do 11º ano.",
        "info-match": "Com o Match Finder, você pode comparar duas pessoas para ver com quem suas chances são matematicamente maiores.",
        "info-noten": "Gerencie suas notas para o ensino fundamental ou médio de Hesse.",
        "info-fallback": "Nenhuma informação adicional disponível para esta visualização.",
        "text-hint": "Nota:",
        "text-probability-is": "A probabilidade é:",
        "text-rule-violation": "Violação de regra (0.00%)",
        "text-more-than-10": "0.00% (Mais de 10 pessoas da turma antiga!)",
        "text-winner-a": "👑 A pessoa de comparação A é o melhor par!",
        "text-winner-b": "👑 A pessoa de comparação B é o melhor par!",
        "text-tie": "Empate ou impossível",
        "text-chance-with": "Chance com",
        "text-class-sim-1": "Você provavelmente será alocado na nova turma",
        "text-class-sim-2": "Haverá exatamente 14 meninos e 14 meninas.",
        "text-class-sim-3": "Da sua antiga turma, exatamente {anzahl} pessoas estarão com você.",
        "noten-title-calc": "A Calculadora de Notas",
        "noten-sub-calc": "Calcule a nota exata do seu boletim de Hesse.",
        "noten-title-plan": "O Planejador de Notas Alvo",
        "noten-sub-plan": "De quais notas você ainda precisa?",
        "btn-calc-label": "Calcular Nota",
        "btn-plan-label": "Calcular Combinações",
        "label-work1-calc": "Trabalho escolar:",
        "label-work1-plan": "Trabalho escolar (Opcional):",
        "label-work1-calc-haupt": "1. Trabalho escolar:",
        "label-work1-plan-haupt": "1. Trabalho (Opcional):",
        "alert-select-grades": "Por favor, selecione pelo menos a nota oral e o primeiro trabalho.",
        "alert-select-exam2": "Por favor, selecione também o segundo trabalho.",
        "alert-select-target": "Por favor, selecione uma nota alvo!",
        "trend-down": "Tendência de queda. O professor geralmente tende à nota {grade}.",
        "trend-up": "Tendência de alta! Você provavelmente receberá a nota {grade}.",
        "schnitt-at": "A média está em <strong>{schnitt}</strong>.",
        "res-title-calc": "Resultado do Boletim Calculado",
        "res-title-plan": "Caminhos de Notas Possíveis",
        "target-label": "Alvo: ",
        "target-unreachable": "❌ Este objetivo exato não é mais alcançável matematicamente.",
        "list-oral": "Oral: ",
        "list-exam": " | Trabalho: ",
        "list-exam1": " | 1.Trabalho: ",
        "list-exam2": " | 2.Trabalho: ",
        "update-start": "Busca por atualizações iniciada...",
        "update-found": "Atualização encontrada! O aplicativo está recarregando...",
        "update-latest": "Seu aplicativo já está atualizado! ✓",
        "update-error": "Erro ao buscar atualizações no servidor.",
        "update-not-supported": "Atualizações não são suportadas por este navegador.",
        "update-not-ready": "O Service Worker ainda não está pronto.",
        "btn-close": "Fechar"
    },
    nl: {
        "landing-title": "Welkom bij Little Uncle",
        "dash-tile1-title": "Klasverdeling & Matcher",
        "dash-tile1-desc": "Bereken je kansen en vind je perfecte match in je leerjaar.",
        "dash-tile2-title": "Hessische Cijfercalculator",
        "dash-tile2-desc": "Beheer je vakken, bereken exacte rapportcijfers en plan je doelresultaten.",
        "info-klassen": "Deze calculator gebruikt complexe wiskundige systemen om de kans te berekenen dat je in dezelfde klas van de 11e klas komt.",
        "info-match": "Met de Match Finder kun je twee personen vergelijken om te zien met wie je kansen wiskundig gezien hoger zijn.",
        "info-noten": "Beheer je cijfers voor de Hessische onder- of bovenbouw.",
        "info-fallback": "Geen extra informatie beschikbaar voor deze weergave.",
        "text-hint": "Opmerking:",
        "text-probability-is": "De waarschijnlijkheid is:",
        "text-rule-violation": "Regelovertreding (0.00%)",
        "text-more-than-10": "0.00% (Meer dan 10 personen uit de oude klas!)",
        "text-winner-a": "👑 Vergelijkingspersoon A is de betere match!",
        "text-winner-b": "👑 Vergelijkingspersoon B is de betere match!",
        "text-tie": "Gelijkspel of onmogelijk",
        "text-chance-with": "Kans met",
        "text-class-sim-1": "Je wordt waarschijnlijk ingedeeld in de nieuwe klas",
        "text-class-sim-2": "Er zullen precies 14 jongens en 14 meisjes zijn.",
        "text-class-sim-3": "Van je oude klas zullen er precies {anzahl} mensen bij je zijn.",
        "noten-title-calc": "De Cijfercalculator",
        "noten-sub-calc": "Bereken je exacte Hessische rapportcijfer.",
        "noten-title-plan": "De Doelcijferplanner",
        "noten-sub-plan": "Welke cijfers heb je nog nodig?",
        "btn-calc-label": "Cijfer Berekenen",
        "btn-plan-label": "Combinaties Berekenen",
        "label-work1-calc": "Toets:",
        "label-work1-plan": "Toets (Optioneel):",
        "label-work1-calc-haupt": "1. Toets:",
        "label-work1-plan-haupt": "1. Toets (Optioneel):",
        "alert-select-grades": "Selecteer minstens mondeling en de eerste toets.",
        "alert-select-exam2": "Selecteer ook de tweede toets.",
        "alert-select-target": "Selecteer een doelcijfer!",
        "trend-down": "Neerwaartse trend. De docent neigt meestal naar cijfer {grade}.",
        "trend-up": "Opwaartse trend! Je krijgt waarschijnlijk cijfer {grade}.",
        "schnitt-at": "Het gemiddelde is <strong>{schnitt}</strong>.",
        "res-title-calc": "Berekend Rapportresultaat",
        "res-title-plan": "Mogelijke Cijfertrajecten",
        "target-label": "Doel: ",
        "target-unreachable": "❌ Dit exacte doel is wiskundig gezien niet meer haalbaar.",
        "list-oral": "Mondeling: ",
        "list-exam": " | Toets: ",
        "list-exam1": " | 1.Toets: ",
        "list-exam2": " | 2.Toets: ",
        "update-start": "Zoeken naar updates gestart...",
        "update-found": "Update gevonden! De app wordt opnieuw geladen...",
        "update-latest": "Je app is al up-to-date! ✓",
        "update-error": "Fout bij het zoeken naar updates op de server.",
        "update-not-supported": "Updates worden niet ondersteund door deze browser.",
        "update-not-ready": "De Service Worker is nog niet gereed.",
        "btn-close": "Sluiten"
    },
    pl: {
        "landing-title": "Witamy w Little Uncle",
        "dash-tile1-title": "Podział Klas & Matcher",
        "dash-tile1-desc": "Oblicz swoje szanse i znajdź idealnego partnera w swoim roczniku.",
        "dash-tile2-title": "Heski Kalkulator Ocen",
        "dash-tile2-desc": "Zarządzaj przedmiotami, obliczaj dokładne oceny ze świadectwa i planuj cele.",
        "info-klassen": "Ten kalkulator wykorzystuje złożone systemy matematyczne do oszacowania prawdopodobieństwa znalezienia się w tej samej 11. klasie.",
        "info-match": "Dzięki Match Finder możesz porównać dwie osoby, aby zobaczyć, z kim Twoje szanse są matematycznie wyższe.",
        "info-noten": "Zarządzaj swoimi ocenami dla heskiej szkoły średniej niższego lub wyższego stopnia.",
        "info-fallback": "Brak dodatkowych informacji dla tego widoku.",
        "text-hint": "Uwaga:",
        "text-probability-is": "Prawdopodobieństwo wynosi:",
        "text-rule-violation": "Naruszenie zasady (0.00%)",
        "text-more-than-10": "0.00% (Ponad 10 osób ze starej klasy!)",
        "text-winner-a": "👑 Osoba porównywana A jest lepszym partnerem!",
        "text-winner-b": "👑 Osoba porównywana B jest lepszym partnerem!",
        "text-tie": "Remis lub niemożliwe",
        "text-chance-with": "Szansa z",
        "text-class-sim-1": "Prawdopodobnie zostaniesz przydzielony do nowej klasy",
        "text-class-sim-2": "Będzie tam dokładnie 14 chłopców i 14 dziewcząt.",
        "text-class-sim-3": "Ze Twojej starej klasy będzie z Tobą dokładnie {anzahl} osób.",
        "noten-title-calc": "Kalkulator Ocen",
        "noten-sub-calc": "Oblicz swoją dokładną heską ocenę ze świadectwa.",
        "noten-title-plan": "Planista Ocen Docelowych",
        "noten-sub-plan": "Jakich ocen jeszcze potrzebujesz?",
        "btn-calc-label": "Oblicz Ocenę",
        "btn-plan-label": "Oblicz Kombinacje",
        "label-work1-calc": "Sprawdzian:",
        "label-work1-plan": "Sprawdzian (Opcjonalnie):",
        "label-work1-calc-haupt": "1. Sprawdzian:",
        "label-work1-plan-haupt": "1. Sprawdzian (Opcjonalnie):",
        "alert-select-grades": "Wybierz co najmniej ocenę ustną i pierwszy sprawdzian.",
        "alert-select-exam2": "Wybierz również drugi sprawdzian.",
        "alert-select-target": "Wybierz ocenę docelową!",
        "trend-down": "Trend spadkowy. Nauczyciel zazwyczaj skłania się ku ocenie {grade}.",
        "trend-up": "Trend wzrostowy! Prawdopodobnie otrzymasz ocenę {grade}.",
        "schnitt-at": "Średnia wynosi <strong>{schnitt}</strong>.",
        "res-title-calc": "Obliczony Wynik Świadectwa",
        "res-title-plan": "Możliwe Ścieżki Ocen",
        "target-label": "Cel: ",
        "target-unreachable": "❌ Ten dokładny cel nie jest już matematycznie osiągalny.",
        "list-oral": "Ustny: ",
        "list-exam": " | Sprawdzian: ",
        "list-exam1": " | 1.Sprawdzian: ",
        "list-exam2": " | 2.Sprawdzian: ",
        "update-start": "Rozpoczęto wyszukiwanie aktualizacji...",
        "update-found": "Znaleziono aktualizację! Aplikacja jest przeładowywana...",
        "update-latest": "Twoja aplikacja jest już aktualna! ✓",
        "update-error": "Błąd podczas wyszukiwania aktualizacji na serwerze.",
        "update-not-supported": "Aktualizacje nie są obsługiwane przez tę przeglądarkę.",
        "update-not-ready": "Service Worker nie jest jeszcze gotowy.",
        "btn-close": "Zamknij"
    },
    ru: {
        "landing-title": "Добро пожаловать в Little Uncle",
        "dash-tile1-title": "Распределение классов и Матчер",
        "dash-tile1-desc": "Рассчитайте свои шансы и найдите идеальную пару на своем параллели.",
        "dash-tile2-title": "Гессенский калькулятор оценок",
        "dash-tile2-desc": "Управляйте предметами, рассчитывайте точные оценки в аттестате и планируйте результаты.",
        "info-klassen": "Этот калькулятор использует сложные математические системы для оценки вероятности попасть в один 11-й класс.",
        "info-match": "С помощью Match Finder вы можете сравнить двух человек, чтобы увидеть, с кем ваши шансы математически выше.",
        "info-noten": "Управляйте своими оценками для гессенской средней или старшей школы.",
        "info-fallback": "Нет дополнительной информации для этого вида.",
        "text-hint": "Примечание:",
        "text-probability-is": "Вероятность составляет:",
        "text-rule-violation": "Нарушение правила (0.00%)",
        "text-more-than-10": "0.00% (Более 10 человек из старого класса!)",
        "text-winner-a": "👑 Сравниваемое лицо А — лучший вариант!",
        "text-winner-b": "👑 Сравниваемое лицо Б — лучший вариант!",
        "text-tie": "Ничья или невозможно",
        "text-chance-with": "Шанс с",
        "text-class-sim-1": "Вы, вероятно, будете зачислены в новый класс",
        "text-class-sim-2": "Там будет ровно 14 мальчиков и 14 девочек.",
        "text-class-sim-3": "Из вашего старого класса с вами будет ровно {anzahl} человек.",
        "noten-title-calc": "Калькулятор Оценок",
        "noten-sub-calc": "Рассчитайте точную оценку для гессенского аттестата.",
        "noten-title-plan": "Планировщик Целевых Оценок",
        "noten-sub-plan": "Какие оценки вам еще нужны?",
        "btn-calc-label": "Рассчитать Оценку",
        "btn-plan-label": "Рассчитать Комбинации",
        "label-work1-calc": "Контрольная работа:",
        "label-work1-plan": "Контрольная работа (Опционально):",
        "label-work1-calc-haupt": "1. Контрольная работа:",
        "label-work1-plan-haupt": "1. Контрольная (Опционально):",
        "alert-select-grades": "Пожалуйста, выберите как минимум устную оценку и первую контрольную работу.",
        "alert-select-exam2": "Пожалуйста, выберите также вторую контрольную работу.",
        "alert-select-target": "Пожалуйста, выберите целевую оценку!",
        "trend-down": "Тенденция к снижению. Учитель обычно склоняется к оценке {grade}.",
        "trend-up": "Тенденция к росту! Вы, скорее всего, получите оценку {grade}.",
        "schnitt-at": "Средний балл составляет <strong>{schnitt}</strong>.",
        "res-title-calc": "Рассчитанный Результат Аттестата",
        "res-title-plan": "Возможные Варианты Оценок",
        "target-label": "Цель: ",
        "target-unreachable": "❌ Эта точная цель математически больше недостижима.",
        "list-oral": "Устно: ",
        "list-exam": " | Контрольная: ",
        "list-exam1": " | 1.Контрольная: ",
        "list-exam2": " | 2.Контрольная: ",
        "update-start": "Поиск обновлений запущен...",
        "update-found": "Обновление найдено! Приложение перезагружается...",
        "update-latest": "Ваше приложение уже обновлено! ✓",
        "update-error": "Ошибка при поиске обновлений на сервере.",
        "update-not-supported": "Обновления не поддерживаются этим браузером.",
        "update-not-ready": "Service Worker еще не готов.",
        "btn-close": "Закрыть"
    },
    tr: {
        "landing-title": "Little Uncle'a Hoş Geldiniz",
        "dash-tile1-title": "Sınıf Dağılımı & Eşleştirici",
        "dash-tile1-desc": "Şansınızı hesaplayın ve döneminizdeki en iyi eşleşmeyi bulun.",
        "dash-tile2-title": "Hessen Not Hesaplayıcı",
        "dash-tile2-desc": "Derslerinizi yönetin, kesin karne notlarını hesaplayın ve hedef sonuçları planlayın.",
        "info-klassen": "Bu hesaplayıcı, başka bir kişiyle aynı 11. sınıf şubesine düşme olasılığınızı tahmin etmek için karmaşık matematiksel sistemler kullanır.",
        "info-match": "Match Finder ile iki farklı kişiyi karşılaştırabilir ve hangisiyle şansınızın matematiksel olarak daha yüksek olduğunu görebilirsiniz.",
        "info-noten": "Hessen ortaokul veya lise kademesi için notlarınızı yönetin.",
        "info-fallback": "Bu görünüm için ek bilgi mevcut değil.",
        "text-hint": "Not:",
        "text-probability-is": "Olasılık:",
        "text-rule-violation": "Kural ihlali (0.00%)",
        "text-more-than-10": "0.00% (Eski sınıftan 10'dan fazla kişi var!)",
        "text-winner-a": "👑 Karşılaştırılan A kişisi daha iyi bir eşleşme!",
        "text-winner-b": "👑 Karşılaştırılan B kişisi daha iyi bir eşleşme!",
        "text-tie": "Beraberlik veya imkansız",
        "text-chance-with": "Şans:",
        "text-class-sim-1": "Muhtemelen yeni sınıfa atanacaksınız",
        "text-class-sim-2": "Tam olarak 14 erkek ve 14 kız olacak.",
        "text-class-sim-3": "Eski sınıfınızdan tam olarak {anzahl} kişi sizinle olacak.",
        "noten-title-calc": "Not Hesaplayıcı",
        "noten-sub-calc": "Hessen karne notunuzu kesin olarak hesaplayın.",
        "noten-title-plan": "Hedef Not Planlayıcı",
        "noten-sub-plan": "Hangi notlara hala ihtiyacınız var?",
        "btn-calc-label": "Notu Hesapla",
        "btn-plan-label": "Kombinasyonları Hesapla",
        "label-work1-calc": "Sınav:",
        "label-work1-plan": "Sınav (Opsiyonel):",
        "label-work1-calc-haupt": "1. Sınav:",
        "label-work1-plan-haupt": "1. Sınav (Opsiyonel):",
        "alert-select-grades": "Lütfen en az sözlü notunu ve ilk sınavı seçin.",
        "alert-select-exam2": "Lütfen ikinci sınavı da seçin.",
        "alert-select-target": "Lütfen bir hedef not seçin!",
        "trend-down": "Düşüş trendi. Öğretmen genellikle {grade} notuna yönelir.",
        "trend-up": "Yükseliş trendi! Muhtemelen {grade} notu alacaksınız.",
        "schnitt-at": "Ortalama <strong>{schnitt}</strong> seviyesinde.",
        "res-title-calc": "Hesaplanan Karne Sonucu",
        "res-title-plan": "Olası Not Yolları",
        "target-label": "Hedef: ",
        "target-unreachable": "❌ Bu kesin hedefe matematiksel olarak artık ulaşılamaz.",
        "list-oral": "Sözlü: ",
        "list-exam": " | Sınav: ",
        "list-exam1": " | 1.Sınav: ",
        "list-exam2": " | 2.Sınav: ",
        "update-start": "Güncelleme araması başlatıldı...",
        "update-found": "Güncelleme bulundu! Uygulama yeniden yükleniyor...",
        "update-latest": "Uygulamanız zaten güncel! ✓",
        "update-error": "Sunucuda güncelleme aranırken hata oluştu.",
        "update-not-supported": "Güncellemeler bu tarayıcı tarafından desteklenmiyor.",
        "update-not-ready": "Service Worker henüz hazır değil.",
        "btn-close": "Kapat"
    },
    ar: {
        "landing-title": "مرحباً بك في Little Uncle",
        "dash-tile1-title": "توزيع الفصول والمطابقة",
        "dash-tile1-desc": "احسب فرصك وابحث عن الشريك المثالي في مرحلتك الدراسية.",
        "dash-tile2-title": "حاسبة الدرجات في ولاية هسن",
        "dash-tile2-desc": "إدارة موادك الدراسية، وحساب درجات الشهادة الدقيقة، والتخطيط للنتائج المستهدفة.",
        "info-klassen": "تستخدم هذه الحاسبة أنظمة رياضية معقدة لتقدير احتمالية التواجد في نفس فصل الصف الحادي عشر مع شخص آخر.",
        "info-match": "باستخدام محدد المطابقة، يمكنك مقارنة شخصين لمعرفة من تكون فرصك معه أعلى رياضياً.",
        "info-noten": "إدارة درجاتك للمرحلة المتوسطة أو الثانوية في ولاية هسن.",
        "info-fallback": "لا توجد معلومات إضافية متاحة لهذا العرض.",
        "text-hint": "ملاحظة:",
        "text-probability-is": "الاحتمالية هي:",
        "text-rule-violation": "انتهاك القواعد (0.00%)",
        "text-more-than-10": "0.00% (أكثر من 10 أشخاص من الفصل القديم!)",
        "text-winner-a": "👑 الشخص المقارن أ هو المطابق الأفضل!",
        "text-winner-b": "👑 الشخص المقارن ب هو المطابق الأفضل!",
        "text-tie": "تعادل أو مستحيل",
        "text-chance-with": "الفرصة مع",
        "text-class-sim-1": "من المحتمل أن يتم تعيينك في الفصل الجديد",
        "text-class-sim-2": "سيكون هناك 14 فتى و 14 فتاة بالضبط.",
        "text-class-sim-3": "من فصلك القديم، سيكون معك {anzahl} أشخاص بالضبط.",
        "noten-title-calc": "حاسبة الدرجات",
        "noten-sub-calc": "احسب درجة شهادتك الدقيقة في ولاية هسن.",
        "noten-title-plan": "مخطط الدرجات المستهدفة",
        "noten-sub-plan": "ما هي الدرجات التي ما زلت بحاجة إليها؟",
        "btn-calc-label": "حساب الدرجة",
        "btn-plan-label": "حساب الاحتمالات",
        "label-work1-calc": "الاختبار الصفي:",
        "label-work1-plan": "الاختبار الصفي (اختياري):",
        "label-work1-calc-haupt": "1. الاختبار الصفي:",
        "label-work1-plan-haupt": "1. اختبار (اختياري):",
        "alert-select-grades": "يرجى تحديد الدرجة الشفهية والاختبار الأول على الأقل.",
        "alert-select-exam2": "يرجى تحديد الاختبار الثاني أيضاً.",
        "alert-select-target": "يرجى تحديد الدرجة المستهدفة!",
        "trend-down": "الاتجاه نحو الانخفاض. يميل المعلم عادةً إلى الدرجة {grade}.",
        "trend-up": "الاتجاه نحو الارتفاع! من المحتمل أن تحصل على الدرجة {grade}.",
        "schnitt-at": "المعدل هو <strong>{schnitt}</strong>.",
        "res-title-calc": "نتيجة الشهادة المحسوبة",
        "res-title-plan": "مسارات الدرجات الممكنة",
        "target-label": "الهدف: ",
        "target-unreachable": "❌ هذا الهدف الدقيق لم يعد ممكناً رياضياً.",
        "list-oral": "الشفهي: ",
        "list-exam": " | الاختبار: ",
        "list-exam1": " | 1.الاختبار: ",
        "list-exam2": " | 2.الاختبار: ",
        "update-start": "تم بدء البحث عن تحديثات...",
        "update-found": "تم العثور على تحديث! جاري إعادة تحميل التطبيق...",
        "update-latest": "تطبيقك محدث بالفعل! ✓",
        "update-error": "خطأ أثناء البحث عن تحديثات في الخادم.",
        "update-not-supported": "التحديثات غير مدعومة في هذا المتصفح.",
        "update-not-ready": "ملف الـ Service Worker ليس جاهزاً بعد.",
        "btn-close": "إغلاق"
    },
    he: {
        "landing-title": "ברוכים הבאים ל-Little Uncle",
        "dash-tile1-title": "חלוקת כיתות והתאמה",
        "dash-tile1-desc": "חשב את הסיכויים שלך ומצא את ההתאמה המושלמת בשכבה שלך.",
        "dash-tile2-title": "מחשבון ציונים של הסן",
        "dash-tile2-desc": "נהל את המקצועות שלך, חשב את ציוני התעודה המדויקים ותכנן תוצאות יעד.",
        "info-klassen": "מחשבון זה משתמש במערכות מתמטיות מורכבות כדי להעריך את ההסתברות להגיע לאותה כיתה ביא' עם אדם אחר.",
        "info-match": "בעזרת מוצא ההתאמות, תוכל להשוות בין שני אנשים שונים כדי לראות עם מי הסיכויים שלך גבוהים יותר מתמטית.",
        "info-noten": "נהל את הציונים שלך עבור חטיבת הביניים או החטיבה העליונה של הסן.",
        "info-fallback": "אין מידע נוסף זמין עבור תצוגה זו.",
        "text-hint": "הערה:",
        "text-probability-is": "ההסתברות היא:",
        "text-rule-violation": "הפרת כלל (0.00%)",
        "text-more-than-10": "0.00% (יותר מ-10 אנשים מהכיתה הישנה!)",
        "text-winner-a": "👑 אדם א' הוא ההתאמה הטובה יותר!",
        "text-winner-b": "👑 אדם ב' הוא ההתאמה הטובה יותר!",
        "text-tie": "תיקו או בלתי אפשרי",
        "text-chance-with": "סיכוי עם",
        "text-class-sim-1": "סביר להניח שתשובץ בכיתה החדשה",
        "text-class-sim-2": "יהיו שם בדיוק 14 בנים ו-14 בנות.",
        "text-class-sim-3": "מהכיתה הישנה שלך, בדיוק {anzahl} אנשים יהיו איתך.",
        "noten-title-calc": "מחשבון הציונים",
        "noten-sub-calc": "חשב את ציון התעודה המדויק שלך בהסן.",
        "noten-title-plan": "מתכנן ציוני היעד",
        "noten-sub-plan": "אילו ציונים אתה עדיין צריך?",
        "btn-calc-label": "חשב ציון",
        "btn-plan-label": "חשב שילובים",
        "label-work1-calc": "מבחן כיתה:",
        "label-work1-plan": "מבחן כיתה (אופציונלי):",
        "label-work1-calc-haupt": "1. מבחן כיתה:",
        "label-work1-plan-haupt": "1. מבחן (אופציונלי):",
        "alert-select-grades": "אנא בחר לפחות את הציון בעל פה ואת המבחן הראשון.",
        "alert-select-exam2": "אנא בחר גם את המבחן השני.",
        "alert-select-target": "אנא בחר ציון יעד!",
        "trend-down": "מגמת ירידה. המורה נוטה בדרך כלל לציון {grade}.",
        "trend-up": "מגמת עלייה! ככל הנראה תקבל את הציון {grade}.",
        "schnitt-at": "הממוצע הוא <strong>{schnitt}</strong>.",
        "res-title-calc": "ציון התעודה המחושב",
        "res-title-plan": "דרכי ציון אפשריות",
        "target-label": "יעד: ",
        "target-unreachable": "❌ יעד מדויק זה אינו ניתן להשגה מבחינה מתמטית.",
        "list-oral": "בעל פה: ",
        "list-exam": " | מבחן: ",
        "list-exam1": " | 1.מבחן: ",
        "list-exam2": " | 2.מבחן: ",
        "update-start": "חיפוש עדכונים הופעל...",
        "update-found": "נמצא עדכון! האפליקציה נטענת מחדש...",
        "update-latest": "האפליקציה שלך כבר מעודכנת! ✓",
        "update-error": "שגיאה בחיפוש עדכונים בשרת.",
        "update-not-supported": "עדכונים אינם נתמכים בדפדפן זה.",
        "update-not-ready": "ה-Service Worker עדיין לא מוכן.",
        "btn-close": "סגור"
    },
    ja: {
        "landing-title": "Little Uncle へようこそ",
        "dash-tile1-title": "クラス振り分け＆マッチング",
        "dash-tile1-desc": "確率を計算し、学年の中から最適なマッチング相手を見つけます。",
        "dash-tile2-title": "ヘッセン州成績計算ツール",
        "dash-tile2-desc": "教科を管理し、正確な通知表の成績を計算し、目標結果を計画します。",
        "info-klassen": "この計算ツールは、複雑な数学的システムを使用して、別の人物と同じ11年生のクラスになる確率を推定します。",
        "info-match": "マッチファインダーを使用すると、2人の人物を比較して、どちらの方が数学的に確率が高いかを確認できます。",
        "info-noten": "ヘッセン州の中等教育前期または後期の成績を管理します。",
        "info-fallback": "このビューに関する追加情報はありません。",
        "text-hint": "ヒント:",
        "text-probability-is": "確率は：",
        "text-rule-violation": "ルール違反 (0.00%)",
        "text-more-than-10": "0.00% (元のクラスから10人以上います！)",
        "text-winner-a": "👑 比較対象Aの方が相性が良いです！",
        "text-winner-b": "👑 比較対象Bの方が相性が良いです！",
        "text-tie": "引き分けまたは不可能",
        "text-chance-with": "との確率",
        "text-class-sim-1": "あなたは新しいクラスに配属される可能性が高いです",
        "text-class-sim-2": "そこには男子14人、女子14人がきっちり揃います。",
        "text-class-sim-3": "元のクラスからは、正確に {anzahl} 人が一緒になります。",
        "noten-title-calc": "成績計算ツール",
        "noten-sub-calc": "正確なヘッセン州の通知表成績を計算します。",
        "noten-title-plan": "目標成績プランナー",
        "noten-sub-plan": "あとどの成績が必要ですか？",
        "btn-calc-label": "成績を計算",
        "btn-plan-label": "組み合わせを計算",
        "label-work1-calc": "定期テスト:",
        "label-work1-plan": "定期テスト（任意）:",
        "label-work1-calc-haupt": "1. 定期テスト:",
        "label-work1-plan-haupt": "1. テスト（任意）:",
        "alert-select-grades": "少なくとも口頭点と最初のテストを選択してください。",
        "alert-select-exam2": "2番目のテストも選択してください。",
        "alert-select-target": "目標とする成績を選択してください！",
        "trend-down": "下降傾向です。先生は通常、成績 {grade} に傾く傾向があります。",
        "trend-up": "上昇傾向です！ おそらく成績 {grade} が取れるでしょう。",
        "schnitt-at": "平均は <strong>{schnitt}</strong> です。",
        "res-title-calc": "計算された通知表結果",
        "res-title-plan": "可能な成績ルート",
        "target-label": "目標: ",
        "target-unreachable": "❌ この正確な目標は、数学的にもう達成不可能です。",
        "list-oral": "口頭点: ",
        "list-exam": " | テスト: ",
        "list-exam1": " | 1.テスト: ",
        "list-exam2": " | 2.テスト: ",
        "update-start": "アップデートの確認を開始しました...",
        "update-found": "アップデートが見つかりました！ アプリを再読み込みしています...",
        "update-latest": "アプリはすでに最新の状態です！ ✓",
        "update-error": "サーバーでのアップデート確認中にエラーが発生しました。",
        "update-not-supported": "このブラウザはアップデートをサポートしていません。",
        "update-not-ready": "Service Workerの準備がまだできていません。",
        "btn-close": "閉じる"
    },
    ko: {
        "landing-title": "Little Uncle에 오신 것을 환영합니다",
        "dash-tile1-title": "반 배정 및 매칭",
        "dash-tile1-desc": "확률을 계산하고 학년에서 가장 잘 맞는 매칭 파트너를 찾으세요.",
        "dash-tile2-title": "헤센주 성적 계산기",
        "dash-tile2-desc": "과목을 관리하고, 정확한 성적표 점수를 계산하며, 목표 결과를 계획하세요.",
        "info-klassen": "이 계산기는 복잡한 수학적 시스템을 사용하여 다른 사람과 같은 11학년 반에 배정될 확률을 추정합니다.",
        "info-match": "매치 파인더를 사용하면 두 사람을 비교하여 누구와 함께할 확률이 수학적으로 더 높은지 확인할 수 있습니다.",
        "info-noten": "헤센주 중등 및 고등 과정의 성적을 관리하세요.",
        "info-fallback": "이 보기에 대한 추가 정보가 없습니다.",
        "text-hint": "힌트:",
        "text-probability-is": "확률은 다음과 같습니다:",
        "text-rule-violation": "규칙 위반 (0.00%)",
        "text-more-than-10": "0.00% (이전 반에서 10명 이상 초과!)",
        "text-winner-a": "👑 비교 대상 A가 더 나은 매칭 파트너입니다!",
        "text-winner-b": "👑 비교 대상 B가 더 나은 매칭 파트너입니다!",
        "text-tie": "무승부 또는 불가능",
        "text-chance-with": "와의 확률",
        "text-class-sim-1": "새로운 반으로 배정될 확률이 높습니다",
        "text-class-sim-2": "그곳에는 정확히 남학생 14명과 여학생 14명이 있게 됩니다.",
        "text-class-sim-3": "이전 반에서 정확히 {anzahl}명이 동반 배정됩니다.",
        "noten-title-calc": "성적 계산기",
        "noten-sub-calc": "정확한 헤센주 성적표 점수를 계산합니다.",
        "noten-title-plan": "목표 성적 플래너",
        "noten-sub-plan": "어떤 성적이 더 필요합니까?",
        "btn-calc-label": "성적 계산",
        "btn-plan-label": "조합 계산",
        "label-work1-calc": "지필평가:",
        "label-work1-plan": "지필평가 (선택 사항):",
        "label-work1-calc-haupt": "1차 지필평가:",
        "label-work1-plan-haupt": "1차 평가 (선택 사항):",
        "alert-select-grades": "최소 수행평가(구술) 점수와 1차 지필평가를 선택해 주세요.",
        "alert-select-exam2": "2차 지필평가도 선택해 주세요.",
        "alert-select-target": "목표 성적을 선택해 주세요!",
        "trend-down": "하락 경향입니다. 교사는 대개 {grade} 성적을 부여하는 편입니다.",
        "trend-up": "상승 경향입니다! 아마도 {grade} 성적을 받게 될 것입니다.",
        "schnitt-at": "평균은 <strong>{schnitt}</strong>입니다.",
        "res-title-calc": "계산된 성적표 결과",
        "res-title-plan": "가능한 성적 경로",
        "target-label": "목표: ",
        "target-unreachable": "❌ 이 정확한 목표는 수학적으로 더 이상 도달 불가능합니다.",
        "list-oral": "수행(구술): ",
        "list-exam": " | 지필: ",
        "list-exam1": " | 1차지필: ",
        "list-exam2": " | 2차지필: ",
        "update-start": "업데이트 확인 시작됨...",
        "update-found": "업데이트 발견! 앱을 다시 로드하는 중...",
        "update-latest": "앱이 이미 최신 상태입니다! ✓",
        "update-error": "서버에서 업데이트를 확인하는 동안 오류가 발생했습니다.",
        "update-not-supported": "이 브라우저는 업데이트를 지원하지 않습니다.",
        "update-not-ready": "Service Worker가 아직 준비되지 않았습니다.",
        "btn-close": "닫기"
    },
    zh: {
        "landing-title": "欢迎来到 Little Uncle",
        "dash-tile1-title": "班级分配与匹配器",
        "dash-tile1-desc": "计算你的概率并从年级中找到最佳匹配伙伴。",
        "dash-tile2-title": "黑森州成绩计算器",
        "dash-tile2-desc": "管理你的科目，计算精确的成绩单分数并规划目标结果。",
        "info-klassen": "该计算器利用复杂的数学系统来估算与另一个人进入同一个11年级班级的概率。",
        "info-match": "通过匹配器，您可以直接对比两个人，看与谁进入同一班级的数学概率更高。",
        "info-noten": "在此管理黑森州初中或高中的成绩。",
        "info-fallback": "该视图暂无其他附加信息。",
        "text-hint": "提示：",
        "text-probability-is": "概率为：",
        "text-rule-violation": "违反规则 (0.00%)",
        "text-more-than-10": "0.00% (原班级超过 10 人！)",
        "text-winner-a": "👑 对比对象 A 是更好的匹配伙伴！",
        "text-winner-b": "👑 对比对象 B 是更好的匹配伙伴！",
        "text-tie": "平局或不可能",
        "text-chance-with": "与某人的概率",
        "text-class-sim-1": "你预计会被分配到新班级",
        "text-class-sim-2": "那里将正好有 14 名男生和 14 名女生。",
        "text-class-sim-3": "你原班级中正好有 {anzahl} 人会和你在一起。",
        "noten-title-calc": "成绩计算器",
        "noten-sub-calc": "计算精确的黑森州成绩单分数。",
        "noten-title-plan": "目标成绩规划器",
        "noten-sub-plan": "你还需要哪些成绩？",
        "btn-calc-label": "计算分数",
        "btn-plan-label": "计算组合",
        "label-work1-calc": "课堂测验：",
        "label-work1-plan": "课堂测验（可选）：",
        "label-work1-calc-haupt": "1. 课堂测验：",
        "label-work1-plan-haupt": "1. 测验（可选）：",
        "alert-select-grades": "请至少选择口头分和第一次测验。",
        "alert-select-exam2": "请同时选择第二次测验。",
        "alert-select-target": "请选择目标成绩！",
        "trend-down": "趋势向下。教师通常倾向于给出分数 {grade}。",
        "trend-up": "趋势向上！你很可能会得到分数 {grade}。",
        "schnitt-at": "平均分为 <strong>{schnitt}</strong>。",
        "res-title-calc": "计算出的成绩单结果",
        "res-title-plan": "可能的成绩达成路径",
        "target-label": "目标：",
        "target-unreachable": "❌ 该精确目标在数学上已无法实现。",
        "list-oral": "口头分：",
        "list-exam": " | 测验：",
        "list-exam1": " | 1.测验：",
        "list-exam2": " | 2.测验：",
        "update-start": "已开始检查更新...",
        "update-found": "发现更新！正在重新加载应用...",
        "update-latest": "您的应用已是最新版本！ ✓",
        "update-error": "在服务器上检查更新时发生错误。",
        "update-not-supported": "此浏览器不支持更新。",
        "update-not-ready": "Service Worker 尚未就绪。",
        "btn-close": "关闭"
    },
    hi: {
        "landing-title": "Little Uncle में आपका स्वागत है",
        "dash-tile1-title": "कक्षा वितरण और मैचर",
        "dash-tile1-desc": "अपनी संभावनाओं की गणना करें और अपने बैच से अपना आदर्श मैच खोजें।",
        "dash-tile2-title": "हेसियन ग्रेड कैलकुलेटर",
        "dash-tile2-desc": "अपने विषयों का प्रबंधन करें, सटीक रिपोर्ट कार्ड ग्रेड की गणना करें और लक्ष्य परिणामों की योजना बनाएं।",
        "info-klassen": "यह कैलकुलेटर किसी अन्य व्यक्ति के साथ समान 11वीं कक्षा में आने की संभावना का अनुमान लगाने के लिए जटिल गणितीय प्रणालियों का उपयोग करता है।",
        "info-match": "मैच फाइंडर से आप दो लोगों की तुलना कर सकते हैं और देख सकते हैं कि गणितीय रूप से आपकी संभावना किसके साथ अधिक है।",
        "info-noten": "हेसियन माध्यमिक या उच्चतर माध्यमिक विद्यालय के लिए अपने ग्रेड प्रबंधित करें।",
        "info-fallback": "इस दृश्य के लिए कोई अतिरिक्त जानकारी उपलब्ध नहीं है।",
        "text-hint": "नोट:",
        "text-probability-is": "संभावना है:",
        "text-rule-violation": "नियम का उल्लंघन (0.00%)",
        "text-more-than-10": "0.00% (पुरानी कक्षा के 10 से अधिक लोग!)",
        "text-winner-a": "👑 तुलनात्मक व्यक्ति A बेहतर मैच है!",
        "text-winner-b": "👑 तुलनात्मक व्यक्ति B बेहतर मैच है!",
        "text-tie": "बराबरी या असंभव",
        "text-chance-with": "के साथ संभावना",
        "text-class-sim-1": "आपको संभवतः नई कक्षा में आवंटित किया जाएगा",
        "text-class-sim-2": "वहाँ ठीक 14 लड़के और 14 लड़कियाँ होंगे।",
        "text-class-sim-3": "आपकी पुरानी कक्षा से ठीक {anzahl} लोग आपके साथ होंगे।",
        "noten-title-calc": "ग्रेड कैलकुलेटर",
        "noten-sub-calc": "अपने सटीक हेसियन रिपोर्ट कार्ड ग्रेड की गणना करें।",
        "noten-title-plan": "लक्ष्य ग्रेड योजनाकार",
        "noten-sub-plan": "आपको अभी और किन ग्रेड्स की आवश्यकता है?",
        "btn-calc-label": "ग्रेड की गणना करें",
        "btn-plan-label": "संयोजन की गणना करें",
        "label-work1-calc": "कक्षा परीक्षा:",
        "label-work1-plan": "कक्षा परीक्षा (वैकल्पिक):",
        "label-work1-calc-haupt": "1. कक्षा परीक्षा:",
        "label-work1-plan-haupt": "1. परीक्षा (वैकल्पिक):",
        "alert-select-grades": "कृपया कम से कम मौखिक और पहली परीक्षा का चयन करें।",
        "alert-select-exam2": "कृपया दूसरी परीक्षा का भी चयन करें।",
        "alert-select-target": "कृपया एक लक्ष्य ग्रेड चुनें!",
        "trend-down": "गिरावट का रुझान। शिक्षक आमतौर पर ग्रेड {grade} की ओर प्रवृत्त होते हैं।",
        "trend-up": "बढ़त का रुझान! आपको संभवतः ग्रेड {grade} मिलेगा।",
        "schnitt-at": "औसत <strong>{schnitt}</strong> है।",
        "res-title-calc": "परिकल्पित रिपोर्ट कार्ड परिणाम",
        "res-title-plan": "संभावित ग्रेड मार्ग",
        "target-label": "लक्ष्य: ",
        "target-unreachable": "❌ यह सटीक लक्ष्य गणितीय रूप से अब प्राप्त करना संभव नहीं है।",
        "list-oral": "मौखिक: ",
        "list-exam": " | परीक्षा: ",
        "list-exam1": " | 1.परीक्षा: ",
        "list-exam2": " | 2.परीक्षा: ",
        "update-start": "अपडेट की खोज शुरू हुई...",
        "update-found": "अपडेट मिला! ऐप रीलोड हो रहा है...",
        "update-latest": "आपका ऐप पहले से ही अपडेटेड है! ✓",
        "update-error": "सर्वर पर अपडेट खोजते समय त्रुटि हुई।",
        "update-not-supported": "यह ब्राउज़र अपडेट का समर्थन नहीं करता है।",
        "update-not-ready": "सर्विस वर्कर अभी तैयार नहीं है।",
        "btn-close": "बंद करें"
    },
    sv: {
        "landing-title": "Välkommen till Little Uncle",
        "dash-tile1-title": "Klassfördelning & Matcher",
        "dash-tile1-desc": "Beräkna dina chanser och hitta din perfekta matchning i din årskurs.",
        "dash-tile2-title": "Hessisk Betygsräknare",
        "dash-tile2-desc": "Hantera dina ämnen, beräkna exakta betygsresultat och planera målbetyg.",
        "info-klassen": "Denna räknare använder komplexa matematiska system för att uppskatta sannolikheten att hamna i samma klass i 11:e klass med en annan person.",
        "info-match": "Med Match Finder kan du jämföra två personer för att se med vem dina chanser är matematiskt högre.",
        "info-noten": "Hantera dina betyg för den hessiska grundskolan eller gymnasiet.",
        "info-fallback": "Ingen ytterligare information tillgänglig för denna vy.",
        "text-hint": "Notera:",
        "text-probability-is": "Sannolikheten är:",
        "text-rule-violation": "Regelöverträdelse (0.00%)",
        "text-more-than-10": "0.00% (Över 10 personer från den gamla klassen!)",
        "text-winner-a": "👑 Jämförelseperson A är den bättre matchningen!",
        "text-winner-b": "👑 Jämförelseperson B är den bättre matchningen!",
        "text-tie": "Oavgjort eller omöjligt",
        "text-chance-with": "Chans med",
        "text-class-sim-1": "Du kommer troligen att placeras i den nya klassen",
        "text-class-sim-2": "Det kommer att vara exakt 14 pojkar och 14 flickor.",
        "text-class-sim-3": "Från din gamla klass kommer exakt {anzahl} personer att vara med dig.",
        "noten-title-calc": "Betygsräknaren",
        "noten-sub-calc": "Beräkna ditt exakta hessiska terminsbetyg.",
        "noten-title-plan": "Målbetygsplaneraren",
        "noten-sub-plan": "Vilka betyg behöver du fortfarande?",
        "btn-calc-label": "Beräkna Betyg",
        "btn-plan-label": "Beräkna Kombinationer",
        "label-work1-calc": "Klassprov:",
        "label-work1-plan": "Klassprov (Valfritt):",
        "label-work1-calc-haupt": "1. Klassprov:",
        "label-work1-plan-haupt": "1. Prov (Valfritt):",
        "alert-select-grades": "Välj minst muntligt och det första provet.",
        "alert-select-exam2": "Välj även det andra provet.",
        "alert-select-target": "Välj ett målbetyg!",
        "trend-down": "Nedåtgående trend. Läraren tenderar vanligtvis mot betyg {grade}.",
        "trend-up": "Uppåtgående trend! Du får troligen betyg {grade}.",
        "schnitt-at": "Genomsnittet är <strong>{schnitt}</strong>.",
        "res-title-calc": "Beräknat Terminsresultat",
        "res-title-plan": "Möjliga Betygsvägar",
        "target-label": "Mål: ",
        "target-unreachable": "❌ Detta exakta mål är tyvärr inte längre matematiskt möjligt.",
        "list-oral": "Muntligt: ",
        "list-exam": " | Prov: ",
        "list-exam1": " | 1.Prov: ",
        "list-exam2": " | 2.Prov: ",
        "update-start": "Sökning efter uppdateringar startad...",
        "update-found": "Uppdatering hittad! Appen laddas om...",
        "update-latest": "Din app är redan uppdaterad! ✓",
        "update-error": "Fel vid sökning efter uppdateringar på servern.",
        "update-not-supported": "Uppdateringar stöds inte av denna webbläsare.",
        "update-not-ready": "Service Worker är inte redo än.",
        "btn-close": "Stäng"
    },
    no: {
        "landing-title": "Velkommen til Little Uncle",
        "dash-tile1-title": "Klassefordeling & Matcher",
        "dash-tile1-desc": "Beregn sjansene dine og finn din perfekte match på trinnet ditt.",
        "dash-tile2-title": "Hessisk Karakterkalkulator",
        "dash-tile2-desc": "Administrer fagene dine, beregn nøyaktige terminkarakterer og planlegg måleresultater.",
        "info-klassen": "Denne kalkulatoren bruker komplekse matematiske systemer til å beregne sannsynligheten for å havne i samme 11. klasse som en annen person.",
        "info-match": "Med Match Finder kan du sammenligne to personer for å se hvem sjansene dine er matematisch høyere med.",
        "info-noten": "Administrer karakterene dine for den hessiske ungdomsskolen eller videregående skole.",
        "info-fallback": "Ingen ekstra informasjon tilgjengelig for denne visningen.",
        "text-hint": "Merk:",
        "text-probability-is": "Sannsynligheten er:",
        "text-rule-violation": "Regelbrudd (0.00%)",
        "text-more-than-10": "0.00% (Over 10 personer fra den gamle klassen!)",
        "text-winner-a": "👑 Sammenligningsperson A er den beste matchen!",
        "text-winner-b": "👑 Sammenligningsperson B er den beste matchen!",
        "text-tie": "Uavgjort eller umulig",
        "text-chance-with": "Sjanse med",
        "text-class-sim-1": "Du vil sannsynligvis bli plassert i den nye klassen",
        "text-class-sim-2": "Det vil være nøyaktig 14 gutter og 14 jenter.",
        "text-class-sim-3": "Fra den gamle klassen din vil nøyaktig {anzahl} personer bli med deg.",
        "noten-title-calc": "Karakterkalkulatoren",
        "noten-sub-calc": "Beregn din nøyaktige hessiske terminkarakter.",
        "noten-title-plan": "Målkarakterplanleggeren",
        "noten-sub-plan": "Hvilke karakterer trenger du fortsatt?",
        "btn-calc-label": "Beregn Karakter",
        "btn-plan-label": "Beregn Kombinasjoner",
        "label-work1-calc": "Prøve:",
        "label-work1-plan": "Prøve (Valgfritt):",
        "label-work1-calc-haupt": "1. Prøve:",
        "label-work1-plan-haupt": "1. Prøve (Valgfritt):",
        "alert-select-grades": "Vennligst velg minst muntlig og den første prøven.",
        "alert-select-exam2": "Vennligst velg den andre prøven også.",
        "alert-select-target": "Vennligst velg en målkarakter!",
        "trend-down": "Nedadgående trend. Læreren tenderer vanligvis mot karakteren {grade}.",
        "trend-up": "Oppadgående trend! Du får sannsynligvis karakteren {grade}.",
        "schnitt-at": "Gjennomsnittet er på <strong>{schnitt}</strong>.",
        "res-title-calc": "Beregnet Terminsresultat",
        "res-title-plan": "Mulige Karakterveier",
        "target-label": "Mål: ",
        "target-unreachable": "❌ Dette nøyaktige målet er matematisk sett ikke lenger mulig.",
        "list-oral": "Muntlig: ",
        "list-exam": " | Prøve: ",
        "list-exam1": " | 1.Prøve: ",
        "list-exam2": " | 2.Prøve: ",
        "update-start": "Søk etter oppdateringer startet...",
        "update-found": "Oppdatering funnet! Appen laster på nytt...",
        "update-latest": "Appen din er allerede oppdatert! ✓",
        "update-error": "Feil under søk etter oppdateringer på serveren.",
        "update-not-supported": "Oppdateringer støttes ikke av denne nettleseren.",
        "update-not-ready": "Service Worker er ikke klar ennå.",
        "btn-close": "Lukk"
    },
    da: {
        "landing-title": "Velkommen til Little Uncle",
        "dash-tile1-title": "Klassefordeling & Matcher",
        "dash-tile1-desc": "Beregn dine chancer og find dit perfekte match på din årgang.",
        "dash-tile2-title": "Hessisk Karakterberegner",
        "dash-tile2-desc": "Administrer dine fag, beregn præcise karakterer og planlæg dine måleresultater.",
        "info-klassen": "Denne beregner bruger komplekse matematiske systemer til at estimere sandsynligheden for at ende i samme klasse i 11. klasse med en anden person.",
        "info-match": "Med Match Finder kan du sammenligne to personer for å se, hvem dine chancer er matematisch højere med.",
        "info-noten": "Administrer dine karakterer for den hessiske mellemtrin eller gymnasieoverbygning.",
        "info-fallback": "Ingen yderligere oplysninger tilgængelige for denne visning.",
        "text-hint": "Bemærk:",
        "text-probability-is": "Sandsynligheden er:",
        "text-rule-violation": "Regelbrud (0.00%)",
        "text-more-than-10": "0.00% (Over 10 personer fra den gamle klasse!)",
        "text-winner-a": "👑 Sammenligningsperson A er det bedste match!",
        "text-winner-b": "👑 Sammenligningsperson B er det bedste match!",
        "text-tie": "Uafgjort eller umuligt",
        "text-chance-with": "Chance med",
        "text-class-sim-1": "Du vil sandsynligvis blive placeret i den nye klasse",
        "text-class-sim-2": "Der vil være præcis 14 drenge og 14 piger.",
        "text-class-sim-3": "Fra din gamle klasse vil præcis {anzahl} personer være sammen med dig.",
        "noten-title-calc": "Karakterberegneren",
        "noten-sub-calc": "Beregn din præcise hessiske terminskarakter.",
        "noten-title-plan": "Målkarakterplanlæggeren",
        "noten-sub-plan": "Hvilke karakterer har du stadig brug for?",
        "btn-calc-label": "Beregn Karakter",
        "btn-plan-label": "Beregn Kombinationer",
        "label-work1-calc": "Klassetest:",
        "label-work1-plan": "Klassetest (Valgfri):",
        "label-work1-calc-haupt": "1. Klassetest:",
        "label-work1-plan-haupt": "1. Test (Valgfri):",
        "alert-select-grades": "Vælg mindst mundtligt og den første test.",
        "alert-select-exam2": "Vælg venligst også den anden test.",
        "alert-select-target": "Vælg en målkarakter!",
        "trend-down": "Nedadgående tendens. Læreren tenderer normalt mod karakteren {grade}.",
        "trend-up": "Odadgående tendens! Du får sandsynligvis karakteren {grade}.",
        "schnitt-at": "Gennemsnittet er på <strong>{schnitt}</strong>.",
        "res-title-calc": "Beregnet Terminsresultat",
        "res-title-plan": "Mulige Karakterveje",
        "target-label": "Mål: ",
        "target-unreachable": "❌ Dette præcise mål er matematisk set ikke længere muligt.",
        "list-oral": "Mundtligt: ",
        "list-exam": " | Test: ",
        "list-exam1": " | 1.Test: ",
        "list-exam2": " | 2.Test: ",
        "update-start": "Søgning efter opdateringer startet...",
        "update-found": "Opdatering fundet! Appen genindlæses...",
        "update-latest": "Din app er allerede opdateret! ✓",
        "update-error": "Fejl under søgning efter opdateringer på serveren.",
        "update-not-supported": "Opdateringer understøttes ikke af denne browser.",
        "update-not-ready": "Service Worker er ikke klar endnu.",
        "btn-close": "Luk"
    },
    fi: {
        "landing-title": "Tervetuloa Little Uncleen",
        "dash-tile1-title": "Luokkajako & Matcher",
        "dash-tile1-desc": "Laske mahdollisuutesi ja löydä täydellinen kumppani luokaltasi.",
        "dash-tile2-title": "Hessenin Arvosanalaskuri",
        "dash-tile2-desc": "Hallitse aineitasi, laske tarkat todistuksen arvosanat ja suunnittele tavoitteesi.",
        "info-klassen": "Tämä laskuri käyttää monimutkaisia matemaattisia järjestelmiä arvioidakseen todennäköisyyden päätyä samalle 11. luokalle toisen henkilön kanssa.",
        "info-match": "Match Finderin avulla voit vertailla kahta henkilöä nähdäksesi, kenen kanssa mahdollisuutesi ovat matemaattisesti korkeammat.",
        "info-noten": "Hallitse arvosanojasi Hessenin yläkoulussa tai lukiossa.",
        "info-fallback": "Tälle näkymälle ei ole saatavilla lisätietoja.",
        "text-hint": "Huomautus:",
        "text-probability-is": "Todennäköisyys on:",
        "text-rule-violation": "Sääntörikkomus (0.00%)",
        "text-more-than-10": "0.00% (Yli 10 henkilöä vanhalta luokalta!)",
        "text-winner-a": "👑 Vertailuhenkilö A on parempi kumppani!",
        "text-winner-b": "👑 Vertailuhenkilö B on parempi kumppani!",
        "text-tie": "Tasapeli tai mahdoton",
        "text-chance-with": "Mahdollisuus henkilön kanssa",
        "text-class-sim-1": "Sinut sijoitetaan todennäköisesti uudelle luokalle",
        "text-class-sim-2": "Siellä tulee olemaan tasan 14 poikaa ja 14 tyttöä.",
        "text-class-sim-3": "Vanhalta luokaltasi tulee tasan {anzahl} henkilöä kanssasi.",
        "noten-title-calc": "Arvosanalaskuri",
        "noten-sub-calc": "Laske tarkka Hessenin todistuksen arvosanasi.",
        "noten-title-plan": "Tavoitearvosanan Suunnittelija",
        "noten-sub-plan": "Mitä arvosanoja tarvitset vielä?",
        "btn-calc-label": "Laske Arvosana",
        "btn-plan-label": "Laske Yhdistelmät",
        "label-work1-calc": "Koe:",
        "label-work1-plan": "Koe (Valinnainen):",
        "label-work1-calc-haupt": "1. Koe:",
        "label-work1-plan-haupt": "1. Koe (Valinnainen):",
        "alert-select-grades": "Valitse vähintään suullinen arvosana ja ensimmäinen koe.",
        "alert-select-exam2": "Valitse myös toinen koe.",
        "alert-select-target": "Valitse tavoitearvosana!",
        "trend-down": "Laskeva suuntaus. Opettaja taipuu yleensä arvosanaan {grade}.",
        "trend-up": "Nouseva suuntaus! Saat todennäköisesti arvosanan {grade}.",
        "schnitt-at": "Keskiarvo on <strong>{schnitt}</strong>.",
        "res-title-calc": "Laskettu Todistuksen Tulos",
        "res-title-plan": "Mahdolliset Arvosanapolut",
        "target-label": "Tavoite: ",
        "target-unreachable": "❌ Tämä tarkka tavoite ei ole enää matemaattisesti saavutettavissa.",
        "list-oral": "Suullinen: ",
        "list-exam": " | Koe: ",
        "list-exam1": " | 1.Koe: ",
        "list-exam2": " | 2.Koe: ",
        "update-start": "Päivitysten haku aloitettu...",
        "update-found": "Päivitys löytynyt! Sovellusta ladataan uudelleen...",
        "update-latest": "Sovelluksesi on jo ajan tasalla! ✓",
        "update-error": "Virhe haettaessa päivityksiä palvelimelta.",
        "update-not-supported": "Tämä selain ei tue päivityksiä.",
        "update-not-ready": "Service Worker ei ole vielä valmis.",
        "btn-close": "Sulje"
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
    
    // Fehlerabsicherung, falls das Modul auf bestimmten Seiten nicht existiert
    try { 
        initStundenplan(); 
    } catch(e) { 
        console.error("Stundenplan konnte nicht initialisiert werden:", e); 
    }
    
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone;

    if (isStandalone) {
        if (landing) { landing.style.display = 'none'; landing.classList.remove('active'); }
        if (dash) { dash.style.display = 'block'; dash.classList.add('active'); }
    } else {
        if (landing) { landing.style.display = 'block'; landing.classList.add('active'); }
        if (dash) { dash.style.display = 'none'; dash.classList.remove('active'); }
        if (isIos) {
            if (iosHint) iosHint.style.display = 'block';
            if (installBtn) installBtn.style.display = 'none';
        }
    }

    if (typeof setStufe === 'function') {
        setStufe('mittel');
    }

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Installation: ${outcome}`);
                deferredPrompt = null;
                installBtn.style.display = 'none';
            } else {
                switchToRealAppMode();
            }
        });
    }

    const savedLang = localStorage.getItem('littleUncle_lang') || 'de';
    const savedRegion = localStorage.getItem('littleUncle_region');
    
    const langSelect = document.getElementById('settings-lang');
    if (langSelect) { langSelect.value = savedLang; }
    
    const regionSelect = document.getElementById('settings-region');
    if (savedRegion && regionSelect) { regionSelect.value = savedRegion; }
    
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
    if (landing) { landing.style.display = 'none'; landing.classList.remove('active'); }
    const dash = document.getElementById('dashboard-page');
    if (dash) { dash.style.display = 'block'; dash.classList.add('active'); }
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
        const langSelect = document.getElementById('settings-lang');
        const regionSelect = document.getElementById('settings-region');
        
        const langVal = langSelect ? langSelect.value : 'de';
        const regionVal = regionSelect ? regionSelect.value : '';
        
        localStorage.setItem('littleUncle_lang', langVal);
        localStorage.setItem('littleUncle_region', regionVal);
        applyLanguage(langVal);
    }
}

// ==========================================
// NAVIGATIONSSYSTEM
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
    
    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) infoBtn.style.visibility = 'hidden';
    
    toggleInfo(false);
}
window.goBackToDashboard = goBackToDashboard;

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
    const meinGeschlecht = document.getElementById("meinGeschlecht")?.value || "M";
    const meineKlasse = document.getElementById("meineKlasse")?.value || "10A";
    const zielGeschlecht = document.getElementById("zielGeschlecht")?.value || "F";
    const zielKlasse = document.getElementById("zielKlasse")?.value || "10A";

    const meineWuensche = [];
    const w1_G = document.getElementById("wunsch1_G")?.value;
    if (w1_G) meineWuensche.push({ G: w1_G, klasse: document.getElementById("wunsch1_klasse")?.value });
    const w2_G = document.getElementById("wunsch2_G")?.value;
    if (w2_G) meineWuensche.push({ G: w2_G, klasse: document.getElementById("wunsch2_klasse")?.value });

    const zielClique = [];
    const c1_G = document.getElementById("clique1_G")?.value;
    if (c1_G) zielClique.push({ G: c1_G, klasse: document.getElementById("clique1_klasse")?.value });
    const c2_G = document.getElementById("clique2_G")?.value;
    if (c2_G) zielClique.push({ G: c2_G, klasse: document.getElementById("clique2_klasse")?.value });

    const ergebnis = berechneKernWahrscheinlichkeit(meinGeschlecht, meineKlasse, meineWuensche, zielGeschlecht, zielKlasse, zielClique);

    const resBox = document.getElementById("rechner-result-box");
    const resVal = document.getElementById("rechner-result-value");
    const resTxt = document.getElementById("rechner-result-text");
    const simBox = document.getElementById("rechner-simulator-box");

    if (!resBox || !resVal || !resTxt) return;

    if (ergebnis < 0) {
        resTxt.innerText = "Hinweis:";
        resVal.innerText = "0.00% (Über 10 Personen aus alter Klasse!)";
        resVal.style.color = "#dc2626";
        if (simBox) simBox.style.display = "none";
    } else {
        resTxt.innerText = "Die Wahrscheinlichkeit beträgt:";
        resVal.innerText = (ergebnis * 100).toFixed(2) + "%";
        resVal.style.color = "var(--cyber-cyan)";

        let anzahlAlte = 1;
        meineWuensche.forEach(w => { if(w.klasse === meineKlasse) anzahlAlte++; });
        if(zielKlasse === meineKlasse) anzahlAlte++;
        zielClique.forEach(c => { if(zielKlasse === meineKlasse && c.klasse === meineKlasse) anzahlAlte++; });

        const neueKlassen = ["11A", "11B", "11C", "11D", "11E"];
        const simContent = document.getElementById("rechner-simulator-content");
        if (simContent) {
            simContent.innerHTML = 
                `Du wirst voraussichtlich in die neue Klasse <span style="color:var(--space-purple-glow); font-weight:700;">${neueKlassen[Math.floor(Math.random()*5)]}</span> kommen.<br>` +
                `Dort werden exakt <strong>14 Jungs</strong> und <strong>14 Mädchen</strong> sein.<br>` +
                `Von deiner alten Klasse (<strong>${meineKlasse.toUpperCase()}</strong>) kommen genau <strong>${anzahlAlte} Personen</strong> mit dir.`;
        }
        if (simBox) simBox.style.display = "block";
    }
    resBox.style.display = "block";
}

function berechneMatchpartner() {
    const meinG = document.getElementById("matchMeinG")?.value || "M";
    const meineKlasse = document.getElementById("matchMeineKlasse")?.value || "10A";

    const persA_G = document.getElementById("persA_G")?.value || "F";
    const persA_klasse = document.getElementById("persA_klasse")?.value || "10A";
    const cliqueA = [];
    const cA_G = document.getElementById("persAClique_G")?.value;
    if (cA_G) cliqueA.push({ G: cA_G, klasse: document.getElementById("persAClique_klasse")?.value });

    const persB_G = document.getElementById("persB_G")?.value || "F";
    const persB_klasse = document.getElementById("persB_klasse")?.value || "10B";
    const cliqueB = [];
    const cB_G = document.getElementById("persBClique_G")?.value;
    if (cB_G) cliqueB.push({ G: cB_G, klasse: document.getElementById("persBClique_klasse")?.value });

    let ergA = berechneKernWahrscheinlichkeit(meinG, meineKlasse, [], persA_G, persA_klasse, cliqueA);
    let ergB = berechneKernWahrscheinlichkeit(meinG, meineKlasse, [], persB_G, persB_klasse, cliqueB);

    const matchBox = document.getElementById("match-result-box");
    const matchContent = document.getElementById("match-result-content");

    if (!matchBox || !matchContent) return;

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
    const fachTyp = document.getElementById("fachTyp")?.value || "haupt";
    const muendlich = document.getElementById("noteMuendlich")?.value || "";
    const arbeit1 = document.getElementById("noteArbeit1")?.value || "";
    const vorherigeRaw = document.getElementById("vorherigeNote")?.value || "";

    if (muendlich === "" || arbeit1 === "") { alert("Bitte wähle mindestens mündlich und die erste Arbeit."); return; }
    const mVal = parseFloat(muendlich); const a1Val = parseFloat(arbeit1); let schnitt = 0;

    if (fachTyp === "haupt") {
        const arbeit2 = document.getElementById("noteArbeit2")?.value || "";
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
    if(document.getElementById("res-card-title")) document.getElementById("res-card-title").innerText = "Errechnetes Zeugnis-Ergebnis";
    if(document.getElementById("gradeOutput")) document.getElementById("gradeOutput").innerText = endanzeige;
    if(document.getElementById("descOutput")) document.getElementById("descOutput").innerHTML = hinweis;
    if(document.getElementById("empfehlungOutput")) document.getElementById("empfehlungOutput").style.display = "none";
    if(document.getElementById("feedbackCard")) document.getElementById("feedbackCard").style.display = "block";
}

function berechneWunschKombinationen() {
    const wunsch = document.getElementById("wunschNote")?.value || "";
    if(wunsch === "") { alert("Bitte wähle eine Wunschnote aus!"); return; }
    const zielDezimal = parseFloat(wunsch);
    const wunschSelect = document.getElementById("wunschNote");
    const wunschText = wunschSelect ? wunschSelect.options[wunschSelect.selectedIndex].text : "";
    const fachTyp = document.getElementById("fachTyp")?.value || "haupt";
    const mSel = document.getElementById("noteMuendlich")?.value || "";
    const a1Sel = document.getElementById("noteArbeit1")?.value || "";
    const a2Sel = document.getElementById("noteArbeit2")?.value || "";

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

    if(document.getElementById("res-card-title")) document.getElementById("res-card-title").innerText = "Mögliche Noten-Wege";
    if(gradeOut) gradeOut.innerText = "Ziel: " + wunschText;

    if(guetigeKombis.length === 0) {
        if(descOut) descOut.innerHTML = "❌ Dieses exakte Ziel ist mathematisch leider nicht mehr erreichbar.";
        styleFeedbackCard(5);
    } else {
        styleFeedbackCard(2);
        let html = "<ul>";
        guetigeKombis.slice(0, 5).forEach(k => {
            html += fachTyp === "haupt" ? `<li>Mündlich: <strong>${k.m}</strong> | 1.Arbeit: <strong>${k.a1}</strong> | 2.Arbeit: <strong>${k.a2}</strong></li>` : `<li>Mündlich: <strong>${k.m}</strong> | Arbeit: <strong>${k.a1}</strong></li>`;
        });
        html += "</ul>"; 
        if(descOut) descOut.innerHTML = html;
    }
    if(card) card.style.display = "block";
}

function styleFeedbackCard(kat) {
    const gradeOut = document.getElementById("gradeOutput");
    if (kat <= 2) {
        document.documentElement.style.setProperty('--status-bg', 'rgba(16, 185, 129, 0.08)');
        document.documentElement.style.setProperty('--status-border', 'rgba(16, 185, 129, 0.3)');
        document.documentElement.style.setProperty('--status-text', '#34d399');
        if(gradeOut) gradeOut.style.color = "#34d399";
    } else if (kat === 3 || kat === 4) {
        document.documentElement.style.setProperty('--status-bg', 'rgba(99, 102, 241, 0.08)');
        document.documentElement.style.setProperty('--status-border', 'rgba(99, 102, 241, 0.3)');
        document.documentElement.style.setProperty('--status-text', '#a5b4fc');
        if(gradeOut) gradeOut.style.color = "var(--cyber-cyan)";
    } else {
        document.documentElement.style.setProperty('--status-bg', 'rgba(239, 68, 68, 0.08)');
        document.documentElement.style.setProperty('--status-border', 'rgba(239, 68, 68, 0.3)');
        document.documentElement.style.setProperty('--status-text', '#f87171');
        if(gradeOut) gradeOut.style.color = "#f87171";
    }
}

// ==========================================
// AUTOMATISCHES HINTERGRUND-UPDATE-SYSTEM
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
            .then((registration) => {
                console.log('Service Worker erfolgreich registriert.');
                registration.update();

                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    if (installingWorker == null) return;

                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('Neuer Code erkannt! SKIP_WAITING wird gesendet...');
                            installingWorker.postMessage({ type: 'SKIP_WAITING' });
                            alert('App hat ein Update gefunden und lädt jetzt neu!');
                        }
                    };
                };
            })
            .catch((error) => {
                console.error('Fehler beim Service Worker Update-Check:', error);
            });
    });
}

let isRefreshing = false;
navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!isRefreshing) {
        isRefreshing = true;
        window.location.reload(true);
    }
});
// ==========================================
// MANUELLES UPDATE-TRIGGERSYSTEM (HTML-ABGLEICH)
// ==========================================
window.checkForUpdatesManual = function() {
    // Hier holen wir uns die exakten IDs aus deinem HTML!
    const popup = document.getElementById('manual-update-popup');
    const text = document.getElementById('update-modal-text');
    const btn = document.getElementById('update-modal-btn');

    // 1. Popup sofort anzeigen & Starttext setzen
    if (popup) popup.style.display = 'flex'; // 'flex' passt perfekt zum CSS-Overlay
    if (text) text.innerText = 'Suche nach Updates gestartet...';
    if (btn) btn.style.display = 'none';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
            .then(() => navigator.serviceWorker.ready)
            .then(registration => {
                return registration.update().then(() => {
                    // FALL 1: Ein neues Update wartet auf Aktivierung
                    if (registration.waiting) {
                        if (text) text.innerText = 'Update gefunden! Die App wird neu geladen...';
                        if (btn) btn.style.display = 'none';
                        
                        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                        
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 1200);
                    } 
                    // FALL 2: Kein Update vorhanden
                    else {
                        if (text) text.innerText = 'Deine App ist bereits auf dem neuesten Stand! ✓';
                        if (btn) {
                            btn.innerText = 'Schließen';
                            btn.style.display = 'block';
                            btn.onclick = () => {
                                if (popup) popup.style.display = 'none';
                            };
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Fehler bei manuellen Update-Check:', error);
                if (text) text.innerText = 'Fehler bei der Update-Suche auf dem Server.';
                if (btn) {
                    btn.innerText = 'Schließen';
                    btn.style.display = 'block';
                    btn.onclick = () => {
                        if (popup) popup.style.display = 'none';
                    };
                }
            });
    } else {
        if (text) text.innerText = 'Updates werden von diesem Browser nicht unterstützt.';
        if (btn) {
            btn.innerText = 'Schließen';
            btn.style.display = 'block';
            btn.onclick = () => {
                if (popup) popup.style.display = 'none';
            };
        }
    }
};

// ==========================================
// ERWEITERUNGS-SYSTEM
// ==========================================
function erweiterungLaden(ordnerName) {
    import(`../Extensions/${ordnerName}/extension.js`)
        .then(modul => {
            if(modul && modul.starten) modul.starten();
        })
        .catch(fehler => {
            console.log(`Hinweis: Die Erweiterung "${ordnerName}" ist nicht aktiv oder fehlt.`);
        });
}

erweiterungLaden('Extension1');

// Globale Bereitstellung
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

