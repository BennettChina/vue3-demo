<template>
  <div class="tab">
    <div class="tab-item" v-for="(item, index) in titles" :key="index" @click="clickItem(index)" :class="{active: index===currentIdx}">
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {ref} from "vue";

export default {
  name: "Tab",
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  setup(props, {emit}) {
    // const store = useStore();
    const currentIdx = ref(0);
    const clickItem = (idx) => {
      // store.state.tabCurrentIdx = idx;
      currentIdx.value = idx;
      emit('tabClick', idx);
    }
    return {
      // currentIdx: store.state.tabCurrentIdx,
      currentIdx,
      clickItem
    }
  }
}
</script>

<style scoped lang="scss">
.tab {
  width: 100%;
  height: 40px;
  line-height: 40px;
  display: flex;
  text-align: center;
  font-size: var(--font-size);
  background: #FFFFFF;
  position: sticky;
  top: 45px;
  z-index: 10;

  .tab-item {
    flex: 1;

    span {
      padding: 5px;
    }
  }

  .active {
    color: var(--color-tint);

    span {
      border-bottom: 3px solid var(--color-tint);
    }
  }
}
</style>
