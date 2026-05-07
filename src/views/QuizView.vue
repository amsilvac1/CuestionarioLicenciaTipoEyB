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

      <button class="view-all" @click="toggleRespuestas">
        {{ verRespuestas ? 'Volver al cuestionario' : 'Ver todas las respuestas' }}
      </button>

      <div class="quiz-info" v-if="!verRespuestas">
        <p>Preguntas por intento: <strong>{{ total }}</strong></p>
        <p>Respondidas: <strong>{{ respondidas }}</strong></p>
        <p>Correctas: <strong>{{ puntaje }}</strong></p>
      </div>
    </aside>

    <main class="quiz-root">
      <div v-if="verRespuestas">
        <section class="answers-view">
          <h2>
            Respuestas de licencia tipo <span class="tipo">{{ tipoLicencia }}</span>
          </h2>
          <p class="answers-meta">
            Total de preguntas: <strong>{{ todasPreguntas.length }}</strong>
          </p>

          <div class="answers-list">
            <div v-for="p in todasPreguntas" :key="p.id" class="answer-item">
              <div class="answer-q">
                <span class="q-id">#{{ p.id }}</span>
                <span class="q-text">{{ p.pregunta }}</span>
              </div>
              <div v-if="p.imagen" class="answer-media">
                <img
                  class="answer-img"
                  :src="imagenSrc(p.imagen)"
                  :alt="`Imagen pregunta ${p.id}`"
                  loading="lazy"
                />
              </div>
              <div class="answer-options">
                <p class="options-title">Opciones:</p>
                <ul class="options-list">
                  <li
                    v-for="op in p.opciones"
                    :key="op"
                    :class="[
                      'option-pill',
                      op === p.respuesta ? 'option-correct' : 'option-wrong',
                    ]"
                  >
                    <span class="badge" v-if="op === p.respuesta">Correcta</span>
                    <span class="badge badge-wrong" v-else>Incorrecta</span>
                    <span class="option-text">{{ op }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-else-if="current && !finished">
        <QuestionCard
          :key="current.id"
          :pregunta="current"
          @responder="verificarRespuesta"
        />
        <h3 class="score">Puntaje actual: {{ puntaje }} / {{ total }}</h3>
      </div>

      <Resultados
        v-else-if="finished"
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

function imagenSrc(img) {
  if (!img) return ''
  if (img.startsWith('/')) {
    return `${import.meta.env.BASE_URL}${img.slice(1)}`
  }
  return img
}

const MAX_QUESTIONS = 20
const tipoLicencia = ref('E')
const puntaje = ref(0)
const queue = ref([])
const totalCount = ref(0)
const finished = ref(false)
const verRespuestas = ref(false)

const current = computed(() => (queue.value.length ? queue.value[0] : null))
const total = computed(() => totalCount.value)
const respondidas = computed(() => total.value - queue.value.length)
const todasPreguntas = computed(() => preguntasPorTipo(tipoLicencia.value))

function preguntasPorTipo(tipo) {
  return allPreguntas.filter((p) => {
    const base = p.id >= 1 && p.id <= 139
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
  if (!verRespuestas.value) inicializarQuiz()
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

function toggleRespuestas() {
  verRespuestas.value = !verRespuestas.value
  if (!verRespuestas.value) {
    // Si volvemos al cuestionario, recalculamos con la licencia seleccionada.
    inicializarQuiz()
  }
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

.view-all {
  width: 100%;
  border: 1px solid var(--border);
  background: transparent;
  color: inherit;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 800;
  margin-bottom: 14px;
}

.view-all:hover:not(:disabled) {
  background: rgba(11, 132, 255, 0.12);
  border-color: rgba(11, 132, 255, 0.7);
}

.view-all:active {
  transform: translateY(1px);
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

.answers-view {
  padding: 10px 2px 0;
}

.answers-view h2 {
  margin: 0 0 8px;
}

.tipo {
  color: var(--accent);
}

.answers-meta {
  margin: 0 0 14px;
  color: var(--text-h);
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100vh - 120px);
  overflow: auto;
  padding-right: 6px;
}

.answer-item {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.22);
  padding: 14px;
}

.answer-media {
  margin: 6px 0 10px;
}

.answer-img {
  width: 100%;
  max-width: 560px;
  max-height: 200px;
  height: auto;
  display: block;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.answer-q {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: baseline;
  margin-bottom: 10px;
}

.q-id {
  font-weight: 900;
  color: var(--accent);
}

.q-text {
  font-weight: 700;
}

.answer-a {
  color: var(--text-h);
}

.answer-options {
  margin-top: 6px;
}

.options-title {
  margin: 0 0 6px;
  font-size: 0.9rem;
  color: var(--text-h);
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.option-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: 0.92rem;
}

.option-correct {
  border-color: #00a31e;
  background: rgba(0, 163, 30, 0.12);
}

.option-wrong {
  opacity: 0.85;
}

.badge {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 999px;
  background: #00a31e;
  color: #fff;
}

.badge-wrong {
  background: #555;
}

.option-text {
  flex: 1;
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

@media (max-width: 600px) {
  .answer-item {
    padding: 12px;
  }

  .answer-img {
    max-height: 150px;
  }
}
</style>
