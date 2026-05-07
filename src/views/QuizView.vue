<template>
  <div class="quiz-layout">
    <aside class="quiz-dashboard">
      <h3>Dashboard</h3>
      <div class="license-selector">
        <strong>Tipo de licencia</strong>
        <button
          class="lic"
          :class="{ active: tipoLicencia === 'B' }"
          @click="cambiarTipoLicencia('B')"
        >
          B
        </button>
        <button
          class="lic"
          :class="{ active: tipoLicencia === 'E' }"
          @click="cambiarTipoLicencia('E')"
        >
          E
        </button>
      </div>

      <div class="quiz-info">
        <p>Preguntas por intento: <strong>{{ total }}</strong></p>
        <p>Respondidas: <strong>{{ respondidas }}</strong></p>
        <p>Correctas: <strong>{{ puntaje }}</strong></p>
      </div>
    </aside>

    <main class="quiz-root">
      <div v-if="current && !finished">
        <QuestionCard
          :key="current.id"
          :pregunta="current"
          @responder="verificarRespuesta"
        />
        <h3 class="score">Puntaje actual: {{ puntaje }} / {{ total }}</h3>
      </div>

      <Resultados
        v-if="finished"
        :puntaje="puntaje"
        :total="total"
        @restart-all="restartAll"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { preguntas as allPreguntas } from '../data/preguntas'
import QuestionCard from '../components/QuestionCard.vue'
import Resultados from '../components/Resultados.vue'

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const MAX_QUESTIONS = 20
const tipoLicencia = ref('E')
const puntaje = ref(0)
const queue = ref([])
const totalCount = ref(0)
const finished = ref(false)

const current = computed(() => (queue.value.length ? queue.value[0] : null))
const total = computed(() => totalCount.value)
const respondidas = computed(() => total.value - queue.value.length)

function preguntasPorTipo(tipo) {
  return allPreguntas.filter((p) => {
    const base = p.id >= 1 && p.id <= 129
    const bloqueE = p.id >= 140 && p.id <= 164
    const bloqueB = p.id >= 165 && p.id <= 178

    if (tipo === 'E') return base || bloqueE
    if (tipo === 'B') return base || bloqueB
    return false
  })
}

function mezclarOpciones(pregunta) {
  return {
    ...pregunta,
    opciones: shuffle(pregunta.opciones),
  }
}

function inicializarQuiz() {
  const banco = preguntasPorTipo(tipoLicencia.value)
  const seleccionadas = shuffle(banco)
    .slice(0, Math.min(MAX_QUESTIONS, banco.length))
    .map(mezclarOpciones)
  queue.value = seleccionadas
  totalCount.value = seleccionadas.length
  puntaje.value = 0
  finished.value = false
}

function cambiarTipoLicencia(tipo) {
  if (tipoLicencia.value === tipo) return
  tipoLicencia.value = tipo
  inicializarQuiz()
}

function verificarRespuesta(payload) {
  if (!payload) return

  if (payload.correcta) {
    puntaje.value++
  }

  queue.value.shift()
  if (queue.value.length === 0) {
    finished.value = true
  }
}

function restartAll() {
  inicializarQuiz()
}

inicializarQuiz()
</script>

<style scoped>
.quiz-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 18px;
  width: 100%;
  max-width: 1120px;
  padding: 18px;
  box-sizing: border-box;
}

.quiz-dashboard {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.88));
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  text-align: left;
  height: fit-content;
  position: sticky;
  top: 16px;
}

.quiz-dashboard h3 {
  margin: 0 0 12px;
}

.license-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.lic {
  border: 1px solid var(--border);
  background: transparent;
  color: inherit;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  font-weight: 700;
}

.lic:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.lic.active {
  border-color: #0b84ff;
  background: rgba(11, 132, 255, 0.18);
}

.quiz-info p {
  margin: 0 0 8px;
}

.quiz-root {
  min-width: 0;
}

.score {
  margin-top: 12px;
  color: var(--text-h);
}

@media (max-width: 900px) {
  .quiz-layout {
    grid-template-columns: 1fr;
    padding: 12px;
  }

  .quiz-dashboard {
    position: static;
  }
}
</style>
