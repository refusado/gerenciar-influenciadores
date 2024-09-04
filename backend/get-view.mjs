import { copy, pathExists } from 'fs-extra';

const frontendBuildPath = '../frontend/build';
const outputPath = './dist/web-app';

async function copyFrontendBuild() {
  try {
    const doesSourceExist = await pathExists(frontendBuildPath);
    if (!doesSourceExist) {
      throw new Error(
        `Frontend bulid path "${frontendBuildPath}" does not exist.`
      );
    }

    await copy(frontendBuildPath, outputPath);
    console.log(`Frontend build copied to ${outputPath}`);
  } catch (error) {
    console.error('Failed to copy frontend build:', error.message);
    if (error.code === 'ENOENT') {
      console.error('COPYING ERROR: One of the paths does not exist.');
    } else if (error.code === 'EACCES') {
      console.error('COPYING ERROR: Permission denied while copying files.');
    } else {
      console.error('An unknown error occurred while getting web app build.');
    }
  }
}

copyFrontendBuild();
