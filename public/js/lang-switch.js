function loadTranslations(lang, page) {
    // Füge Fade-Out-Effekt hinzu
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.classList.add('fade-out');
    });

    setTimeout(() => {
        fetch(`/locales/lang_${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(generalTranslations => {
                fetch(`/locales/${lang}_${page}.json`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(pageTranslations => {
                        const translations = { ...generalTranslations, ...pageTranslations };
                        document.querySelectorAll('[data-i18n]').forEach(el => {
                            const key = el.getAttribute('data-i18n');
                            el.innerHTML = translations[key] || `undefined (${key})`;
                        });

                        // Füge Fade-In-Effekt hinzu
                        document.querySelectorAll('[data-i18n]').forEach(el => {
                            el.classList.remove('fade-out');
                            el.classList.add('fade-in');
                        });
                    })
                    .catch(error => console.error('Error loading page translations:', error));
            })
            .catch(error => console.error('Error loading general translations:', error));
    }, 500);
}

console.log("lang-switch.js geladen");

function toggleDropdown() {
    document.getElementById('dropdown-content').classList.toggle('show');
    console.log("Dropdown-Toggle aufgerufen"); // Zu Debugging-Zwecken hinzufügen
}

// Schließen des Dropdown-Menüs beim Klicken außerhalb
window.onclick = function(event) {
    if (!event.target.matches('.language-button')) {
        const dropdowns = document.getElementsByClassName('dropdown-content');
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM vollständig geladen");

    const button = document.querySelector('.language-button');
    if (button) {
        button.addEventListener('click', () => {
            console.log("Language-Button geklickt");
        });
    }

    const dropdown = document.getElementById('dropdown-content');
    if (dropdown) {
        dropdown.addEventListener('click', () => {
            console.log("Dropdown-Content geklickt");
        });
    }
});

function changeLanguage(lang, page) {
    console.log("Sprache wechseln zu:", lang, page);  // Zum Debugging hinzufügen
    document.documentElement.lang = lang;
    loadTranslations(lang, page);
    history.pushState({}, '', `/${lang}/${page}.html`);
}

function loadTranslations(lang, page) {
    // Beispielhafte Funktion für das Laden der Übersetzungen
    fetch(`/locales/lang_${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(generalTranslations => {
            fetch(`/locales/${lang}_${page}.json`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(pageTranslations => {
                    const translations = { ...generalTranslations, ...pageTranslations };
                    document.querySelectorAll('[data-i18n]').forEach(el => {
                        const key = el.getAttribute('data-i18n');
                        el.innerHTML = translations[key] || `undefined (${key})`;
                    });
                })
                .catch(error => console.error('Error loading page translations:', error));
        })
        .catch(error => console.error('Error loading general translations:', error));
}

// Event-Listener hinzufügen, um sicherzustellen, dass die JS-Datei korrekt geladen ist
document.addEventListener('DOMContentLoaded', () => {
    console.log("JavaScript geladen und DOM vollständig");
});
