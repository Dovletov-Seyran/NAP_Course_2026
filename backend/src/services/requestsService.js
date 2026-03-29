const fileService = require("./fileService");

let dataFilePath;

const init = (filePath) => {
  dataFilePath = filePath;
};

const create = (data) => {
  const requests = fileService.readData(dataFilePath);
  const newId =
    requests.length > 0 ? Math.max(...requests.map((r) => r.id)) + 1 : 1;
  const newRequest = {
    id: newId,
    ...data,
    createdAt: new Date().toISOString(),
  };
  requests.push(newRequest);
  fileService.writeData(dataFilePath, requests);
  return newRequest;
};

const findAll = () => {
  return fileService.readData(dataFilePath);
};

module.exports = { init, create, findAll };
