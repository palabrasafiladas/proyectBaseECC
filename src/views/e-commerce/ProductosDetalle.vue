<script setup>
import { ref, onMounted, watch } from 'vue';
import axiosConfig from '../../axios-config';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const store = useStore();
const productos = ref(null);
const { id } = defineProps(['id']);
const cantidad = ref(1)


const agregar = async (producto) => {
  confirm.require({
    group: 'templating',
    message: '¿Deseas agregar este producto al carrito?',
    header: 'Agregar producto',
    icon: 'pi pi-shopping-cart',
    acceptLabel: 'Agregar',
    rejectLabel: 'Cancelar',
    accept: () => {
        // Lógica para agregar el producto al carrito
        store.dispatch('agregarAlCarro',{producto, cantidad});
        // Mostrar el Toast después de agregar el producto
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Producto agregado con éxito',
          life: 3000, 
        });
    },
    reject: () => {
      toast.add({
        severity: 'error',
        summary: 'Cancelado',
        detail: 'Producto no agregado',
        life: 3000,
      });
    }
  });
};

onMounted(async () => {
    try {
        console.log('ID recibido en Detalle producto:', id);
        const response = await axiosConfig.get(`/users/productos/obtener?id=${id}`);
        console.log('Datos recibidos en la llamada:', response.data);
        const productosData = response.data.data;
        // Asignamos los datos de los presupuestos recibidos a la variable productos. 
        productos.value = productosData;
        return productosData;
    } catch (error) {
        console.error('Error al obtener el producto por su id', error);
    }
});


// Define el método para verificar la cantidad
const checkCantidad = (newValue) => {
  if (newValue === 0) {
    // Muestra un toast con el mensaje cuando la cantidad es igual a 0
    ;toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Los valores en 0 no están permitidos',
      life: 3000 // Duración del toast en milisegundos
    })
  }
};

const redirectToShoppingCart = () => {
  // Redirigir a la ruta del carrito de compras
  router.push({ name: 'shopping-cart' });
};
const redirectToProductos = () => {
  // Redirigir a la ruta del carrito de compras
  router.push({ name: 'product-list' });
};
const selectedImageIndex = ref(0);
const liked = ref(false);
const quantity = ref(1);
const images = ref(['product-overview-3-1.png', 'product-overview-3-2.png', 'product-overview-3-3.png', 'product-overview-3-4.png']);


</script>
<style scoped>
#tituloCantidad{
  padding-top: 4%;
}
</style>
<template>
  
    <div class="card">
      <li id="botonRegresar" class="flex justify-content-end">
        <Button label="Regresar"  @click="redirectToProductos()"></Button>
      </li>      
      <Toast />
    <ConfirmDialog group="templating">
        <template #message="slotProps">
            <div class="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
                <i :class="slotProps.message.icon" class="text-6xl text-primary-500"></i>
                <InputNumber v-model="cantidad" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" :allowEmpty="false" :min="1" decrementButtonClass="p-button-danger" incrementButtonClass="p-button-success" @change="checkCantidad">
                    <template #incrementbuttonicon>
                        <span class="pi pi-plus" />
                    </template>
                    <template #decrementbuttonicon>
                        <span class="pi pi-minus" />
                    </template>
                </InputNumber>
                <p>{{ slotProps.message.message }}</p>
            </div>
        </template>
    </ConfirmDialog>
        <div class="grid mb-7">
          <div v-for="product in productos" :key="product.id" class="col-12 lg:col-7">
                <div class="flex">
                    <div class="pl-3 w-10 flex">
                        <img  :src="product.urlImagen" :alt="product.nombre"   class="w-full border-2 border-transparent border-round" />
                    </div>
                </div>
            </div>
            
            <div v-for="product in productos" :key="product.id" class="col-12 lg:col-4 py-3 lg:pl-6">
            
                <div  class="text-900 font-medium text-4xl mb-4">
                   Producto</div>
                <span class="text-xl  font-medium mb-3">Nombre:  {{ product.nombre }}</span> <br>
                <span class="text-xl  font-medium mb-3">Descripción:  {{ product.descripcion2 }}.</span> <br>
                <span class="text-xl  font-medium mb-3">Precio venta final: {{ Number(product.precioVentaConIva).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}</span> <br>
                <span class="text-xl  font-medium mb-3">Stock disponible: {{ product.stock }}</span> 

                <div id="tituloCantidad" class="font-bold text-900 mb-3">Cantidades</div>
                <div class="flex flex-column sm:flex-row sm:align-items-center sm:justify-content-between">
                    <InputNumber
                       @change="checkCantidad"
                       v-model="cantidad"      

                        showButtons
                        buttonLayout="horizontal"
                        :min="1"
                        inputClass="w-2rem text-center py-2 px-1 border-transparent outline-none shadow-none"
                        class="border-1 surface-border border-round"
                        decrementButtonClass="p-button-text text-600 hover:text-primary py-1 px-1"
                        incrementButtonClass="p-button-text text-600 hover:text-primary py-1 px-1"
                        incrementButtonIcon="pi pi-plus"
                        decrementButtonIcon="pi pi-minus"
                    ></InputNumber>
                    <div class="flex align-items-center flex-1 mt-3 sm:mt-0 ml-0 sm:ml-5">
                        <Button @click="agregar(product)" label="Agregar" class="flex-1 mr-5"></Button>
                        <Button @click="redirectToShoppingCart()" label="Continuar" class="flex-1 mr-5"></Button>
                      </div>
                </div>
            </div>
           

        </div>

       
    </div>
</template>
