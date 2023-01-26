<template>
  <header class="header">
    <a href="/">
      <svg
        class="header-logo"
        viewBox="0 0 74 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Secret code challenge</title>
      </svg>
    </a>
    <div class="header__status">
      <Transition>
        <p>Last Updated: {{ lastUpdated }}</p>
      </Transition>
      <p :class="{['header__status--' + $store.state.status]: 1}">{{ $store.state.status }}</p>
    </div>
  </header>
</template>
<script lang="ts">
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { defineComponent } from "vue";
TimeAgo.addDefaultLocale(en);

export default defineComponent({
  data: () => ({
    timeAgo: new TimeAgo("en-US"),
  }),
  computed: {
    lastUpdated(): string {
      return this.timeAgo.format(this.$store.state.lastUpdate);
    },
  },
});
</script>

<style scoped lang="scss">
.header {
  margin: 0 auto;
  padding: 24px 0;
  display: flex;
  max-width: var(--max-width);

  &__status {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    p {
      margin: 0;
    }
    &--ONLINE {
      color: var(--color-primary-green4)
    }
    &--CONNECTING {
      color: var(--color-primary-blue4)
    }
    &--OFFLINE {
      color: var(--color-primary-red4)
    }
  }

  .header-title {
    visibility: hidden;
  }

  .header-logo {
    width: 60px;
  }
}
</style>
