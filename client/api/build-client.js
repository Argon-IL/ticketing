import axios from 'axios';

const buildClient = ({ req }, service, port) => {
  if (typeof window === 'undefined') {
    //
    return axios.create({
      baseURL: 'http://' + service + ':' + port,
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: '/',
    });
    //
  }
};

export default buildClient;
