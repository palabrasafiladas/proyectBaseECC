<script setup>
import { ref, onBeforeMount } from 'vue';
import axiosConfig from '../axios-config'
import AppSubMenu from './AppSubMenu.vue';
//llamar a variable categorias para crear nuestro desplegable con categorias en el 
//menu lateral.

const categorias = ref([])


onBeforeMount(async () => {

  try {
    if (!categorias.value.length) {
      await categoriasData();
    }
    model.value[0].items[1].items = [categorias.value];
  } catch (error) {
    console.error('Error no hay categorias en app menu', error);
  }
});
//llamar a variable categorias
async function categoriasData() {
  try {
    const response = await axiosConfig.get('users/categorias/obtener')
    categorias.value = convertirFormato(response.data.data);
    sessionStorage.setItem('categorias', JSON.stringify(convertirFormato(response.data.data)));
  } catch (error) {
    console.error('Error al obtener categorías en app menu', error);
  }
};

function convertirFormato(objeto) {
  const nuevoObjeto = {
    to: '/ecommerce/product-list/' + objeto.categoria.nombre,
    id: objeto.categoria.id,
    label: objeto.categoria.nombre,
    icon: ""
  };

  if (objeto.categoriasHijas && objeto.categoriasHijas.length > 0) {
    nuevoObjeto.items = objeto.categoriasHijas.map(convertirFormato);
  }

  return nuevoObjeto;

}

const model = ref([
  {
    label: 'Portal vendedores y distribuidores',
    icon: 'pi pi-fw pi-wallet',
    items: [
    {
        label: 'Inicio',
        icon:  'pi pi-home',
        to: '/ecommerce/homecategorias'
      },
     
      {
        label: 'Categorias',
        icon: 'pi pi-fw pi-list',
        items: []
      },
      {
        label: 'Resumen de productos',
        icon: 'pi pi-fw pi-shopping-cart',
        to: '/ecommerce/shopping-cart'
      },
      {
        label: 'Resumen de presupuestos',
        icon: 'pi pi-fw pi-clock',
        to: '/ecommerce/order-history'
      },
      // {
      //   label: 'Moneda',
      //   icon: 'pi pi-bill pi-globe',
      //   to: '/ecommerce/shopping-cart',
      //   items: [
      //     {
      //       label: 'Pesos Argentinos',
      //       icon: 'pi pi-money-bill',
      //       to: ''

      //     },
      //     {
      //       label: 'USD',
      //       icon: 'pi pi-dollar',
      //       to: ''
      //     },

      //   ]
      // },
      // {
      //   label: 'Perfil',
      //   icon: 'pi pi-fw pi-user',
      //   items: [
      //     {
      //       label: 'Configuracion de perfil',
      //       icon: 'pi pi-fw pi-cog',
      //       to: '/auth/newpassword'

      //     },
      //     {
      //       label: 'Registrar',
      //       icon: 'pi pi-fw pi-user',
      //       to: '/auth/register'

      //     },

      //   ]
      // },
      {
        label: 'Salir',
        icon: 'pi pi-fw pi-sign-out',
        to: '/'

      },

    ]
  },

]);
</script>

<template>
  <AppSubMenu :model="model" />
  
</template>

<style lang="scss" scoped></style>
