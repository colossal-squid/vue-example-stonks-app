<template>
  <Transition>
    <span
      v-if="value"
      :class="{ price: 1, 'price--up': direction === 'UP', 'price--down': direction === 'DOWN' }"
      >{{ value.toFixed(2) }}€</span
    >
  </Transition>
</template>
<script lang="ts">
import { defineComponent, watch } from "vue";
export type PriceTrend = "UP" | "DOWN";
export default defineComponent({
  data: () => ({
    direction: "UP",
  }),
  props: {
    value: Number,
  },
  mounted() {
    watch(
      () => this.value as number,
      (oldValue: number, newValue: number) => {
        this.direction = oldValue > newValue ? "DOWN" : "UP";
      }
    );
  },
});
</script>

<style scoped lang="scss">
.price {
  transition: 0.3s color ease-in-out;
  &--up {
    &:before {
      content: "⬆";
      color: var(--color-primary-green4);
    }
  }
  &--down {
    &:before {
      content: "⬇";
      color: var(--color-primary-red4);
    }
  }
}
</style>
