<script setup>
import { computed, ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';
import axios from "axios";
import userConfig from '../../../user-config';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const rememberMe = ref(false);
const { layoutConfig } = useLayout();
const darkMode = computed(() => {
    return layoutConfig.colorScheme.value !== 'light';
});

onBeforeMount(async () => {
    try {
    userConfig.desloguearUsuario()
    const response = await axiosConfig.post('users/logout');
    // Redireccionar a la pantalla de inicio de sesión     window.location.href = '/login'; // Reemplaza '/login' con la ruta correcta a tu pantalla de inicio de sesión
    return response.data;
  } catch (error) {
    console.error('Error al cerrar sesión', error);
   }
});

const navigateToDashboard = () => {
    router.push({ name: 'homecategorias' });
};

function guardarDatos(data, user) {
    userConfig.configurarUsuario(data);
    sessionStorage.setItem('user', JSON.stringify(user));
    console.log("sessionStorage", userConfig.obtenerUsuarioVariable("token"));

};
const cerrarSesionAnterior = async (email, password) => {
    try {
        const cerrarSesionResponse = await axios.post(
            `http://127.0.0.1:8086/K2BAquaGlassAppWeb/api/users/login`,
            {
                user: email,
                pass: password,
                cerrarSesionAnterior: "SI",
            }
        );

        guardarDatos(cerrarSesionResponse.data.data, email);
        console.log("Respuesta de cerrar sesión:", cerrarSesionResponse.data.data);
        // Redirigir a la página "product-list"
        router.push({ name: 'homecategorias' });
    } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
    }
};

const login = async (email, password) => {
    try {
        // Mostrar datos enviados en la consola
        console.log("Datos enviados:", { user: email, pass: password });

        // Realizar la solicitud HTTP
        const response = await axios.post(
            `http://127.0.0.1:8086/K2BAquaGlassAppWeb/api/users/login`,
            {
                user: email,
                pass: password
            }
        );
        console.log(response)
        // Verificar si la respuesta indica que la sesión está abierta en otro dispositivo
        if (response.data.error && response.data.errorMensaje === "SESION_ACTIVA_EN_OTRO_DISPOSITIVO") {
            // Preguntar al usuario si desea cerrar la sesión anterior
            confirm.require({
                message: '¿Deseas cerrar la sesión anterior?',
                header: 'Existe una sesión anterior abierta',
                icon: 'pi pi-user',
                acceptLabel: 'Cerrar sesión',
                rejectLabel: 'Cancelar',
                accept: async () => {
                    await cerrarSesionAnterior(email, password);
                    navigateToDashboard()
                },
                reject: () => {
                }
            });
            
        }
        else if (response.data.error && response.data.errorMensaje === "CREDENCIALES_INVALIDAS") {
            // Mostrar mensaje de error con Toast
            toast.add({ severity: 'error', summary: 'Credenciales invalidas', detail: 'Tus credenciales son inválidas revisalas y vuelve a intentarlo' });
        }
        else if (response.data.error && response.data.errorMensaje === "CREDENCIALES_INVALIDAS") {
            // Mostrar mensaje de error con Toast
            toast.add({ severity: 'error', summary: 'Credenciales invalidas', detail: 'Tus credenciales son inválidas revisalas y vuelve a intentarlo' });
        }
        
        else {
            // Mostrar la respuesta del servidor en la consola
            console.log("Respuesta del servidor:", response.data.data);
            guardarDatos(response.data.data, email);

            // Redirigir a la página "product-list"
            router.push({ name: 'homecategorias' });
        }
    } catch (error) {
        // Manejar errores
        console.error("Error en la solicitud:", error.message);
    }
};



</script>

<style scoped>
#body {
    background: url('../../../assets/imagenesCarrousel/aquafondo2.jpeg') no-repeat center center fixed;
    background-size: cover;
    position: relative;
    height: 100vh;
    overflow: hidden;
  }


#body::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Color gris con opacidad */
    z-index: -1; /* Para que el pseudo-elemento esté detrás del contenido */
}

#LogoAqua {
    width: 180px;
    height: auto;
    padding-bottom: 5%;
}

.containerLogo {
    display: flex;
    justify-content: center;
    /* Centrar horizontalmente */
    padding-bottom: 5%;
}
#footer {
  text-align: left;
  padding-left: 3%;
  padding-right: 1%;
  margin-left: 3%;
  font-size: 14px;
}

#containerFooter {
  background-color: #65C5F4;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #3B3662;
}

.image-footer {
  width: 160px;
  height: auto;
  padding-left: 2%;
  margin-left: 4%;
  padding-top: 3px;
  padding-bottom: 3px;
}
</style>
<template>
    <div id="body" class="px-5 min-h-screen flex justify-content-center align-items-center">
        <Toast />
        <ConfirmDialog />

        <div class="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
            <div class="containerLogo">
                <img id=LogoAqua src="../../../assets/imagenesCarrousel/aqualogo.png" alt="Logo" />
            </div>
            <!-- <div class="mb-4">
                <div class="text-900 text-xl font-bold mb-2">Inicia sesion</div>
                <span class="text-600 font-medium">Por favor ingresa tus credenciales </span>
            </div> -->
            <div class="flex flex-column">
                <span class="p-input-icon-left w-full mb-4">
                    <i class="pi pi-envelope"></i>
                    <InputText v-model="email" id="email" type="text" class="w-full md:w-25rem" placeholder="Usuario" />
                </span>
                <span class="p-input-icon-left w-full mb-4">
                    <i class="pi pi-lock"></i>
                    <InputText v-model="password" id="password" type="password" class="w-full md:w-25rem"
                        placeholder="clave" />
                </span>
                <!-- <div class="mb-4 flex flex-wrap gap-3">
                    <div>
                        <Checkbox name="checkbox" v-model="rememberMe" binary class="mr-2"></Checkbox>
                        <label for="checkbox" class="text-900 font-medium mr-8"> Recuerdame </label>
                    </div>
                    <a
                        class="text-600 cursor-pointer hover:text-primary cursor-pointer ml-auto transition-colors transition-duration-300">Resetea
                        tu clave</a>
                </div> -->
                <Button label="Ingresar" class="w-full" @click="() => login(email, password)"></Button>
            </div>
            
        </div>
    
    </div>
 
</template>
