<template>
    <div class="card flex justify-content-center">
      <Toast position="bottom-center" group="bc" @close="onClose">
        <template #message="slotProps">
          <div class="flex flex-column align-items-start">
            <div class="font-medium text-lg my-3 text-900">{{ slotProps.message.summary }}</div>
            <Button class="p-button-sm" label="Reply" @click="onReply()"></Button>
          </div>
        </template>
      </Toast>
      <Button @click="showTemplate" label="View" />
    </div>
  </template>
  
  <script setup>
  import { useToast } from "primevue/usetoast";
  import { ref, defineProps} from 'vue';
  const props = defineProps(['nombre', 'edad']);
  const edad = ref(props.edad);
  const toast = useToast();
  const visible = ref(false);
  
  const showTemplate = () => {
    if (!visible.value) {
      toast.add({ severity: 'success', summary: 'Can you send me the report?', group: 'bc' });
      visible.value = true;
    }
  };
  
  const onReply = () => {
    toast.removeGroup('bc');
    visible.value = false;
  };
  
  const onClose = () => {
    visible.value = false;
  };
  </script>
  