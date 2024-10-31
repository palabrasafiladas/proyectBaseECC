<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from "primevue/usetoast";
import axiosConfig from '../../axios-config';
import router from '../../router';
import InputNumber from 'primevue/inputnumber';

const confirm = useConfirm();
const toast = useToast();
const enviarADireccionDiferente = ref(false);
// const calendarValue = ref(null);
const direcciones = ref([]);
//DATOS PARA ENVIAR EN EL POST 
const direccionesFiscales = ref([]);// donde guardo mis fiscales
const selectedFiscal = ref(null);

//selectedDireccion es una instancia de la clase Direccion. 
//Cuando se inicializa con ref(new Direccion()), 
//se esta creando un objeto con propiedades como pais, calle, y comentario, entre otras.
class Direccion {
    constructor(
    ) {
        this.pais = '';
        this.calle = '';
        this.comentario = '';
        this.numero = '';
        this.provincia = '';
        this.localidad = '';
        this.ciudad = '';
        this.codigoPostal = '';
        this.nombre = '';
        this.apellido = '';
        this.telefono = '';
        this.correo = '';
    }
}
//Cuando se inicializa con ref(new Direccion()), 
const selectedDireccion = ref(new Direccion())
const { selectedData } = defineProps(['selectedData']);
const store = useStore(); // Obténer mi   instancia de la store
const subtotalCarrito = computed(() => store.getters.subtotalCarrito);
const totalCarrito = computed(() => store.getters.totalCarrito);


// Obtener la lista de productos del carrito
const productosEnCarrito = computed(() => store.state.carrito);
console.log('lista de productos', productosEnCarrito)

