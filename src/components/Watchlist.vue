<template>
  <Card>
    <div class="watchlist">
      <div class="row header">
        <div class="isin">ISIN</div>
        <div class="prices">
          <div>Price</div>
          <div>Bid</div>
          <div>Ask</div>
          <div class="chart"></div>
          <div>Actions</div>
        </div>
      </div>
      <TransitionGroup name="fade">
        <div
          class="row"
          v-for="record in $store.state.watchlist"
          :key="record.isin"
        >
          <div class="isin">{{ record.isin }}</div>
          <div class="prices">
            <h4 class="hide-on-desktop">Price:</h4><Price :value="record.price" />
            <h4 class="hide-on-desktop">Bid:</h4><Price :value="record.bid" />
            <h4 class="hide-on-desktop">Ask:</h4><Price :value="record.ask" />
            <plot-chart class="chart" :value="record.price"/>
            <div>
              <Button @click="unsubscribe(record.isin)" color="red">
                <span class="hide-on-mobile">Unsubscribe</span>
                <span class="hide-on-desktop">🗑️</span>
              </Button>
            </div>
          </div>
        </div>
      </TransitionGroup>
      <p v-if="!$store.state.watchlist.length">
        The list is empty. Try adding an <a href="https://www.investopedia.com/terms/i/isin.asp" target="_blank">ISIN</a> to watch on (it's free!). Here's a funny one: US36467W1099
      </p>
    </div>
  </Card>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Card from "./core/Card.vue";
import Button from "./core/Button.vue";
import Price from "./core/Price.vue";
import { ISIN } from "../services/isin-helper";
import PlotChart from "./PlotChart.vue";
export default defineComponent({
  props: ["rows"],
  components: {
    Card,
    Button,
    Price,
    PlotChart,
  },
  mounted() {},
  methods: {
    unsubscribe(isin: string) {
      this.$store.dispatch("unsubscribe", new ISIN(isin));
    },
  },
});
</script>
<style scoped lang="scss">
.watchlist {
  a, a:visited {
    color: white;
  }
  display: flex;
  flex-direction: column;
  .hide-on-desktop {
    display: none;
  }
  .hide-on-mobile {
    display: flex;
  }
  .row {
    display: flex;
    &.header {
      position: sticky;
      top: 0;
      padding: 0.5em 0;
      background: #000;
    }
    .isin {
      flex: 0 0 200px;
      margin-right: 40px;
    }
    .prices {
      flex: 2.5;
      display: flex;
      align-content: space-between;
      & > * {
        flex: 1;
        text-align: right;
      }
      & > *:last-child {
        flex: 0 0 120px;
      }
    }
    &:nth-child(n + 2) {
      border-bottom: 1px solid var(--color-foreground3);
      padding: 0.5em 0;
      .isin {
        font-size: 1.5em;
      }
    }
  }
  .chart {
    max-width: 96px;
    height: 48px;
    margin-left: 1em;
  }
  @media screen and (max-width: 725px) {
    .hide-on-desktop {
      display: flex;
    }
    .hide-on-mobile {
      display: none;
    }
    h4 {
      margin: 0;
    }
    .row:first-child {
      display: none;
    }
    .row {
      position: relative;
      flex-direction: column;
      padding-bottom: 0.5em;
      > * {
        line-height: 1em;
      }
      .isin {
        flex: 0 0 40px;
      }
      button {
        position: absolute;
        top: 0.5em;
        left: 13em;
      }
      .chart {
        position: absolute;
        top: 0;
        right: 0;
        height: 28px;
        margin: 0;
        max-width: 100px;
        width: 100px;
      }
      .price {
        margin-right: 0.5em;
      }
    }
  }
  @media screen and (max-width: 380px) {
    .prices {
      font-size: 0.95em;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(1.05)
}
</style>
