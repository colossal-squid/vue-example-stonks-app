<template>
  <input :value="modelValue" @keydown="onKeyDown" @input="emitUpdate" class="text-field" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    modelValue: String
  },
  emits: ['submit', 'update:modelValue'],
  methods: {
    onKeyDown (e: KeyboardEvent) {
      if (e.key === 'Enter') {
        this.$emit('submit');
      }
    },
    emitUpdate (e: Event): void {
      this.$emit('update:modelValue', (e.target as HTMLInputElement)?.value)
    }
  }
})
</script>
<style lang="scss">
.text-field {
  padding: 12px 0;
  border: none;
  border-bottom: 1px solid var(--color-foreground1);
  background: transparent;
  color: var(--color-foreground3);
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--color-foreground3);
    color: var(--color-foreground3);
  }
}
</style>