onMounted(() => {
    obtenerDirecciones()
    obtenerFiscales()
});
//el response que recibo pudeo agregarle una propiedad que se llame label, direccion concatenada
// ver como iterar en la lista de response.data.data por cada item se crea la propiedad label (concatenando las propiedades)
// como por ej callle, ciudad, pais EN EL DROPDOWN deberia mostrar en optionsLabel la nueva variable creada con la concatenacion
//METHODO PARA OBTENER MIS DIRECCIONES
const obtenerDirecciones = async () => {
    try {
        const response = await axiosConfig.get('/direcciones/obtener');
        console.log('Respuesta de Direcciones', response)
        direcciones.value = response.data.data.map((direccion) => ({
            //Realizo aqui la concatenacion de la dirección
            ...direccion,
            concatenatedLabel: `${direccion.calle} ${direccion.numero}, ${direccion.localidad}, ${direccion.codigoPostal},  ${direccion.provincia}, ${direccion.pais}`,
        }));
    } catch (error) {
        console.error('ERROR en obtener direcciones checkout', error);
    }
};
//Obtengo mis fiscales
const obtenerFiscales = async () => {
    try {
        const response = await axiosConfig.get('/fiscales/obtener');
        console.log('Respuesta de Fiscales', response)
        direccionesFiscales.value = response.data.data;
    } catch (error) {
        console.error('ERROR en obtener fiscales checkout', error);
    }
};
//Formateo los decimales a pesos arg
const formatCurrency = (value) => {
    return value.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

//methodo para mostrar dialogo de 'deshacer cambios'
const regresarCarrito = () => {
    console.log('Regresando al carrito...');
    confirm.require({
        message: 'Tus datos del formulario no se enviaran',
        header: '¿Regresar al carrito?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Continuar',
        rejectLabel: 'Cancelar',
        accept: () => {
            redirectToCarrito()
        },
        reject: () => {
            // SE CANCELA LA OPERACION DE CONTINUAR
        }
    });
};
//methodo para mostrar dialogo de 'deshacer cambios'
const presupuestoEnviado = () => {
    console.log('Regresando al carrito...');
    confirm.require({
        message: '¿Desea enviar el presupuesto?',
        header: 'Envio de presupuesto',
        // icon: 'pi pi-check',
        acceptLabel: 'Enviar presupuesto',
        rejectLabel: 'Cancelar',
        accept: () => {
            enviarPresupuesto()
        },
        reject: () => {
            // SE CANCELA LA OPERACION DE CONTINUAR
        }
    });
};
//Redireccionar a mi carrito
const redirectToCarrito = () => {
    router.push({ name: 'shopping-cart' });
};

//Se agregan todos los productos que tenemos guardados en el store de la app
const construirPedidoItems = () => {
    let productos = Object.values(store.state.carrito);
    let aux = []
    console.log('DATOS DEL STORE', store.state.carrito)

    console.log('lista de productos dentro de mi methodo construir pediddos item', productos)

    for (const item of productos) {
        aux.push({
            'idProductomWeb': item.id.toString(),
            'codigo': item.codigo,
            'cantidad': item.cantidad.toString(),
            'precioVentaConIva': item.precioVentaConIva.toString(),
            'precioVentaSinIva': item.precioVentaSinIva.toString(),

            'moneda': 'ARS',
            'costo': '0',
            'nombre': item.nombre
        })
    }
    return aux
};



// Método transforma el archivo subido a Base64 y guarda en la constante file su nombre y base
const file = ref()
const customBase64Uploader = async (event) => {
    //se guarda en file value
    file.value = event.files[0];
    //Crea una url 
    const reader = new FileReader();
    file.value.objectURL = URL.createObjectURL(file.value)
    // El blob nos permite leerlo como data url
    let blob = await fetch(file.value.objectURL).then((r) => r.blob()); //blob:url
    reader.readAsDataURL(blob);
    //evento cuando finaliza la carga del archivo
    reader.onloadend = function () {
        file.value.data = reader.result;
        let base64Inicio = file.value.data.indexOf("base64,");

        console.log(file.value.data);
        file.value.data = file.value.data.substring(base64Inicio + "base64,".length); // Extrae desde después de "base64" hasta el final del string
        console.log(file.value.data);
    };
};


// Método para insertar una nueva dirección
const insertarNuevaDireccion = async (direccion) => {
    try {
        // Agregar el campo harcoded envioMetodoId
        direccion.envioMetodoId = 'ENVIO_A_DOMICILIO';

        const response = await axiosConfig.post('/direcciones/insertar', direccion);
        idDireccion = response.data.id;

        return response.data; // Devolver la respuesta
    } catch (error) {
        // Manejar errores
        console.error('Error al insertar nueva dirección:', error);
        throw error;
    }
};
let idDireccion = null; //la defino aca, para poder acceder desde cualquier parte

// Método para enviar el post a la API del presupuesto creado
const enviarPresupuesto = async () => {
    try {
        let direccionEnvio = {};

        // let idDireccion = null;

        if (enviarADireccionDiferente.value) {
            // Insertar nueva dirección antes de enviar el presupuesto
            const response = await insertarNuevaDireccion(selectedDireccion.value, 'ENVIO_A_DOMICILIO');
            console.log(response, 'valor de el id')
            idDireccion = response.data.id; // Obtener el ID de la nueva dirección insertada
        } else {
            if (selectedDireccion.value !== null) {
                idDireccion = selectedDireccion.value.id; // Obtener el ID de la mi dropdown
            } else {
                console.error('Error: selectedDireccion es null');
                return;
            }
        }

        //El objeto direccionEnvio se utiliza para enviar los detalles de la dirección junto con el presupuesto.
        direccionEnvio = {
            idDireccion: idDireccion, // esto es para agregar mi id de direccion
            calle: selectedDireccion.value.calle,
            numero: selectedDireccion.value.numero,
            codigoPostal: selectedDireccion.value.codigoPostal,
            provincia: selectedDireccion.value.provincia,
            localidad: selectedDireccion.value.localidad,
            ciudad: selectedDireccion.value.ciudad,
            pais: selectedDireccion.value.pais,
            nombre: selectedDireccion.value.nombre,
            telefono: selectedDireccion.value.telefono,
            apellido: selectedDireccion.value.apellido,

        };

        console.log('direccionEnvio', direccionEnvio);
        console.log('selectedDireccion', selectedDireccion);

        const envioMetodoId = enviarADireccionDiferente.value ? 'ENVIO_A_DOMICILIO' : (selectedDireccion.value ? selectedDireccion.value.envioMetodoId : '');

        const data = {
            pedido: {
                idDireccion: idDireccion, // Usar el ID de la dirección

                idApiWeb: '0',
                estado: 0,
                tiendaUserId: '1',
                idPropietario: 1,
                origen: 'AQUAGLASS',
                datosEnvio: `${direccionEnvio.calle}, ${direccionEnvio.numero},${direccionEnvio.localidad}, ${direccionEnvio.codigoPostal}, ${direccionEnvio.provincia}, ${direccionEnvio.pais}`,
                totalDescuento: '0',
                metodoPago: '',
                responsable: selectedDireccion.value.nombre,
                nombre: selectedDireccion.value.nombre, //nombre del responsable
                transaccionId: '',
                totalEnvio: '0.00',
                total: totalCarrito.value.toString(),
                totalEnvioSinIva: totalCarrito.value.toString(),
                fechaAprobadoPago: '',
                moneda: '',
                envioMetodoId: envioMetodoId,
                envioMetodoNombre: 'Yo cargo',
                comentario: selectedDireccion.value.comentario,
                idFiscal: selectedFiscal.value.id,
            },
            pedidoItems: construirPedidoItems(),
            direccion: direccionEnvio,
            adjuntos: [
                {
                    nombreArchivo: file.value.name,
                    contenido: file.value.data
                }
            ]
        };

        console.log('Valor del campo comentario:', selectedDireccion.comentario);
        console.log('Antes de enviar el presupuesto', data);

        // Resto del código para enviar el presupuesto...
        const response = await axiosConfig.post('/pedidos/insertar', data);
        console.log('RESPUESTA DE MI POST REALIZADO PARA ENVIAR EL PRESUPUESTO:', response.data);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Presupuesto enviado con éxito' });

    } catch (error) {
        // Manejar errores
        console.error('Error al enviar el presupuesto', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al enviar el presupuesto, contacte a soporte' });
    }
};
    

// Expresión regular para validar correo electrónico

const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

</script>


<style scoped>
#CajaComentario {
    height: 60px;
}

#cajaLeyenda {
    background-color: rgb(226, 221, 221);
    text-align: left;
    font-size: small;
}

