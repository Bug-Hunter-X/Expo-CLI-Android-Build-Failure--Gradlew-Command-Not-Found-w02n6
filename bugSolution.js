//This solution first checks if gradlew is present and executable, then handles different scenarios of missing gradlew and permission problems
const checkGradlew = require('./checkGradlew');

async function buildAndroidApp() {
  try {
    await checkGradlew();
    //Proceed with the expo build process
    console.log('Expo build process starting...');
    //Add expo build android command here...
    console.log('Expo build process completed successfully!');
  } catch (error) {
    console.error('Error building Android app:', error);
  }
}

buildAndroidApp();

//checkGradlew.js
const { exec } = require('child_process');
const fs = require('fs');

async function checkGradlew() {
  //Check if gradlew exists
  const gradlewPath = './android/gradlew';
  if(!fs.existsSync(gradlewPath)) {
    throw new Error('gradlew not found in android directory. Please run expo prebuild');
  }

  //Check if gradlew is executable
  const isExecutable = fs.statSync(gradlewPath).mode & 0o111; // Check execution bit
  if (!isExecutable) {
    throw new Error('gradlew is not executable. Please add executable permission using chmod +x ./android/gradlew');
  }

  //Check permission
  try{
    await execGradlew();
  } catch(err) {
    if(err.message.includes('Permission denied')) {
      throw new Error('Permission denied. Please check your user permissions or run expo prebuild')
    }
    throw err;
  }
}

async function execGradlew() {
  return new Promise((resolve, reject) => {
    exec('./android/gradlew -v', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        console.log('Gradlew version check successful:', stdout);
        resolve();
      }
    });
  });
}
module.exports = checkGradlew