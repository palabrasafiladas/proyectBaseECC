// axios-config.js
import axios from 'axios';
import userConfig from './user-config';

const axiosInstance = axios.create({
  // Configuramos la URL base de la API 
baseURL : 'http://127.0.0.1:8086/K2BAquaGlassAppWeb/api',

});

// Agrega encabezados a todas las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    // Agrega encabezados comunes a todas las solicitudes
    config.headers['Content-Type'] = 'application/json';
    config.headers['Authorization'] = 'Bearer ' + userConfig.obtenerUsuarioVariable('token');
    config.headers['user'] = userConfig.obtenerUsuarioVariable('user');
    config.headers['sesion'] = userConfig.obtenerUsuarioVariable('sesion');

    // // Se pueden agegar mas encabezados de ser necesario
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;