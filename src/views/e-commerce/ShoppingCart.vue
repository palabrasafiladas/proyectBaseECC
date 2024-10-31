<script setup>
import { ref,  computed, defineExpose } from 'vue';
import { usePrimeVue } from 'primevue/config';
import router from '../../router';
import { useStore } from 'vuex';
import Column from 'primevue/column';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from "primevue/usetoast";
import InputNumber from 'primevue/inputnumber';

const confirm = useConfirm();
const toast = useToast();
//ref para pasar la selección del usuario a mi componente checkoutForm
//obtener instancia de mi store para manejar los productos guardados en mi carrito
const store = useStore(); // Obténer mi   instancia de la store
//obtener el getters
//suma de mis productos desde mi store
const subtotalCarrito = computed(() => store.getters.subtotalCarrito);
const totalCarrito = computed(() => store.getters.totalCarrito);

// Obtener la lista de productos del carrito
const productosEnCarrito = computed(() => store.state.carrito);

// Cantidad de productos en el carrito
// Usamos Object.keys porque nuestro carrito es un grupo de Objetos dentro de un Objeto
// Debemos ver la cantidad de llaves dentro, siendo que cada llave representa un producto
const cantProductos = computed(() => Object.keys(productosEnCarrito.value).length);

const eliminarProducto = (productId) => {
    confirm.require({
        message: '¿Estas seguro que deseas continuar?',
        header: '¿Eliminar?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        accept: () => {
            // Llamar a la acción en el store para eliminar el producto del carrito
            store.dispatch('eliminarDelCarrito', productId);
            toast.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Producto eliminado correctamente',
                life: 3000,
            });
        },
        reject: () => {
            toast.add({
                severity: 'error',
                summary: 'Cancelado',
                detail: 'Producto no eliminado',
                life: 3000,
            });
        }
    });
};

//methodo para mostrar dialogo de 'continuar al form?'
const dialogoConfirmarPresupuesto = () => {
    confirm.require({
        message: '¿Deseas continuar  al detalle de presupuesto?',
        header: '¿Deseas continuar?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Continuar',
        rejectLabel: 'Cancelar',
        accept: () => {
            redirectToCheckout()
        },
        reject: () => {
            toast.add({
                severity: 'error',
                summary: 'Operacion cancelada',
                detail: 'No se redirige a detalle de presupuesto',
                life: 3000,
            });
        }
    });
}
// methodo para redirigir a mi check de  producto / nombre de la ruta
const redirectToCheckout = () => {
    router.push({ name: 'checkout-form' });
};
const redirectToProductlist = () => {
    router.push({ name: 'product-list' });
};
//alert simple de carrito
const updateCart = () => {
    alert('¡Carrito actualizado!');
};
// const filters1 = ref(null);
// const loading1 = ref(null);
// const loading2 = ref(null);
// const products = ref(null);
const displayFinishDialog = ref(false); //Cuadro de dialogo para 'deseas continuar con tu compra?'

// const statuses = reactive(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
// const customerService = new CustomerService();
// const productService = new ProductService();
// const showFinishDialog = () => {
//     displayFinishDialog.value = true;
// };

// const getSeverity = (status) => {
//     switch (status) {
//         case 'unqualified':
//             return 'danger';

//         case 'qualified':
//             return 'success';

//         case 'new':
//             return 'info';

//         case 'negotiation':
//             return 'warning';

//         case 'renewal':
//             return null;
//     }
// };
const $primevue = usePrimeVue();

defineExpose({
    $primevue
});


// onBeforeMount(() => {
//     productService.getProductsWithOrdersSmall().then((data) => (products.value = data));
//     customerService.getCustomersLarge().then((data) => {
//         // customer1.value = data;
//         // loading1.value = false;
//         // customer1.value.forEach((customer) => (customer.date = new Date(customer.date)));
//     });

//     initFilters1();
// });

// const initFilters1 = () => {
//     filters1.value = {
//         global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//         name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//         'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//         representative: { value: null, matchMode: FilterMatchMode.IN },
//         date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
//         balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//         status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//         activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
//         verified: { value: null, matchMode: FilterMatchMode.EQUALS }
//     };
// };

// const clearFilter1 = () => {
//     initFilters1();
//};

const formatCurrency = (value) => {
    return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-ARS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
const totalCarritoPorProducto = (producto) => {
    // Calcula el total del carrito para un producto específico
    return producto.precioVentaConIva * producto.cantidad;
};

function onDataUpdate(payload) {
    store.dispatch('cambiarCantidad', payload)
}


</script>
<style scoped>


#top-checkbox {
    margin-top: 2%;

}

li {
    list-style: none;
}

#ResultadoTotal {
    margin-right: 10%;
    padding-right: 7%;
}
</style>
<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Resumen de productos</h5>
                <DataTable :value="productosEnCarrito" tableStyle="min-width: 50rem">
                    <Column v-if="nombre !== null" field="nombre" header="Producto"></Column>
                    <Column v-if="nombre !== null" field="codigo" header="Codigo"></Column>
                    <Column v-if="nombre !== null" field="precioVentaConIva" header="Precio unitario">
                        <template #body="{ data }">
                            {{ formatCurrency(parseFloat(data.precioVentaConIva)) }}
                        </template>
                    </Column>

                    <Column v-if="nombre !== null" field="cantidad" header="Cantidad">
                        <template #body="slotProps">
                            <InputNumber @input="onDataUpdate(slotProps.data)" :allowEmpty="false" showButtons buttonLayout="horizontal"
                                :min="1"
                                inputClass="w-2rem text-center py-2 px-1 border-transparent outline-none shadow-none"
                                v-model="slotProps.data.cantidad" class="border-1 surface-border border-round"
                                decrementButtonClass="p-button-text text-600 hover:text-primary py-1 px-1"
                                incrementButtonClass="p-button-text text-600 hover:text-primary py-1 px-1"
                                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"></InputNumber>
                        </template>
                    </Column>
                    <Column v-if="nombre !== null" field="subtotal" header="Importe">
                        <template #body="{ data }">
                            {{ formatCurrency(data.precioVentaConIva * data.cantidad) }}
                        </template>
                    </Column>

                    <Column field="Eliminar" header="Eliminar">
                        <template #body="{ data }">
                            <Button v-if="data && data.id" icon="pi pi-trash" @click="() => eliminarProducto(data.id)">
                            </Button>
                        </template>
                    </Column>

                </DataTable>
                <!-- ACA SE DEFINE NUESTRO CUADRO DE DIALOGO -->
                <Toast />
                <ConfirmDialog />


                <li id="ResultadoTotal" class="flex justify-content-end">
                    <div class="flex justify-content-end align-items-end mt-6">
                        <ul id="titleTotal" class="list-none py-0 pr-0 pl-0 md:pl-5 mt-0 mb-0 flex-auto">
                            <span class="text-900 text-xl block font-medium mb-5">Subtotal sin IVA : {{
                                formatCurrency(subtotalCarrito) }} <br>
                                Importe con IVA : {{ formatCurrency(totalCarrito) }} </span>
                        </ul>
                    </div>
                </li>
                <div class="flex justify-content-between mt-6">
                    <li class="flex justify-content-start">
                        <Button label="Regresar a productos" @click="redirectToProductlist()"></Button>
                    </li>
                    <li class="flex justify-content-end">
                        <Button label="Continuar" :disabled="!cantProductos" @click="dialogoConfirmarPresupuesto()"></Button>
                    </li>
                </div>



            </div>
        </div>

    
    </div>
</template>
