// user-config.js
export default {
  configurarUsuario(configuracion) {
    if (typeof configuracion !== 'object' || configuracion === null) {
      throw new Error('La configuracion debe ser un objeto.');
    }

    Object.keys(configuracion).forEach(key => {
      sessionStorage.setItem(key, JSON.stringify(configuracion[key]));
    });
  },

  obtenerUsuarioVariable(nombreVariable) {
    const valor = sessionStorage.getItem(nombreVariable);
    return valor ? JSON.parse(valor) : null;
  },
  desloguearUsuario(){
    sessionStorage.removeItem('token'); 
  }
};