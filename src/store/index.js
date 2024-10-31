import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
const store = createStore({
  state: {
    productos: [],
    carrito: {},

  },
  mutations: {
    setProducto(state, payload) {
      state.productos = payload;
    },
    setCarrito(state, payload) {
      state.carrito[payload.id] = payload;
    },
    eliminarDelCarrito(state, productId) {
      // Eliminar el producto del carrito
      if (state.carrito.hasOwnProperty(productId)) {
        // Eliminar la propiedad del objeto carrito
        delete state.carrito[productId];
      }
    },
 
  },
  actions: {
    cambiarCantidad({ commit, state}, payload) {
      commit('setCarrito', payload);
    },
    
    //vamos a aumentar su cantidad siempre y cuando exista el producto
    //producto lo tenemos desde la card
    agregarAlCarro({ commit, state },{ producto, cantidad}) {
      //esto verifica si este id que tenemos aca, existe pero en carrito
      //el método hasOwnProperty determina si un objeto tiene una propiedad especifica (No heredada)
      //EN ESTE CASO VERIFICA QUE NO EXISTA EL ID
      //es un booleano, por lo que devuelve un true or false como valor.
      if (state.carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = state.carrito[producto.id].cantidad + cantidad.value;
      } else {
        producto.cantidad = cantidad;
      }
      

      commit('setCarrito', producto);
      //este commit lo modifica
    },
    eliminarDelCarrito({ commit, state }, productId) {
      // Llamar a la mutación para eliminar el producto del carrito
      commit('eliminarDelCarrito', productId);
    },
  },
  getters: {
    totalProductosEnCarrito: (state) => {
      return Object.values(state.carrito).reduce((total, producto) => total + producto.cantidad, 0);
    },
    subtotalCarrito: (state) => {
      return Object.values(state.carrito).reduce((subtotal, producto) => {
        const precioSinIva = parseFloat(producto.precioVentaSinIva);
        const cantidad = parseInt(producto.cantidad);
  
        if (!isNaN(precioSinIva) && !isNaN(cantidad)) {
          return subtotal + (precioSinIva * cantidad);
        } else {
          return subtotal;
        }
      }, 0);
    },
      
    totalCarrito: (state) => {
      const total = Object.values(state.carrito).reduce((total, producto) => {
        const precio = parseFloat(producto.precioVentaConIva);
        const cantidad = parseInt(producto.cantidad);
  
        if (!isNaN(precio) && !isNaN(cantidad)) {
          return total + (precio * cantidad);
        } else {
          return total;
        }
      }, 0);
  
      return total;
    },
  
  },
  modules: {},
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
})
export default store;
