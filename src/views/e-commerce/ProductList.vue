// Este componente Vue.js genera un PDF cuando se hace clic en el botón "Descargar PDF".
// Utiliza la biblioteca jsPDF para crear y guardar el PDF en el cliente.

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from "vue-router";
import axiosConfig from '../../axios-config';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const store = useStore();
const products = ref([]);
const datosCliente = ref(null); // datos del cliente

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
const cantidad = ref(1)
const agregar = async (producto) => {
  cantidad.value = 1
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
// llamada para completar datos del PDF de descargade archivos 
async function obtenerDatosUsuario() {
  try {

    const response = await axiosConfig.get('users/detallecontacto/obtener', {
    });
    datosCliente.value = response.data.data;
    // Ver los datos
    console.log("Datos del usuario para el pdf", datosCliente.value);
  }
  catch (error) {
    console.error('Error al traer datos del usuario para el PDF', error);
  }
}
onMounted(async () => {
  try {
    await productosObtener();
    await obtenerDatosUsuario()
    // Libreria jspdf para crear el pdf
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    script.onload = cargarPluginAutoTable; // Esperar a que se cargue la librería jspdf
    document.body.appendChild(script);
  } catch (error) {
    console.error('Error al cargar productos', error);
  }
});

const cargarPluginAutoTable = () => {
  // Plugin autotable para crear un formato de tabla
  const script2 = document.createElement('script');
  script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.14/jspdf.plugin.autotable.min.js';
  script2.async = true;
  document.body.appendChild(script2);
}

const route =useRoute()
async function productosObtener() {
  try {
    let nombre = route.params.slug
    let categorias = JSON.parse(sessionStorage.getItem('categorias'))
    let id = categorias.items.filter(x => x.label === nombre)[0]
    const response = await axiosConfig.get('users/productos/obtener', {
      // Agregar idCategoria como query parameter en la solicitud
      params: {
        idCategoria: id ? id.id : null,
      },
    });
    products.value = response.data.data;
    // Ver los datos
    console.log("Datos de la lista de productos:", products.value);
  }
  catch (error) {
    console.error('ERROR EN PRODUCTOS DE URL OBTENE RPRODUCTOS', error);
  }
}

// Función para generar el PDF
// Método para generar el PDF
const generarPDF = async () => {
  await obtenerDatosUsuario();
  const currentDate = new Date();
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const formattedDate = currentDate.toLocaleString('es-AR', options); // Obtener la fecha y hora actual en formato local (por ejemplo, "26/03/2024 15:30:00")

  const doc = new window.jspdf.jsPDF(); // Instancia de jsPDF

  // Agregar la imagen del logo en la esquina superior izquierda
  const logo = await import('../../assets/demo/flags/aqualogo.png'); // Importa el logo desde la ruta correcta
  const logoWidth = 50; // Ancho de la imagen del logo
  const logoHeight = 15; // Alto de la imagen del logo
  const marginLeft = 15; // Cambiamos la posición izquierda para colocar el logo en el lado izquierdo
  const marginTop = 10; // Margen superior para posicionar la imagen
  const marginBottom = 8; // Margen superior para posicionar la imagen

  doc.addImage(logo.default, 'PNG', marginLeft, marginTop, logoWidth, logoHeight, marginBottom); // Agrega el logo en la posición especificada

  let pageNumber = 1; // Inicializar el número de página

  // Crear una función para agregar el número de página al pie de página
  const addPageFooter = () => {
    const totalPages = doc.internal.getNumberOfPages(); // Obtener el número total de páginas
    doc.setFontSize(10); // Tamaño de fuente para el número de página
    doc.text(`Página ${pageNumber} de ${totalPages}`, doc.internal.pageSize.width - 50, doc.internal.pageSize.height - 10, { align: 'right' }); // Agregar número de página al pie de página
    pageNumber++; // Incrementar el número de página
  };

// Agregar los datos del cliente disponibles
if (datosCliente.value) {
  const logoWidth = 50; // Ancho de la imagen del logo
  const logoHeight = 15; // Alto de la imagen del logo
  const marginLeft = 15; // Margen izquierdo para el logo
  const marginTop = 4; // Margen superior para el logo

  const startY = marginTop + logoHeight + 16; // Espacio adicional en la parte superior de los textos
  const marginLeftDatos = marginLeft; // posición izquierda para alinear los datos con el logo

  doc.setFontSize(10);
  doc.text(`Empresa: ${datosCliente.value.nombreEmpresa}`, marginLeftDatos, startY); // empresa
  doc.text(`Contacto: ${datosCliente.value.nombreContacto} ${datosCliente.value.apellidoContacto}`, marginLeftDatos, startY + 4); // nombre completo
  doc.text(`Email: ${datosCliente.value.emailContacto}`, marginLeftDatos, startY + 8); // email
}
  // Agregar primera página
  const tableStartY = datosCliente.value ? marginTop + logoHeight + 30 : marginTop + logoHeight + 5; // Ajustamos la posición de inicio de la tabla
  doc.autoTable({
    startY: tableStartY, // Espacio adicional en la parte superior de la tabla
    head: [['Fecha hora lista', 'Producto', 'Codigo', 'Numero de lista', 'Stock', 'Categoria', 'Precio unitario','Moneda']],
    body: products.value.map(producto => [formattedDate, producto.nombre, producto.codigo, producto.nroListaPrecio, producto.stock, producto.nombreCategoria, Number(producto.precioVentaConIva).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })  ,producto.signoMoneda]),
    headStyles: {
      fillColor: [225, 143, 64],
      textColor: [255, 255, 255]
    },
    bodyStyles: {
      fillColor: [255, 255, 255]
    },
    didDrawPage: addPageFooter // paginador
  });
  
  // Guardar el PDF con un nombre de archivo específico
  doc.save(`Productos-Aquaglass-${formattedDate}.pdf`);
};

