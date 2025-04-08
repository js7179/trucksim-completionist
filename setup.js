/* eslint-disable */
const fs = require('fs');
const path = require('path');

// Copy over ATS and ETS2 achievements
const targetDirectory = path.join(__dirname, 'frontend', 'public', 'assets', 'achdata');
if(!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory);
}
const ACHIEVEMENT_FILES = ['ets2_achievements.json', 'ats_achievements.json'];
ACHIEVEMENT_FILES.forEach((filename) => {
    fs.copyFileSync(
        path.join(__dirname, `common/data/${filename}`),
        path.join(targetDirectory, filename)
    );
});
