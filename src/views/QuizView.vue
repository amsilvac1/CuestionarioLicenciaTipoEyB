<template>
  <div class="quiz-layout">
    <!-- ── Sidebar / Dashboard ── -->
    <aside class="sidebar glass-card">
      <!-- Logo / Brand -->
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
        </div>
        <div class="brand-text">
          <h3 class="brand-title">Licencia EC</h3>
          <span class="brand-sub">Cuestionario de práctica</span>
        </div>
      </div>

      <!-- License Type Selector -->
      <div class="sidebar-section">
        <label class="section-label">Tipo de licencia</label>
        <div class="license-toggle">
          <button
            class="toggle-btn"
            :class="{ active: tipoLicencia === 'B' }"
            @click="cambiarTipoLicencia('B')"
          >
            <span class="toggle-letter">B</span>
            <span class="toggle-desc">Particular</span>
          </button>
          <button
            class="toggle-btn"
            :class="{ active: tipoLicencia === 'E' }"
            @click="cambiarTipoLicencia('E')"
          >
            <span class="toggle-letter">E</span>
            <span class="toggle-desc">Profesional</span>
          </button>
        </div>
      </div>

      <!-- Progress (quiz mode) -->
      <div class="sidebar-section" v-if="!verRespuestas && !finished">
        <label class="section-label">Progreso</label>
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: progressPct + '%' }"
          ></div>
        </div>
        <span class="progress-text">{{ respondidas }} / {{ total }} preguntas</span>
      </div>

      <!-- Stats (quiz mode) -->
      <div class="sidebar-section" v-if="!verRespuestas">
        <label class="section-label">Estadísticas</label>
        <div class="sidebar-stats">
          <div class="mini-stat">
            <span class="mini-stat-icon correct-dot"></span>
            <span class="mini-stat-label">Correctas</span>
            <span class="mini-stat-value correct-val">{{ puntaje }}</span>
          </div>
          <div class="mini-stat">
            <span class="mini-stat-icon wrong-dot"></span>
            <span class="mini-stat-label">Incorrectas</span>
            <span class="mini-stat-value wrong-val">{{ incorrectasCount }}</span>
          </div>
        </div>
      </div>

      <!-- View All Answers Button -->
      <div class="sidebar-section sidebar-actions">
        <button class="btn btn-ghost view-answers-btn" @click="toggleRespuestas">
          <svg v-if="!verRespuestas" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          {{ verRespuestas ? 'Volver al cuestionario' : 'Ver todas las respuestas' }}
        </button>
      </div>
    </aside>

    <!-- ── Main Content ── -->
    <main class="quiz-main">
      <!-- Answers View -->
      <div v-if="verRespuestas" class="answers-container">
        <header class="answers-header">
          <h2>
            Respuestas – Licencia tipo
            <span class="accent-text">{{ tipoLicencia }}</span>
          </h2>
          <p class="answers-count">
            {{ todasPreguntas.length }} preguntas en total
          </p>
        </header>

        <div class="answers-list">
          <div
            v-for="p in todasPreguntas"
            :key="p.id"
            class="answer-card glass-card"
          >
            <div class="answer-header">
              <span class="answer-id">#{{ p.id }}</span>
              <span class="answer-question">{{ p.pregunta }}</span>
            </div>

            <div v-if="p.imagen" class="answer-media">
              <img
                class="answer-img"
                :src="imagenSrc(p.imagen)"
                :alt="`Imagen pregunta ${p.id}`"
                loading="lazy"
              />
            </div>

            <ul class="answer-options">
              <li
                v-for="op in p.opciones"
                :key="op"
                class="answer-option"
                :class="op === p.respuesta ? 'answer-opt-correct' : 'answer-opt-default'"
              >
                <span class="badge" :class="op === p.respuesta ? 'badge-correct' : 'badge-wrong'">
                  {{ op === p.respuesta ? 'Correcta' : 'Incorrecta' }}
                </span>
                <span class="answer-opt-text">{{ op }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Quiz Active -->
      <div v-else-if="current && !finished" class="quiz-active">
        <div class="quiz-counter">
          <span class="counter-current">{{ respondidas + 1 }}</span>
          <span class="counter-sep">/</span>
          <span class="counter-total">{{ total }}</span>
        </div>

        <QuestionCard
          :key="current.id"
          :pregunta="current"
          @responder="verificarRespuesta"
        />
      </div>

      <!-- Results -->
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
const progressPct = computed(() => {
  if (!total.value) return 0
  return (respondidas.value / total.value) * 100
})
const incorrectasCount = computed(() => {
  return respondidas.value - puntaje.value
})

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
/* ── Layout ── */
.quiz-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  padding: 24px;
  box-sizing: border-box;
  animation: fadeIn 0.4s var(--ease-out) both;
}

/* ── Sidebar ── */
.sidebar {
  padding: 24px 20px;
  height: fit-content;
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--clr-border);
}

.brand-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--clr-accent), #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: var(--fs-md);
  font-weight: 800;
  margin: 0;
  color: var(--clr-text-h);
}

.brand-sub {
  font-size: var(--fs-xs);
  color: var(--clr-text-muted);
  font-weight: 500;
}

