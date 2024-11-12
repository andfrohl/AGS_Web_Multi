function loadTranslations(lang, page) {
    // Füge Fade-Out-Effekt hinzu
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.classList.add('fade-out');
    });

    setTimeout(() => {
        fetch(`/locales/lang_${lang}.json`)
            .then(response => response.json())
            .then(generalTranslations => {
                fetch(`/locales/${lang}_${page}.json`)
                    .then(response => response.json())
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

function changeLanguage(lang, page) {
    document.documentElement.lang = lang;
    loadTranslations(lang, page);
    history.pushState({}, '', `/${lang}/${page}.html`);
}

document.addEventListener('DOMContentLoaded', () => {
    const lang = document.documentElement.lang || 'de';
    const page = window.location.pathname.split('/').pop().replace('.html', '');
    loadTranslations(lang, page);
});

function toggleDropdown() {
    document.getElementById('dropdown-content').classList.toggle('show');
}

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