#calendar {
    padding-bottom: 4%;
}

#email {
    margin-top: 5%;

}

#subirArchivo {
    padding-bottom: 5%;
    margin-bottom: 10%;
}

#bloqueGris {
    background-color: #ebe6ea;


}

#table {
    width: 50%;
    max-width: 100%;
    min-width: 50%;
}

@media (max-width: 540px) {
    #table {
        min-width: 100%;
        /* Cuando el ancho de la pantalla sea 540px o menos, establecer el ancho mínimo al 100% */
    }
}
</style>

<template>
    <div class="card">
        <Toast />
        <ConfirmDialog />
        <div class="grid grid-nogutter">
            <div class="col-12 px-4 mt-4 md:mt-6 md:px-6">
                <span class="text-900 block text-3xl">Detalle de presupuesto</span>
            </div>
            <div class="col-12 lg:col-6 h-full px-4 py-4 md:px-6">
                <ul class="flex list-none flex-wrap p-0 mb-6">
                    <li class="flex align-items-center text-primary mr-2">Resumen de productos <i
                            class="pi pi-chevron-right text-500 text-xs ml-2"></i></li>
                    <li class="flex align-items-center text-500 mr-2">Detalles de presupuesto
                        <i class="pi pi-chevron-right text-500 text-xs ml-2"></i>
                    </li>
                </ul>
                <div class="grid formgrid">
                    <div class="col-12 field mb-6">
                        <span class="text-900 text-xl block font-medium mb-5">Datos fiscales</span>
                        <!-- <Calendar id="calendar" :showIcon="true" :showButtonBar="true" v-model="calendarValue"></Calendar> -->
                        <Dropdown :options="direccionesFiscales" v-model="selectedFiscal"
                            placeholder="Selecciona tu fiscal" optionLabel="razonSocial" showClear class="w-full"
                            @onChange="handleFiscalChange"></Dropdown>
                    </div>
                    <div class="col-12 field mb-4">
                        <span class="text-900 text-xl block font-medium mb-5">Dirección</span>
                        <div style="margin-bottom: 6%;" class="field-checkbox">
                            <Checkbox name="checkbox-2" v-model="enviarADireccionDiferente" binary inputId="checkbox-2">
                            </Checkbox>
                            <label for="checkbox-2">Enviar a una dirección diferente</label>
                        </div>
                        <Dropdown :options="direcciones" v-model="selectedDireccion" placeholder="Direcciónes"
                            optionLabel="concatenatedLabel" showClear class="w-full"></Dropdown>
                    </div>
                    <!-- Solo renderiza el formulario de dirección cuando el checkbox está marcado -->

                    <template v-if="enviarADireccionDiferente">
                        <div class="col-12 field mb-4">
                            <span class="text-900 text-xl block font-medium mb-5">Nueva dirección</span>

                        </div>

                        <div class="col-12 lg:col-6 field mb-4">
                            <input id="lastname" placeholder="Calle" v-model="selectedDireccion.calle" type="text"
                                class="p-inputtext w-full" />
                        </div>
                        <div class="col-12 lg:col-6 field mb-4">
                            <input id="lastname" placeholder="Numero" v-model="selectedDireccion.numero" type="number"
                                class="p-inputtext w-full" />
                        </div>
                        <div class="col-12 lg:col-6 field mb-4">
                            <input id="city" placeholder="Ciudad" type="text" v-model="selectedDireccion.localidad"
                                class="p-inputtext w-full" />
                        </div>
                        <div class="col-12 lg:col-6 field mb-4">
                            <input id="pc" placeholder="Codigo Postal" type="number"
                                v-model="selectedDireccion.codigoPostal" class="p-inputtext w-full" />
                        </div>
                        <div class="col-12 field mb-4">
                            <input id="address2" v-model="selectedDireccion.provincia" placeholder="Provincia"
                                type="text" class="p-inputtext w-full" />
                        </div>
                        <div class="col-12 field mb-4">
                            <input id="address2" v-model="selectedDireccion.pais" placeholder="Pais" type="text"
                                class="p-inputtext w-full" />
                        </div>
                    </template>
                    <div class="col-12">
                        <span class="text-900 text-xl block font-medium mb-5">Datos importantes</span>
                    </div>

                    <div class="col-12 lg:col-6 field mb-4">

                        <input id="name" placeholder="Nombre" v-model="selectedDireccion.nombre" type="text"
                            class="p-inputtext w-full" />
                    </div>
                    <div class="col-12 lg:col-6 field mb-4">
                        <input id="lastname" placeholder="Apellido" v-model="selectedDireccion.apellido" type="text"
                            class="p-inputtext w-full" />
                    </div>

                    <div class="col-12 lg:col-6 field mb-4">
                        <InputNumber id="telefono" placeholder="Telefono" v-model="selectedDireccion.telefono"
                            type="number" />
                    </div>
                    <div class="col-12 lg:col-6 field mb-4">
                        <input id="correo" placeholder="Correo electrónico" v-model="selectedDireccion.correo"
                            type="email" class="p-inputtext w-full" required />
                        <!-- Agregar un mensaje de error -->
                        <small v-if="selectedDireccion.correo && !isValidEmail(selectedDireccion.correo)"
                            class="text-red-500">Ingrese un
                            correo electrónico válido.</small>
                    </div>

                    <div id="CajaComentario" class="col-12 field mb-4">
                        <input id="CajaComentario" v-model="selectedDireccion.comentario"
                            placeholder="Comentario adicional" type="text" class="p-inputtext w-full" />
                    </div>
                    <div class="col-12 lg:col-6 field mb-4">
                        <span class="text-900 text-xl block font-medium mb-5">Subir archivo</span>
                        <FileUpload id="subirArchivo" mode="basic" :chooseLabel="'Subir archivo'"
                            accept=".jpg, .doc, .docx, .xls, .xlsx, .pdf" :maxFileSize="1000000" customUpload
                            @select="customBase64Uploader">
                            <!-- Utiliza el slot para personalizar el contenido del botón -->
                            <template v-slot:default="{ chooseLabel }">
                                {{ chooseLabel }}
                            </template>
                        </FileUpload>
                    </div>


                </div>
            </div>
            <div id="table">
                <!-- //Empieza mi bloque de productos en carrito -->
                <DataTable :value="productosEnCarrito" tableStyle="min-width: 50%">
                    <Column field="nombre" header="Producto"></Column>
                    <Column field="precioVentaConIva" header="Precio">
                        <template #body="{ data }">
                            {{ formatCurrency(data.precioVentaConIva * data.cantidad) }}
                        </template>
                    </Column>
                    <Column field="cantidad" header="Cantidad">
                    </Column>
                </DataTable>
                <!-- Bloque de Subtotal, Total y botones dentro de la misma columna -->
                <div class="col-12 lg:justify-content-center">
                    <div class="flex justify-content-between align-items-left mb-3">
                        <span class="text-900 font-medium">Subtotal sin iva</span>
                        <span class="text-900">{{ formatCurrency(subtotalCarrito) }}</span>
                    </div>
                    <div class="flex justify-content-between align-items-center mb-3">
                        <span class="text-900 font-medium">Total</span>
                        <span class="text-900 font-medium">{{ formatCurrency(parseFloat(totalCarrito)) }}</span>
                    </div>
                </div>
                <!-- Bloque de botones -->
                <div
                    class="col-12 flex flex-column lg:flex-row justify-content-center align-items-center lg:justify-content-end my-6">
                    <Button class="mt-3 lg:mt-0 w-full lg:w-1/2 lg:mr-2" severity="secondary" outlined label="Regresar"
                        icon="pi pi-fw pi-arrow-left" @click="regresarCarrito()"></Button>
                    <Button class="mt-3 lg:mt-0 w-full lg:w-1/2 lg:mr-2" label="Enviar Presupuesto"
                        icon="pi pi-fw pi-check" @click="presupuestoEnviado()"></Button>
                </div>
                <div id="cajaLeyenda"
                    class="col-12 flex flex-column lg:flex-row justify-content-center align-items-center lg:justify-content-end my-6">
                    <p>
                        Los precios están expresados en pesos, en caso de surgir variaciones el vendedor se pondrá en
                        contacto con usted.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
