<script setup>
import { ref } from 'vue';
//import store from '../../store'

const products = ref([
    {
        name: 'Cotton Sweatshirt',
        size: 'Medium',
        color: 'White',
        price: '$12',
        quantity: '1',
        image: '/demo/images/ecommerce/ordersummary/order-summary-1-1.png'
    },
    {
        name: 'Regular Jeans',
        size: 'Large',
        color: 'Black',
        price: '$24',
        quantity: '1',
        image: '/demo/images/ecommerce/ordersummary/order-summary-1-2.png'
    }
]);
</script>

<template>
    <div class="card">
        <div class="text-900 font-bold text-4xl my-2"> Seguimiento de presupuesto 🚀
        </div>
        <p class="text-700 text-xl mt-0 mb-4 p-0">presupuesto numero:  <span class="font-medium text-xl text-blue-500">451234</span> </p>
       
     
        <div class="mb-3 sm:mb-0">
         
            </div>
            <div class="flex flex-column md:flex-row md:align-items-center border-bottom-1 surface-border py-5">
            <div class="flex-auto mt-3 md:mt-0">
                <div class="border-round overflow-hidden surface-300 mb-3" :style="{ height: '7px' }">
                    <div class="bg-primary border-round w-4 h-full"></div>
                </div>
                <div class="flex w-full justify-content-between">
                    <span class="text-900 text-xs sm:text-base">presupuesto registrado</span>
                    <span class="text-900 font-medium text-xs sm:text-base">presupuesto validado</span>
                    <span class="text-500 text-xs sm:text-base">Entregando el producto</span>
                    <span class="text-500 text-xs sm:text-base">Producto entregado</span>
                </div>
            </div>
        </div>
     
        <div class="flex flex-wrap mt-5 pb-3">
            <div class="w-full lg:w-6 pl-3">
                <span class="font-medium text-900">Direccion de entrega</span>
                <div class="flex flex-column text-900 mt-3 mb-5">
                    <span class="mb-1">Celeste Slater</span>
                    <span class="mb-1">606-3727 Ullamcorper. Roseville NH 11523</span>
                    <span>(786) 713-8616</span>
                </div>                
            </div>
        </div>
    </div>

    
</template>
