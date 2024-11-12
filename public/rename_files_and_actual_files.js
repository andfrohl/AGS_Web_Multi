const fs = require('fs');
const path = require('path');

// Read the HTML file
fs.readFile('produkte.html', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    let hrefMatches = [];
    let srcMatches = [];

    // Capture href matches
    data = data.replace(/href="img\/gall\/([^"]+)_1920\.jpg"/g, (match, p1) => {
        hrefMatches.push(p1);
        return match; // Keep the original match
    });

    // Capture src matches
    data = data.replace(/src="img\/gall\/([^"]+)_280\.jpg"/g, (match, p1) => {
        srcMatches.push(p1);
        return match; // Keep the original match
    });

    // Ensure unique indices for renaming
    let index = 28;

    // Rename actual files in the directory based on captured matches
    const renameFilesBasedOnMatches = (dir, matches, isThumb) => {
        matches.forEach(match => {
            let oldFilePath = path.join(dir, `${match}${isThumb ? '_280.jpg' : '_1920.jpg'}`);
            let newFileName = isThumb ? `img_produkt_${index}_thumb.jpg` : `img_produkt_${index}_1920.jpg`;
            let newFilePath = path.join(dir, newFileName);
            if (fs.existsSync(oldFilePath)) {
                fs.renameSync(oldFilePath, newFilePath);
                console.log(`Renamed: ${oldFilePath} -> ${newFilePath}`);
            } else {
                console.warn(`File not found: ${oldFilePath}`);
            }
            index++;
        });
    };

    // Rename files based on matches
    renameFilesBasedOnMatches('img/gall', hrefMatches, false);
    index = 28; // Reset index for thumbs
    renameFilesBasedOnMatches('img/gall', srcMatches, true);

    // Update HTML references based on new file names
    let htmlIndex = 28;
    data = data.replace(/href="img\/gall\/([^"]+)_1920\.jpg"/g, (match, p1) => {
        return `href="img/gall/img_produkt_${htmlIndex++}_1920.jpg"`;
    });
    htmlIndex = 28; // Reset index for thumbs
    data = data.replace(/src="img\/gall\/([^"]+)_280\.jpg"/g, (match, p1) => {
        return `src="img/gall/img_produkt_${htmlIndex++}_thumb.jpg"`;
    });

    // Write the updated content back to the HTML file
    fs.writeFile('produkte.html', data, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('File references in HTML updated.');
    });
});
