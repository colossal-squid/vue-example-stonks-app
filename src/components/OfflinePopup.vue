<template>
  <section class="popup">
    <div class="content">
      <h1
        style="
          transform: scale(4);
          flex: 5;
          text-align: center;
          filter: grayscale(1);
        "
      >
        😟
      </h1>
      <h1>Technical Difficulties</h1>
      <p>Are almost inevitable</p>
      <p>
        We are working hard to reduce their frequency. Perhaps we're already
        done.
      </p>
      <p>Make sure you're online and press "Reload"</p>
      <Button
        style="max-width: 120px; margin: auto"
        color="green"
        @click="$emit('reload')"
        >Reload</Button
      >
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Button from "./core/Button.vue";

export default defineComponent({
  components: {
    Button,
  }
});
</script>
<style scoped lang="scss">
.popup {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  padding: 0;
  margin: 0;
  left: 0;
  display: flex;
  text-align: center;
  .content {
    margin: auto;
    display: flex;
    flex-direction: column;
  }
}
</style>
