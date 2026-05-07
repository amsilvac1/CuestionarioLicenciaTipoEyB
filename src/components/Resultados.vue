<template>
  <div class="resultados glass-card">
    <!-- Decorative top glow -->
    <div class="results-glow"></div>

    <!-- Icon + Title -->
    <div class="results-header">
      <div class="results-icon" :class="aprobado ? 'icon-pass' : 'icon-fail'">
        <svg v-if="aprobado" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <h2 class="results-title">{{ aprobado ? '¡Felicidades!' : 'Sigue practicando' }}</h2>
      <p class="results-subtitle">{{ aprobado ? 'Has aprobado el cuestionario' : 'Necesitas más preparación' }}</p>
    </div>

    <!-- Score ring -->
    <div class="score-ring-container">
      <svg class="score-ring" viewBox="0 0 120 120">
        <circle class="ring-bg" cx="60" cy="60" r="52" />
        <circle
          class="ring-fill"
          :class="aprobado ? 'ring-pass' : 'ring-fail'"
          cx="60" cy="60" r="52"
          :style="{ strokeDashoffset: ringOffset }"
        />
      </svg>
      <div class="score-ring-text">
        <span class="score-value">{{ notaSobre20 }}</span>
        <span class="score-label">/ 20</span>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-item stat-correct">
        <span class="stat-number">{{ puntaje }}</span>
        <span class="stat-label">Correctas</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item stat-wrong">
        <span class="stat-number">{{ incorrectas }}</span>
        <span class="stat-label">Incorrectas</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-number">{{ total }}</span>
        <span class="stat-label">Total</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="results-actions">
      <button class="btn btn-primary" @click="$emit('restart-all')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        Reiniciar cuestionario
      </button>
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

const aprobado = computed(() => {
  return parseFloat(notaSobre20.value) >= 16
})

// SVG ring math: circumference = 2 * π * 52 ≈ 326.73
const ringOffset = computed(() => {
  const circumference = 2 * Math.PI * 52
  const pct = props.total ? props.puntaje / props.total : 0
  return circumference * (1 - pct)
})
</script>

<style scoped>
.resultados {
  padding: 40px 32px;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  text-align: center;
  position: relative;
  overflow: hidden;
  animation: scaleIn 0.4s var(--ease-out) both;
}

/* Decorative glow */
.results-glow {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 120px;
  border-radius: 50%;
  filter: blur(50px);
  opacity: 0.4;
  pointer-events: none;
}

.icon-pass ~ .results-title { color: var(--clr-correct); }
.icon-fail ~ .results-title { color: var(--clr-wrong); }

.results-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
}

.results-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  animation: scaleIn 0.5s var(--ease-spring) 0.1s both;
}

.icon-pass {
  background: var(--clr-correct-bg);
  color: var(--clr-correct);
  box-shadow: 0 0 30px rgba(0, 200, 83, 0.2);
}

.icon-fail {
  background: var(--clr-wrong-bg);
  color: var(--clr-wrong);
  box-shadow: 0 0 30px rgba(255, 82, 82, 0.2);
}

.results-title {
  font-size: var(--fs-2xl);
  font-weight: 800;
}

.results-subtitle {
  font-size: var(--fs-base);
  color: var(--clr-text-muted);
}

/* ── Score Ring ── */
.score-ring-container {
  position: relative;
  width: 140px;
  height: 140px;
}

.score-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 8;
}

.ring-fill {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 326.73;
  transition: stroke-dashoffset 1s var(--ease-out);
}

.ring-pass { stroke: var(--clr-correct); }
.ring-fail { stroke: var(--clr-wrong); }

.score-ring-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-value {
  font-size: var(--fs-2xl);
  font-weight: 800;
  color: var(--clr-text-h);
  line-height: 1;
}

.score-label {
  font-size: var(--fs-xs);
  color: var(--clr-text-muted);
  font-weight: 600;
  margin-top: 2px;
}

/* ── Stats Grid ── */
.stats-grid {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 24px;
  background: var(--clr-surface-2);
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border);
  width: 100%;
  justify-content: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-number {
  font-size: var(--fs-xl);
  font-weight: 800;
  color: var(--clr-text-h);
}

.stat-correct .stat-number { color: var(--clr-correct); }
.stat-wrong .stat-number   { color: var(--clr-wrong); }

.stat-label {
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--clr-border);
}

/* ── Actions ── */
.results-actions {
  width: 100%;
}

.results-actions .btn {
  width: 100%;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .resultados {
    padding: 28px 20px;
    gap: 22px;
  }

  .stats-grid {
    gap: 16px;
    padding: 14px 16px;
  }
}
</style>
