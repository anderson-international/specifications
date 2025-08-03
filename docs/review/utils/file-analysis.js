const fs = require('fs');
const path = require('path');

function getFileType(filePath) {
  const fileName = path.basename(filePath);
  const dirName = path.dirname(filePath);
  
  if (dirName.includes('components')) return 'components';
  if (dirName.includes('hooks')) return 'hooks';
  if (dirName.includes('types')) return 'types';
  if (dirName.includes('services')) return 'services';
  if (dirName.includes('repositories')) return 'repositories';
  if (dirName.includes('app') && fileName.includes('route')) return 'routes';
  if (dirName.includes('lib') || dirName.includes('utils')) return 'utils';
  
  return 'components'; // default
}

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

module.exports = {
  getFileType,
  countLines
};
