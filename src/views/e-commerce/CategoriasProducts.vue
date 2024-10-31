<script setup>
import { ref } from 'vue';
import Carousel from 'primevue/carousel';
import router from '../../router';

const products = ref([]);


const staticItems = [
  {
    img: 'https://www.aquaglass.com.ar/wp-content/uploads/2017/11/mamparas-destacada-300x300.jpg',
    title: 'AquaGlass',
    description: 'AquaGlass',
  },
  {
    img: 'https://www.aquaglass.com.ar/wp-content/uploads/2017/11/ducha-escocesa-destacada-1-300x300.jpg',
    title: 'AquaGlass Black',
    description: 'Descripción del objeto estático 2',
  },
];
</script>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      items: [
        {
          img: 'https://www.aquaglass.com.ar/wp-content/uploads/2017/11/header-home.jpg',
          title: ''
        },
        {
          img: 'https://www.aquaglass.com.ar/wp-content/uploads/2017/11/header-home.jpg',
          title: '',
        },
        {
          img: 'https://www.aquaglass.com.ar/wp-content/uploads/2017/11/header-home.jpg',
          title: '',
        },
      ],
    };
  },
};
const redirectToProductlist = () => {
  router.push({ name: 'product-list' });
};
const redirectToCategorias = () => {
  router.push({ name: 'categorias-products' });
};
</script>

<template>
  <div>
    <Carousel v-model="activeIndex" :value="items" class="carousel-container">
      <template #item="{ data }">
        <img id="CarrouselAltura" :src="data.img" alt="Imagen" />
        <div class="carousel-item-content">
          <h3>{{ data.title }}</h3>
          <p>{{ data.description }}</p>
        </div>
      </template>
    </Carousel>


    <div class="card">
      <div class="text-900 font-medium text-4xl mb-4">Categorías</div>
      <p class="mt-0 p-0 mb-5 text-700 text-2xl">Lista de productos</p>

      <div class="grid -mt-3 -ml-3 -mr-3" style="display: flex; align-items: center;">
        <!-- Primer producto estático -->
        <div class="containerCaja" >
          <div class="mb-3 relative">

            <img :src="staticItems[0].img" class="w-full" :alt="staticItems[1].title" />
            <Button type="button"
              class="border-1 border-white border-round py-2 px-3 absolute bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer"
              :style="{ bottom: '1rem', left: '1rem', width: 'calc(100% - 2rem)' }" @click="redirectToProductlist()">
              <i class="pi pi-shopping-cart mr-3 text-base"></i>
              <span class="text-base">AquaGlass</span>
            </Button>
          </div>

        </div>
        <!-- Segundo producto estático  black-->
        <div class="containerCaja" >
          <div class="mb-3 relative">
            <img :src="staticItems[1].img" class="w-full" :alt="staticItems[1].title" />
            <Button type="button"
              class="border-1 border-white border-round py-2 px-3 absolute bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer"
              :style="{ bottom: '1rem', left: '1rem', width: 'calc(100% - 2rem)' }" @click="redirectToCategorias()">
              <i class="pi pi-shopping-cart mr-3 text-base"></i>
              <span class="text-base">AquaGlass Black</span>
            </Button>
          </div>

        </div>

        <!-- Productos dinámicos -->
        <div v-for="product in products" :key="product.id" class="col-12 md:col-6 lg:col-3 mb-5 lg:mb-0">
          <!-- Renderizar productos dinámicos -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.containerCaja{
  width: 50%;
  padding: 5%;
}
.carousel-container {
  display: flex;
  width: 100%;
  justify-content: center;
}

#CarrouselAltura {
  height: 300px;

  width: 100%;
  flex: 1;
}

;

#imagenSetear {
  height: 200px !important;
}
</style>