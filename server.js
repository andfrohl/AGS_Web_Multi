const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));

// Middleware, um den Content-Type zu setzen
app.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
        res.header('Content-Type', 'text/css');
    } else if (req.url.endsWith('.js')) {
        res.header('Content-Type', 'application/javascript');
    }
    next();
});

function loadTranslations(lang, page) {
    const generalFilePath = path.join(__dirname, 'public', 'locales', `lang_${lang}.json`);
    const pageFilePath = path.join(__dirname, 'public', 'locales', `${lang}_${page}.json`);

    const generalTranslations = fs.existsSync(generalFilePath) ? JSON.parse(fs.readFileSync(generalFilePath, 'utf8')) : {};
    const pageTranslations = fs.existsSync(pageFilePath) ? JSON.parse(fs.readFileSync(pageFilePath, 'utf8')) : {};

    return { ...generalTranslations, ...pageTranslations };
}

app.get('/:lang/:page', (req, res) => {
    const { lang, page } = req.params;
    const translations = loadTranslations(lang, page);
    res.render(page, { lang, translations });
});

app.get('/', (req, res) => {
    const lang = req.query.lang || 'de';
    res.redirect(`/${lang}/index`);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
