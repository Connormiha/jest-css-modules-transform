const {execSync} = require('child_process');

console.log('Platform: ', process.platform);

if (process.platform.startsWith('win')) {
    execSync('npm run test:windows', {stdio: 'inherit'});
} else {
    execSync('npm run test:unix', {stdio: 'inherit'});
}