// REDIRECCION
const redirectToShoppingCart = () => {
  // Redirigir a la ruta del carrito de compras
  router.push({ name: 'shopping-cart' });
};
//redirect para pantalla detalle de prodictos
const redirectToDetalleProductos = (idProducto) => {
  router.push({ name: 'productos-detalle', params: { id: idProducto } });
};
</script>

<template>
  <div class="card">
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
  <div class="text-900 font-medium text-4xl mb-4">Productos</div>
    <p class="mt-0 p-0 mb-5 text-700 text-2xl">Lista de productos</p>
    <div class="grid -mt-3 -ml-3 -mr-3">
    <div v-for="product in products" :key="product.id" class="col-12 md:col-6 lg:col-3 mb-5 lg:mb-0">
    <div class="mb-3 relative">
    <img  :src="product.urlImagen" class="w-full" :alt="product.nombre" />
    <div class="button-container">
      <div class="button-wrapper">
        <Button @click="agregar(product)" type="button"
          class="border-1 border-white border-round py-2 px-3 bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer">
          <i class="pi pi-shopping-cart mr-3 text-base"></i>
          <span class="text-base">Agregar al carrito</span>
        </Button>
      </div>
      <div class="button-wrapper">
        <Button @click="redirectToDetalleProductos(product.id)" type="button"
          class="border-1 border-white border-round py-2 px-3 bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer">
          <i class="pi pi-info-circle mr-3 text-base"></i>
          <span class="text-base">Ver detalles</span>
        </Button>
      </div>
    </div>
  </div>
  <div class="flex flex-column align-items-center">
    <span class="text-xl text-900 font-medium mb-3">{{ product.nombre }}</span>
    <span class="text-primary text-xl font-medium">{{ Number(product.precioVentaConIva).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}</span>
  </div>
</div>
  </div>
    <div class="floating-button">
      <Button label="Continuar" @click="redirectToShoppingCart"></Button>
    
    </div>
    <div class="botonPdf">
      <Button @click="generarPDF">Descargar PDF</Button>
    </div>
  </div>
</template>

<style scoped>
.botonPdf{
  margin-top: 5%;
}
.button-container {
  position: relative;
  display: flex;
  flex-direction: column;
}
.button-wrapper button {
  margin-top: 10px;
  width: 100%;
  display: block;
}
.image-footer img {
    width: 100px;
    height: auto;
    display: flex;
    align-items: end; 
    margin-bottom: 1%;
    margin-top: 0%;
}
#footer {
    margin-top: 0%;

    font-size: 12px;
    /* Ajusta el tamaño de la fuente según sea necesario */
    text-align: left;
    margin-left: 3%;
    padding: 0%;
}
.floating-button {
  position: fixed; /* para que pueda scrollear hacia abajo y mantener los botones */
  top:20%;
  right: 5%;
  z-index: 1000; /* Asegura que el botón esté por encima de otros elementos */
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
#imagenSetear {
  height: 200px !important;
}
</style>