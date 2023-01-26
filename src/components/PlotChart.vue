<template>
  <canvas style="transform: rotate(180)" width="100" height="100"></canvas>
</template>
<script lang="ts">
import { defineComponent, watch } from "vue";
const GREEN = "rgba(19, 255, 128, 0.9)",
  RED = "rgba(255, 78, 78, 0.9)", WIDTH = 100, HEIGHT = 100, MAX_POINTS = 20;
export default defineComponent({
  components: {},
  props: {
    value: Number,
  },
  data: () => ({ series: [] as number[] }),
  mounted() {
    const el = this.$el;
    function repaint(series: number[]) {
      const ctx = el.getContext("2d");
      // clear
      ctx.fillStyle = "000000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      if (series.length > 2) {
        const max = Math.max(...series);
        const min = Math.min(...series);
        ctx.lineWidth = 5;
        let previousPoint: {x: number, y: number} = {x: 0, y: 0};
        for (let i = 0; i < series.length; i++) {
          const point = series[i];
          // render
          ctx.strokeStyle = (i === 0 || point > series[i-1]) ? RED : GREEN;
          const x = WIDTH / series.length * i;
          const y = (HEIGHT / (max-min)) * (point - min)
          ctx.beginPath();
          ctx.moveTo(previousPoint.x, previousPoint.y);
          ctx.lineTo(x, y);
          ctx.stroke();
          previousPoint = {x, y}
        }
      }
    }
    watch(
      () => this.value as number,
      (newValue: number) => {
        this.series.push(newValue);
        if (this.series.length > MAX_POINTS) {
            this.series.splice(0, this.series.length - MAX_POINTS)
        }
        repaint(this.series);
      }
    );
  },
  methods: {},
});
</script>
<style scoped lang="scss">
canvas {
}
</style>
