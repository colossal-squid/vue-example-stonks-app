<template>
  <button :class="{ button: 1, ['button--' + color]: 1 }">
    <span class="button-content">
      <slot />
    </span>
  </button>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    color: String,
  },
});
</script>
<style scoped lang="scss">
.button {
  padding: 4px 12px;
  border: none;
  border-radius: 2px;
  background: var(--color-primary-blue2);
  color: var(--color-foreground3);
  font-family: inherit;
  cursor: pointer;

  &:hover {
    background: var(--color-primary-blue3);
  }

  &:active {
    background: var(--color-primary-blue1);
  }

  &:disabled {
    background: var(--color-primary-blue1);

    .button-content {
      color: var(--app-foreground1);
      cursor: not-allowed;
    }
  }

  &--red {
    background: var(--color-primary-red4);
    &:hover {
      background: var(--color-primary-red3);
    }

    &:active {
      background: var(--color-primary-red1);
    }
  }

  &--green {
    background: var(--color-primary-green4);
    color: black;
    &:hover {
      background: var(--color-primary-green3);
    }

    &:active {
      background: var(--color-primary-green1);
    }
  }
}
</style>
