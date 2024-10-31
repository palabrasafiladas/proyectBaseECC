<script setup>
import { ref, onMounted, reactive } from 'vue';
import { usePrimeVue } from 'primevue/config';
import axiosConfig from '../../axios-config';
import router from '../../router';


onMounted(async () => {
  try {
    const presupuestos = await presupuestosEnviados();

  } catch (error) {
    console.error('Error al recibir los presupuestos', error);
  }
});

async function presupuestosEnviados() {
  try {
    const response = await axiosConfig.get('/pedidos/obtener?idPedido=');
    const presupuestosData = response.data.data;
    console.log('Presupuestos recibidos:', presupuestosData);
    presupuestos.value = presupuestosData;

    return presupuestosData;
  } catch (error) {
    console.error('Error al obtener mis presupuestos solicitados', error);
  }
}

const presupuestos = ref([]);
const $primevue = usePrimeVue();

defineExpose({
  $primevue
});

const redirectToDetalle = (idPresupuesto) => {
  console.log('ID del presupuesto:', idPresupuesto);
  router.push({ name: 'detalle-presupuesto', params: { id: idPresupuesto } });
};

const formatCurrency = (value) => {
  return '$ ' + Number(value).toFixed(2).replace('.', ',');
};
</script>


<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Resumen de presupuestos</h5>
        <DataTable :value="presupuestos" :paginator="true" :rows="10" tableStyle="min-width: 50rem">
          <Column field="id" header="Presupuesto"></Column>
          <Column field="fechaCreado" header="Fecha de creado"></Column>
          <Column field="estadoNombre" header="Estado"></Column>
          <Column field="total" header="Total">
            <template #body="{ data }">
              {{ formatCurrency(data.total) }}
            </template>
          </Column>
          <Column field="datosEnvio" header="Direccion de envio"></Column>
          <Column field="comentario" header="Comentario adicional"></Column>
          <Column header="Acciones">
            <template #body="{ data }">
              <Button icon="pi pi-eye" @click="redirectToDetalle(data.id)"></Button>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
  