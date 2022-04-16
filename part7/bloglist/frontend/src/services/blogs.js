import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;
let config = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  config = {
    headers: { Authorization: token },
  };
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject, config);
  return request.then((response) => response.data);
};

const update = (newObject) => {
  const request = axios.put(`${baseUrl}/${newObject.id}`, newObject, config);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`, config);
  return request.then((response) => response.data);
};

const exportedObject = { setToken, getAll, create, update, remove };
export default exportedObject;
