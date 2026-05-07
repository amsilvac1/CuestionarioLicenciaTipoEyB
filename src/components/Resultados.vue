<template>
  <div class="resultados">
    <h2>Resultados</h2>
    <p>
      Nota final: <strong>{{ puntaje }}</strong> / <strong>{{ total }}</strong>
    </p>
    <p class="nota-sobre">Calificación sobre 20: <strong>{{ notaSobre20 }}</strong></p>
    <p>Correctas: <strong>{{ puntaje }}</strong> | Incorrectas: <strong>{{ incorrectas }}</strong></p>

    <div class="actions">
      <button @click="$emit('restart-all')">Reiniciar todo</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  puntaje: Number,
  total: Number,
})

const notaSobre20 = computed(() => {
  if (!props.total) return '0.00'
  return ((props.puntaje / props.total) * 20).toFixed(2)
})

const incorrectas = computed(() => {
  if (!props.total) return 0
  return props.total - props.puntaje
})
</script>

<style scoped>
.resultados {
  text-align: center;
}

.nota-sobre {
  margin-top: 6px;
}
.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.actions button {
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  background: var(--accent);
  color: white;
  cursor: pointer;
}
.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
