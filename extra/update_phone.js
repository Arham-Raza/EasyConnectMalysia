const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            // skip .git and node_modules
            if (f !== '.git' && f !== 'node_modules' && f !== 'qa-screens' && f !== 'site-qa') {
                walkDir(dirPath, callback);
            }
        } else {
            callback(path.join(dir, f));
        }
    });
}

walkDir('.', function(filePath) {
    if (filePath.endsWith('.html') || filePath.endsWith('.txt') || filePath.endsWith('.py')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content
            .replace(/\+6011 2090 6561/g, '+60 13-532 2733')
            .replace(/\+601120906561/g, '+60135322733')
            .replace(/wa\.me\/601120906561/g, 'wa.me/60135322733')
            .replace(/tel:\+601120906561/g, 'tel:+60135322733');
            
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated ' + filePath);
        }
    }
});