/* Sections */
.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-label {
  font-size: var(--fs-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--clr-text-muted);
}

/* License Toggle */
.license-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.toggle-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border);
  background: transparent;
  cursor: pointer;
  transition:
    border-color var(--t-fast) var(--ease-out),
    background var(--t-fast) var(--ease-out),
    transform var(--t-fast) var(--ease-spring),
    box-shadow var(--t-normal) var(--ease-out);
  color: var(--clr-text);
  font-family: var(--ff-sans);
}

.toggle-btn:hover {
  border-color: var(--clr-border-h);
  background: rgba(255, 255, 255, 0.03);
}

.toggle-btn.active {
  border-color: var(--clr-accent);
  background: var(--clr-accent-bg);
  box-shadow: 0 0 16px rgba(108, 92, 231, 0.15);
}

.toggle-letter {
  font-size: var(--fs-xl);
  font-weight: 900;
  color: var(--clr-text-muted);
  transition: color var(--t-fast) var(--ease-out);
}

.toggle-btn.active .toggle-letter {
  color: var(--clr-accent-light);
}

.toggle-desc {
  font-size: var(--fs-xs);
  font-weight: 500;
  color: var(--clr-text-muted);
}

/* Progress */
.progress-text {
  font-size: var(--fs-xs);
  color: var(--clr-text-muted);
  font-weight: 500;
}

/* Stats */
.sidebar-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mini-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--clr-border);
}

.mini-stat-icon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.correct-dot { background: var(--clr-correct); }
.wrong-dot   { background: var(--clr-wrong); }

.mini-stat-label {
  flex: 1;
  font-size: var(--fs-sm);
  color: var(--clr-text-muted);
}

.mini-stat-value {
  font-size: var(--fs-md);
  font-weight: 800;
}

.correct-val { color: var(--clr-correct); }
.wrong-val   { color: var(--clr-wrong); }

/* Actions */
.sidebar-actions {
  margin-top: auto;
}

.view-answers-btn {
  width: 100%;
  font-size: var(--fs-sm);
  padding: 10px 14px;
}

/* ── Main ── */
.quiz-main {
  min-width: 0;
}

/* Quiz counter */
.quiz-active {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.quiz-counter {
  display: flex;
  align-items: baseline;
  gap: 4px;
  animation: fadeInUp 0.3s var(--ease-out) both;
}

.counter-current {
  font-size: var(--fs-2xl);
  font-weight: 900;
  color: var(--clr-accent-light);
}

.counter-sep {
  font-size: var(--fs-lg);
  color: var(--clr-text-muted);
  font-weight: 500;
}

.counter-total {
  font-size: var(--fs-lg);
  font-weight: 600;
  color: var(--clr-text-muted);
}

/* ── Answers View ── */
.answers-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.35s var(--ease-out) both;
}

.answers-header {
  padding: 0 4px;
}

.answers-header h2 {
  margin: 0 0 4px;
  font-size: var(--fs-xl);
}

.accent-text {
  color: var(--clr-accent-light);
}

.answers-count {
  font-size: var(--fs-sm);
  color: var(--clr-text-muted);
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: calc(100dvh - 140px);
  overflow-y: auto;
  padding-right: 4px;
}

.answer-card {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: fadeInUp 0.3s var(--ease-out) both;
}

.answer-header {
  display: flex;
  gap: 10px;
  align-items: baseline;
}

.answer-id {
  font-weight: 900;
  font-size: var(--fs-sm);
  color: var(--clr-accent-light);
  background: var(--clr-accent-bg);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  flex-shrink: 0;
}

.answer-question {
  font-weight: 600;
  color: var(--clr-text-h);
  font-size: var(--fs-base);
  line-height: 1.45;
}

.answer-media {
  display: flex;
  justify-content: center;
}

.answer-img {
  max-width: 480px;
  max-height: 200px;
  width: 100%;
  object-fit: contain;
  border-radius: var(--radius-sm);
  border: 1px solid var(--clr-border);
  background: rgba(0, 0, 0, 0.2);
}

.answer-options {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--clr-border);
  font-size: var(--fs-sm);
  transition: background var(--t-fast) var(--ease-out);
}

.answer-opt-correct {
  border-color: var(--clr-correct-border);
  background: var(--clr-correct-bg);
}

.answer-opt-default {
  opacity: 0.7;
}

.answer-opt-text {
  flex: 1;
  line-height: 1.4;
  color: var(--clr-text);
}

.answer-opt-correct .answer-opt-text {
  color: var(--clr-text-h);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .quiz-layout {
    grid-template-columns: 1fr;
    padding: 16px 12px;
    gap: 16px;
  }

  .sidebar {
    position: static;
    padding: 20px 16px;
    gap: 16px;
  }

  .sidebar-brand {
    padding-bottom: 16px;
  }
}

@media (max-width: 600px) {
  .quiz-layout {
    padding: 12px 8px;
  }

  .answer-card {
    padding: 14px;
  }

  .answer-img {
    max-height: 150px;
  }

  .license-toggle {
    gap: 6px;
  }

  .toggle-btn {
    padding: 10px 6px;
  }
}
</style>
