<template>
  <Card>
    <div class="add-isin-form">
      <TextField
        class="add-isin-form__input"
        placeholder="Paste your ISIN code here"
        v-model="text"
        @submit="addToWatchlist"
      />
      <Button
        :disabled="!text || (errors && errors.length)"
        class="add-isin-form__button"
        @click="addToWatchlist"
        >Add to watchlist
      </Button>
    </div>
    <div
      class="add-isin-form__errors"
      v-if="text && text.length && errors && errors.length"
    >
      <div v-for="e in errors" :key="e">{{ e }}</div>
    </div>
  </Card>
</template>
<script lang="ts">
import { defineComponent, watch } from "vue";
import { validateISIN, ValidationError } from "../services/isin-helper";
import TextField from "./core/TextField.vue";
import Card from "./core/Card.vue";
import Button from "./core/Button.vue";
export default defineComponent({
  props: ["title"],
  components: {
    TextField,
    Card,
    Button,
  },
  data: () => ({ text: "", errors: [] as ValidationError[] }),
  emits: ["subscribe"],
  mounted() {
    watch(
      () => this.text,
      () => {
        const result = validateISIN(this.text);
        if (Array.isArray(result)) {
          this.errors = result as ValidationError[];
        } else {
          this.errors = [];
        }
      }
    );
  },
  methods: {
    addToWatchlist(): void {
      const result = validateISIN(this.text);
      if (!Array.isArray(result)) {
          this.$emit('subscribe', result);
          this.text = '';
      }
    },
  },
});
</script>
<style scoped lang="scss">
.add-isin-form {
  display: flex;
  &__input {
    flex: 1;
  }
  &__button {
    flex: 0 0 140px;
  }
  &__errors {
    color: var(--color-primary-red4);
    display: flex;
    flex-direction: column;
    padding: 1em 0;
  }
}
</style>
