const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
  dataFilePath = filePath;
};

const findAll = (title) => {
  const tariffs = fileService.readData(dataFilePath);
  if (title) {
    return tariffs.filter(t =>
      t.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  return tariffs;
};

const findOne = (id) => {
  const tariffs = fileService.readData(dataFilePath);
  return tariffs.find(t => t.id === id);
};

const create = (data) => {
  const tariffs = fileService.readData(dataFilePath);
  const newId = tariffs.length > 0
    ? Math.max(...tariffs.map(t => t.id)) + 1
    : 1;
  const newTariff = { id: newId, ...data };
  tariffs.push(newTariff);
  fileService.writeData(dataFilePath, tariffs);
  return newTariff;
};

const update = (id, data) => {
  const tariffs = fileService.readData(dataFilePath);
  const index = tariffs.findIndex(t => t.id === id);
  if (index === -1) return null;
  tariffs[index] = { ...tariffs[index], ...data };
  fileService.writeData(dataFilePath, tariffs);
  return tariffs[index];
};

const remove = (id) => {
  const tariffs = fileService.readData(dataFilePath);
  const filtered = tariffs.filter(t => t.id !== id);
  if (filtered.length === tariffs.length) return false;
  fileService.writeData(dataFilePath, filtered);
  return true;
};

module.exports = { init, findAll, findOne, create, update, remove };