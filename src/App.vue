<script setup>
import { ref } from 'vue';

const year = ref(new Date().getFullYear());


</script>

<template>
    <div id="app">
        <router-view :key="$route.path"/>

        <footer id="containerFooter" class=" text-white py-4">
            <div class="container">
                <div class="row">
                  
                    <div class="col-md-9">
                        <div id="footer">
                            <div class="image-footer">
                                <a href="https://www.kaizen2b.com/nosotros/">
                                <img src=".../../assets/imagenesCarrousel/logoFooter.png" alt="Logo" />  </a>
                            </div>
                            <p>
                                ACERCA DE: desarrollado por Ailin Baudin + Fabian Robles + Ignacio Ferreyra de KAIZEN2B.COM
                                Copyright.
                                Prop. Intelectual. Derechos reservados, prohibida su reproducción total o parcial.
                                info@kaizen2b.com www.kaizen2b.com “Queda expresamente prohibida, sin autorización escrita
                                de los
                                titulares del copyright, bajo sanciones establecidas por leyes, reproducción total o parcial
                                de esta obra
                                por cualquier medio o procedimiento, comprendidas reprografía y tratamiento informático”.
                                Ley 11723 REGIMEN LEGAL DE LA PROPIEDAD INTELECTUAL.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <v-divider></v-divider>
        </footer>
    
    </div>
</template>

<style scoped>
#containerFooter{
    background-color:#4d5c8a ;

}
.image-footer img {
    width: 100px;
    height: auto;
    display: flex;
    align-items: end; 
    margin-bottom: 1%;
    margin-top: 0%;
    background-color: #4d5c8a;

}

#footer {
    margin-top: 0%;

    font-size: 12px;
    /* Ajusta el tamaño de la fuente según sea necesario */
    text-align: left;
    margin-left: 3%;
    background-color:#4d5c8a ;

}

</style>
