<template>
  <div class="mypage-wrapper">
    <input type="text" v-model="changedName" />
    <button @click="$emit('submit-name', changedName)">
      名前を変更する
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    submitName: function() {
      
    },
  },
}
</script>

<style scoped lang="scss">
.page-wrapper {
  width: 100vw;
  height: calc(100vh - #{$header-height});
}
</style>
