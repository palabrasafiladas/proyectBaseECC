<script setup>
import { ref, onMounted } from 'vue';

const producto = ref({});

onMounted(() => {
  // Obtener el producto desde los parámetros de la ruta
  producto.value = $route.params.producto;
});
const selectedImageIndex = ref(0);
const liked = ref(false);
const quantity = ref(1);
const color = ref('bluegray');
const size = ref('M');
const images = ref(['product-overview-3-1.png', 'product-overview-3-2.png', 'product-overview-3-3.png', 'product-overview-3-4.png']);

const setColor = (val) => {
    color.value = val;
};
const setSize = (val) => {
    size.value = val;
};
const setSelectedImageIndex = (index) => {
    selectedImageIndex.value = index;
};
</script>

<template>
    <div class="card">
        <div class="grid mb-7">
            <div class="col-12 lg:col-7">
                <div class="flex">
                   
                    <div class="pl-3 w-10 flex">
                        <img :alt="images[selectedImageIndex]" :src="`/demo/images/ecommerce/productoverview/${images[selectedImageIndex]}`" class="w-full border-2 border-transparent border-round" />
                    </div>
                </div>
            </div>
            <div class="col-12 lg:col-4 py-3 lg:pl-6">
                <div class="flex align-items-center text-xl font-medium text-900 mb-4">Product Title Placeholder</div>
                <div class="flex align-items-center justify-content-between mb-5">
                    <span class="text-900 font-medium text-3xl block">$120</span>
                  
                </div>

                <div class="font-bold text-900 mb-3">Cantidad</div>
                <div class="flex flex-column sm:flex-row sm:align-items-center sm:justify-content-between">
                    <InputNumber
                        showButtons
                        buttonLayout="horizontal"
                        :min="0"
                        inputClass="w-2rem text-center py-2 px-1 border-transparent outline-none shadow-none"
                        v-model="quantity"
                        class="border-1 surface-border border-round"
                        decrementButtonClass="p-button-text text-600 hover:text-primary py-1 px-1"
                        incrementButtonClass="p-button-text text-600 hover:text-primary py-1 px-1"
                        incrementButtonIcon="pi pi-plus"
                        decrementButtonIcon="pi pi-minus"
                    ></InputNumber>
                   
                </div>
            </div>
        </div>

        <TabView>
            <TabPanel header="Details">
                <div class="text-900 font-bold text-3xl mb-4 mt-2">Product Details</div>
                <p class="line-height-3 text-600 p-0 mx-0 mt-0 mb-4">
                    Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque in. Duis ultricies lacus sed turpis tincidunt id. Sed tempus urna et pharetra. Metus vulputate eu scelerisque felis imperdiet proin fermentum. Venenatis urna
                    cursus eget nunc scelerisque viverra mauris in. Viverra justo nec ultrices dui sapien eget mi proin. Laoreet suspendisse interdum consectetur libero id faucibus.
                </p>
            </TabPanel>
        </TabView>
    </div>
</template>
