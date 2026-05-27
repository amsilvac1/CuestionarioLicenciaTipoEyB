<template>
  <section class="quiz-switcher" :class="{ compact }">
    <div v-if="title || description" class="switcher-heading">
      <p v-if="eyebrow" class="switcher-eyebrow">{{ eyebrow }}</p>
      <h3 v-if="title" class="switcher-title">{{ title }}</h3>
      <p v-if="description" class="switcher-description">{{ description }}</p>
    </div>

    <div class="switcher-grid">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        class="switcher-card"
        :class="{ active: item.key === modelValue, compact }"
        @click="selectItem(item.key)"
      >
        <span class="switcher-card-title">{{ item.title }}</span>
        <span v-if="item.subtitle" class="switcher-card-subtitle">
          {{ item.subtitle }}
        </span>
        <span v-if="item.description && !compact" class="switcher-card-copy">
          {{ item.description }}
        </span>
      </button>
    </div>
  </section>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  compact: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

function selectItem(key) {
  emit('update:modelValue', key)
}
</script>

<style scoped>
.quiz-switcher {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.switcher-heading {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.switcher-eyebrow {
  font-size: var(--fs-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--clr-text-muted);
}

.switcher-title {
  font-size: var(--fs-lg);
  font-weight: 800;
}

.switcher-description {
  font-size: var(--fs-sm);
  color: var(--clr-text-muted);
}

.switcher-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.switcher-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
  padding: 16px 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--clr-border);
  background: var(--clr-surface-2);
  color: var(--clr-text);
  text-align: left;
  cursor: pointer;
  transition:
    transform var(--t-fast) var(--ease-spring),
    border-color var(--t-fast) var(--ease-out),
    background var(--t-fast) var(--ease-out),
    box-shadow var(--t-normal) var(--ease-out);
}

.switcher-card:hover {
  transform: translateY(-1px);
  border-color: var(--clr-accent);
  box-shadow: 0 6px 24px rgba(108, 92, 231, 0.12);
}

.switcher-card.active {
  background: var(--clr-accent-bg);
  border-color: var(--clr-accent);
  box-shadow: var(--shadow-glow);
}

.switcher-card.compact {
  padding: 12px 14px;
}

.switcher-card-title {
  font-size: var(--fs-base);
  font-weight: 800;
  line-height: 1.25;
}

.switcher-card-subtitle {
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--clr-text-muted);
}

.switcher-card-copy {
  font-size: var(--fs-xs);
  color: var(--clr-text-muted);
  line-height: 1.45;
}

@media (max-width: 720px) {
  .switcher-grid {
    grid-template-columns: 1fr;
  }
}
</style>
