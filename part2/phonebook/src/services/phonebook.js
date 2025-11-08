import axios from "axios";
const baseUrl = "/api/persons";

const createPhonebook = (phonebook) => {
  return axios
    .post(baseUrl, phonebook)
    .then((response) => {
      return { status: response.status, data: response.data };
    })
    .catch((error) => {
      return {
        status: error.response.status,
        message: error.response.data.error,
      };
    });
};
const getPhonebooks = () => {
  return axios.get(baseUrl).then((response) => response.data);
};
const deletePhonebook = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
};
const updatePhonebook = (id, phonebook) => {
  return axios
    .put(`${baseUrl}/${id}`, phonebook)
    .then((response) => response.data);
};

export default {
  createPhonebook,
  getPhonebooks,
  deletePhonebook,
  updatePhonebook,
};
