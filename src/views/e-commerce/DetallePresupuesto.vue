<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { usePrimeVue } from 'primevue/config';
import axiosConfig from '../../axios-config';
import { useRouter } from 'vue-router';

const router = useRouter();

const $primevue = usePrimeVue();
//Se  Define el prop "id" para que coincida con el nombre en la ruta que coloque en el index.js

const { id } = defineProps(['id']);
let presupuestos = ref([]);

onMounted(async () => {
    try {
        console.log('ID recibido en DetallePresupuesto:', id);
        const response = await axiosConfig.get(`/pedidoitems/obtener?idPedido=${id}`);
        console.log('Datos del presupuesto recibidos:', response.data);
        const presupuestosData = response.data.data;
        // Asignamos los datos de los presupuestos recibidos a la variable presupuestos. 
        presupuestos.value = presupuestosData;
        return presupuestosData;
    } catch (error) {
        console.error('Error al obtener el detalle del presupuesto', error);
    }
});

const formatCurrency = (value) => {
    return '$ ' + Number(value).toFixed(2).replace('.', ',');
};
const regresarApresupuestos = () => {
    router.push({ name: 'order-history' });
};
</script>

<template>
    
    <DataTable :value="presupuestos" :paginator="true" :rows="10" tableStyle="min-width: 50rem">
        <Column field="idPedido" header="ID de presupuesto"></Column>
        <Column field="nombre" header="Nombre del Producto"></Column>
        <Column field="codigo" header="Codigo del Producto"></Column>
        <Column field="cantidad" header="Cantidad"></Column>
        <Column field="moneda" header="Moneda"></Column>
        <Column field="total" header="Precio con IVA">
            <template #body="{ data }">
                {{ formatCurrency(data.precioVentaConIva) }}
            </template>
        </Column>

        <li id="botonRegresar" class="flex justify-content-end">
        <Button label="Regresar"  @click="regresarApresupuestos()"></Button>
        </li>
    </DataTable>
    
</template>
  
<style scoped>
#botonRegresar{
    padding-bottom: 4%;
}

</style>