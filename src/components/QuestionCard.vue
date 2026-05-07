<template>
  <div class="question-card">
    <h2 class="q-title">{{ pregunta.pregunta }}</h2>

    <div class="q-media">
      <img
        v-if="pregunta.imagen"
        :src="imagenSrc"
        :alt="`Imagen pregunta ${pregunta.id || ''}`"
        loading="lazy"
      />
    </div>

    <div class="opciones">
      <button
        v-for="opcion in pregunta.opciones"
        :key="opcion"
        :class="buttonClass(opcion)"
        :disabled="bloqueado"
        @click="handleSelect(opcion)"
      >
        <span class="option-text">{{ opcion }}</span>
        <span class="check" v-if="seleccion && opcion === pregunta.respuesta"
          >✔</span
        >
        <span
          class="cross"
          v-if="
            seleccion &&
            opcion === seleccion &&
            seleccion !== pregunta.respuesta
          "
          >✖</span
        >
      </button>
    </div>

    <div class="question-actions" v-if="seleccion">
      <button class="next-btn" @click="goToNext">
        Siguiente pregunta
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  pregunta: Object,
})
const emit = defineEmits(['responder'])

const seleccion = ref(null)
const bloqueado = ref(false)
const imagenSrc = computed(() => {
  const img = props.pregunta?.imagen
  if (!img) return ''
  if (img.startsWith('/')) {
    return `${import.meta.env.BASE_URL}${img.slice(1)}`
  }
  return img
})

function buttonClass(opcion) {
  if (!seleccion.value) return ''
  if (opcion === props.pregunta.respuesta) return 'correct'
  if (
    opcion === seleccion.value &&
    seleccion.value !== props.pregunta.respuesta
  )
    return 'wrong'
  return 'dim'
}

function handleSelect(opcion) {
  if (bloqueado.value) return
  seleccion.value = opcion
  bloqueado.value = true
}

function goToNext() {
  if (!seleccion.value) return
  const correcta = seleccion.value === props.pregunta.respuesta
  emit('responder', {
    seleccion: seleccion.value,
    correcta,
    id: props.pregunta.id,
  })
}
</script>

<style scoped>
.question-card {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.664), rgba(0, 0, 0, 0.95));
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--shadow);
  max-width: 720px;
  width: 100%;
  margin: 0 auto 16px;
  min-height: 760px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.q-title {
  margin-bottom: 12px;
}

.q-media {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  min-height: 250px;
}

.q-media img {
  width: 100%;
  max-width: 560px;
  max-height: 250px;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.opciones {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.opciones button {
  text-align: left;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: transparent;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s;
  font-size: 16px;
}

.opciones button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.opciones button.correct {
  border-color: #00a31e;
}

.opciones button.wrong {
  border-color: #ff0000;
}

.opciones button.dim {
  opacity: 0.7;
}

.opciones button:disabled {
  cursor: default;
}

.question-actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}

.next-btn {
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #0b84ff, #5f38ff);
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  padding: 10px 18px;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition:
    transform 0.12s ease,
    filter 0.2s ease;
}

.next-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.next-btn:active {
  transform: translateY(0);
}

.next-btn:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

@media (max-width: 600px) {
  .question-card {
    min-height: 690px;
  }

  .q-media img {
    max-height: 160px;
  }

  .opciones button {
    font-size: 15px;
  }

  .question-actions {
    justify-content: center;
  }

  .next-btn {
    width: 100%;
    max-width: 320px;
  }
}
</style>
