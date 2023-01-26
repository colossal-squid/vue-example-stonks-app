<script lang="ts">
import { defineComponent } from "vue";
import Header from "./components/core/Header.vue";
import AddIsinForm from "./components/AddIsinForm.vue";
import Watchlist from "./components/Watchlist.vue";
import OfflinePopup from "./components/OfflinePopup.vue";
import { ISIN } from "./services/isin-helper";
import "./index.css";

export default defineComponent({
  components: {
    Header,
    AddIsinForm,
    Watchlist,
    OfflinePopup,
  },
  async mounted() {
    await this.$store.dispatch("init");
    // I've populated some test-dudes here, to make it look less lonely on start
    this.subscribe(new ISIN("DE000BASF111"));
    this.subscribe(new ISIN("DE000BASF114"));
    this.subscribe(new ISIN("IT000BASF114"));
    this.subscribe(new ISIN("SW000BASF114"));
    this.subscribe(new ISIN("PP000BASF114"));
  },
  methods: {
    subscribe(isin: ISIN) {
      this.$store.dispatch("subscribe", isin);
    },
    reload () {
      window.location.reload()
    }
  },
});
</script>

<template>
  <Header />
  <main class="main">
    <h1 class="heading1">Watchlist</h1>
    <add-isin-form @subscribe="subscribe" />
    <watchlist class="watchlist" />
  </main>
  <Transition>
    <offline-popup 
      v-show="$store.state.status === 'OFFLINE'"
      @reload="reload" />
  </Transition>
</template>

<style lang="scss">
#app {
  font-family: var(--font-regular);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 1em;
}

.watchlist {
  max-height: 60vh;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.watchlist::-webkit-scrollbar {
  display: none;
}
.main {
  max-width: var(--max-width);
  margin: 0 auto;
}

.heading1 {
  font-family: var(--font-bold);
}

.component-list {
  padding: 0 0 0 12px;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
