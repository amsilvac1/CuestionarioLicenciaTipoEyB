<template>
  <div class="question-card glass-card" :class="{ 'card-answered': seleccion }">
    <!-- Header with question number indicator -->
    <header class="card-header">
      <span class="question-badge">Pregunta</span>
    </header>

    <!-- Question text -->
    <h2 class="card-question">{{ pregunta.pregunta }}</h2>

    <!-- Image (if any) -->
    <div class="card-media" v-if="pregunta.imagen">
      <div class="media-frame">
        <img
          :src="imagenSrc"
          :alt="`Imagen pregunta ${pregunta.id || ''}`"
          loading="lazy"
          @error="imgError = true"
        />
        <div class="media-overlay" v-if="imgError">
          <span class="media-fallback">🖼️ Imagen no disponible</span>
        </div>
      </div>
    </div>

    <!-- Options -->
    <div class="card-options">
      <button
        v-for="(opcion, idx) in pregunta.opciones"
        :key="opcion"
        class="option-btn"
        :class="buttonClass(opcion)"
        :disabled="bloqueado"
        @click="handleSelect(opcion)"
      >
        <span class="option-letter">{{ letters[idx] }}</span>
        <span class="option-label">{{ opcion }}</span>
        <span
          class="option-icon"
          v-if="seleccion && opcion === pregunta.respuesta"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <span
          class="option-icon"
          v-if="
            seleccion &&
            opcion === seleccion &&
            seleccion !== pregunta.respuesta
          "
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      </button>
    </div>

    <!-- Footer -->
    <footer class="card-footer" v-if="seleccion">
      <div
        class="feedback-msg"
        :class="esCorrecta ? 'feedback-correct' : 'feedback-wrong'"
      >
        <span v-if="esCorrecta">✅ ¡Correcto!</span>
        <span v-else>❌ Respuesta incorrecta</span>
      </div>
      <button class="btn btn-primary next-btn" @click="goToNext">
        Siguiente
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </footer>
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
const imgError = ref(false)
const letters = ['A', 'B', 'C', 'D', 'E', 'F']

const imagenSrc = computed(() => {
  const img = props.pregunta?.imagen
  if (!img) return ''
  if (img.startsWith('/')) {
    return `${import.meta.env.BASE_URL}${img.slice(1)}`
  }
  return img
})

const esCorrecta = computed(() => {
  return seleccion.value === props.pregunta.respuesta
})

function buttonClass(opcion) {
  if (!seleccion.value) return ''
  if (opcion === props.pregunta.respuesta) return 'opt-correct'
  if (
    opcion === seleccion.value &&
    seleccion.value !== props.pregunta.respuesta
  )
    return 'opt-wrong'
  return 'opt-dim'
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
/* ── Card Container ── */
.question-card {
  padding: 28px;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: scaleIn 0.35s var(--ease-out) both;
  position: relative;
  overflow: hidden;
}

/* Subtle top‑border accent glow */
.question-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--clr-accent),
    var(--clr-accent-light),
    var(--clr-accent)
  );
  border-radius: 3px 3px 0 0;
  opacity: 0.7;
}

/* ── Header ── */
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.question-badge {
  font-size: var(--fs-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--clr-accent-light);
  background: var(--clr-accent-bg);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(108, 92, 231, 0.2);
}

/* ── Question Title ── */
.card-question {
  font-size: var(--fs-lg);
  font-weight: 600;
  line-height: 1.45;
  color: var(--clr-text-h);
}

/* ── Media ── */
.card-media {
  display: flex;
  justify-content: center;
}

.media-frame {
  position: relative;
  width: 100%;
  max-width: 520px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--clr-border);
}

.media-frame img {
  width: 100%;
  max-height: 260px;
  object-fit: contain;
  display: block;
  transition: transform var(--t-slow) var(--ease-out);
}

.media-frame:hover img {
  transform: scale(1.02);
}

.media-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--clr-surface-2);
}

.media-fallback {
  font-size: var(--fs-sm);
  color: var(--clr-text-muted);
}

/* ── Options ── */
.card-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border);
  background: rgba(255, 255, 255, 0.02);
  color: var(--clr-text);
  font-family: var(--ff-sans);
  font-size: var(--fs-base);
  font-weight: 500;
  cursor: pointer;
  transition:
    transform var(--t-fast) var(--ease-spring),
    border-color var(--t-fast) var(--ease-out),
    background var(--t-fast) var(--ease-out),
    box-shadow var(--t-normal) var(--ease-out);
  position: relative;
  overflow: hidden;
}

.option-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.08), transparent);
  opacity: 0;
  transition: opacity var(--t-fast) var(--ease-out);
}

.option-btn:hover:not(:disabled)::before {
  opacity: 1;
}

.option-btn:hover:not(:disabled) {
  border-color: var(--clr-accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(108, 92, 231, 0.15);
}

.option-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.99);
}

.option-btn:disabled {
  cursor: default;
}

/* Letter badge */
.option-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  font-size: var(--fs-sm);
  font-weight: 700;
  color: var(--clr-text-muted);
  flex-shrink: 0;
  transition:
    background var(--t-fast) var(--ease-out),
    color var(--t-fast) var(--ease-out),
    border-color var(--t-fast) var(--ease-out);
}

.option-btn:hover:not(:disabled) .option-letter {
  background: var(--clr-accent-bg);
  color: var(--clr-accent-light);
  border-color: rgba(108, 92, 231, 0.3);
}

.option-label {
  flex: 1;
  line-height: 1.4;
}

.option-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  animation: scaleIn 0.25s var(--ease-spring) both;
}

/* ── Correct / Wrong / Dim states ── */
.opt-correct {
  border-color: var(--clr-correct) !important;
  background: var(--clr-correct-bg) !important;
}
.opt-correct .option-letter {
  background: var(--clr-correct) !important;
  color: #fff !important;
  border-color: var(--clr-correct) !important;
}
.opt-correct .option-icon {
  color: var(--clr-correct);
}
.opt-correct .option-label {
  color: var(--clr-text-h);
}

.opt-wrong {
  border-color: var(--clr-wrong) !important;
  background: var(--clr-wrong-bg) !important;
}
.opt-wrong .option-letter {
  background: var(--clr-wrong) !important;
  color: #fff !important;
  border-color: var(--clr-wrong) !important;
}
.opt-wrong .option-icon {
  color: var(--clr-wrong);
}

.opt-dim {
  opacity: 0.4;
}

/* ── Footer ── */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 8px;
  border-top: 1px solid var(--clr-border);
  animation: fadeInUp 0.3s var(--ease-out) both;
}

.feedback-msg {
  font-size: var(--fs-sm);
  font-weight: 600;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
}

.feedback-correct {
  background: var(--clr-correct-bg);
  color: var(--clr-correct);
  border: 1px solid var(--clr-correct-border);
}

.feedback-wrong {
  background: var(--clr-wrong-bg);
  color: var(--clr-wrong);
  border: 1px solid var(--clr-wrong-border);
}

.next-btn {
  padding: 10px 22px;
  font-size: var(--fs-sm);
  font-weight: 700;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .question-card {
    padding: 20px 16px;
    gap: 16px;
  }

  .card-question {
    font-size: var(--fs-md);
  }

  .media-frame img {
    max-height: 180px;
  }

  .option-btn {
    padding: 12px 14px;
    font-size: var(--fs-sm);
    gap: 10px;
  }

  .option-letter {
    width: 28px;
    height: 28px;
    font-size: var(--fs-xs);
  }

  .card-footer {
    flex-direction: column;
    gap: 12px;
  }

  .next-btn {
    width: 100%;
  }
}
</style>
