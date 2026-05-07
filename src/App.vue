<script setup>
import { ref, watch, provide } from 'vue'
import QuizView from './views/QuizView.vue'

/* ── Theme ──────────────────────────────────── */
const isDark = ref(false)

watch(isDark, (dark) => {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, { immediate: true })

function toggleTheme() {
  isDark.value = !isDark.value
}

/* ── Font scale ─────────────────────────────── */
// Steps: 0.85 · 1 · 1.15 · 1.30 · 1.45
const SCALES = [0.85, 1, 1.15, 1.30, 1.45]
const scaleIdx = ref(1)              // default = 1 (scale = 1)

const fontScale = ref(SCALES[scaleIdx.value])

watch(fontScale, (val) => {
  document.documentElement.style.setProperty('--font-scale', val)
}, { immediate: true })

function increaseFontSize() {
  if (scaleIdx.value < SCALES.length - 1) {
    scaleIdx.value++
    fontScale.value = SCALES[scaleIdx.value]
  }
}

function decreaseFontSize() {
  if (scaleIdx.value > 0) {
    scaleIdx.value--
    fontScale.value = SCALES[scaleIdx.value]
  }
}

provide('isDark', isDark)
provide('toggleTheme', toggleTheme)
provide('fontScale', fontScale)
provide('increaseFontSize', increaseFontSize)
provide('decreaseFontSize', decreaseFontSize)
provide('scaleIdx', scaleIdx)
provide('scaleMax', SCALES.length - 1)
</script>

<template>
  <div id="app">
    <!-- ── Global Toolbar ── -->
    <header class="app-toolbar glass-card">
      <div class="toolbar-left">
        <span class="toolbar-logo">🚗 Licencia Ecuador</span>
      </div>
      <div class="toolbar-controls">
        <!-- Font size controls -->
        <div class="font-controls">
          <span class="control-label">Texto</span>
          <button
            class="ctrl-btn"
            :disabled="scaleIdx <= 0"
            @click="decreaseFontSize"
            title="Reducir tamaño de letra"
            aria-label="Reducir tamaño de letra"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          <span class="font-indicator">
            <span
              v-for="(_, i) in 5"
              :key="i"
              class="dot"
              :class="{ active: i === scaleIdx }"
            ></span>
          </span>
          <button
            class="ctrl-btn"
            :disabled="scaleIdx >= scaleMax"
            @click="increaseFontSize"
            title="Aumentar tamaño de letra"
            aria-label="Aumentar tamaño de letra"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        <!-- Theme toggle -->
        <button
          class="theme-toggle-btn"
          @click="toggleTheme"
          :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          :aria-label="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
        >
          <!-- Sun icon – light mode -->
          <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <!-- Moon icon – dark mode -->
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <span class="theme-label">{{ isDark ? 'Modo claro' : 'Modo oscuro' }}</span>
        </button>
      </div>
    </header>

    <div id="center">
      <QuizView />
    </div>
  </div>
</template>

<style>
/* App-level styles (not scoped) */
.app-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px;
  margin: 16px 16px 0;
  border-radius: var(--radius-lg);
  gap: 16px;
  position: sticky;
  top: 12px;
  z-index: 100;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-logo {
  font-weight: 800;
  font-size: var(--fs-md);
  color: var(--clr-text-h);
  letter-spacing: -0.01em;
}

.toolbar-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Font controls */
.font-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--clr-surface-2);
  border-radius: var(--radius-pill);
  border: 1px solid var(--clr-border);
}

.control-label {
  font-size: var(--fs-xs);
  font-weight: 700;
  color: var(--clr-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-right: 2px;
}

.ctrl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--clr-border);
  background: var(--clr-surface);
  color: var(--clr-text);
  cursor: pointer;
  transition:
    background var(--t-fast) var(--ease-out),
    border-color var(--t-fast) var(--ease-out),
    color var(--t-fast) var(--ease-out),
    transform var(--t-fast) var(--ease-spring);
}

.ctrl-btn:hover:not(:disabled) {
  background: var(--clr-accent-bg);
  border-color: var(--clr-accent);
  color: var(--clr-accent-light);
  transform: scale(1.1);
}

.ctrl-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.ctrl-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.font-indicator {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 0 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--clr-border);
  transition: background var(--t-fast) var(--ease-out),
              transform var(--t-fast) var(--ease-spring);
}

.dot.active {
  background: var(--clr-accent);
  transform: scale(1.4);
}

/* Theme toggle */
.theme-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--clr-border);
  background: var(--clr-surface-2);
  color: var(--clr-text);
  font-family: var(--ff-sans);
  font-size: var(--fs-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    background var(--t-fast) var(--ease-out),
    border-color var(--t-fast) var(--ease-out),
    color var(--t-fast) var(--ease-out),
    transform var(--t-fast) var(--ease-spring),
    box-shadow var(--t-normal) var(--ease-out);
}

.theme-toggle-btn:hover {
  background: var(--clr-accent-bg);
  border-color: var(--clr-accent);
  color: var(--clr-accent-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.15);
}

.theme-toggle-btn:active {
  transform: scale(0.97);
}

.theme-label {
  white-space: nowrap;
}

/* Responsive toolbar */
@media (max-width: 600px) {
  .app-toolbar {
    margin: 10px 8px 0;
    padding: 8px 14px;
  }

  .toolbar-logo {
    font-size: var(--fs-sm);
  }

  .theme-label {
    display: none;
  }

  .control-label {
    display: none;
  }
}
</style>
