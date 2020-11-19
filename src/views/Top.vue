<template lang="ja">
  <main>
    <button class="btn-new" @click="createNewChatroom">新しく部屋を作る</button>
    <div class="enter-room">
      <input
        class="text-enter"
        type="text"
        placeholder="ルームIDを入力"
        v-model="search_roomId"
      />
      <button class="btn-enter" @click="enterChatroom">入室する</button>
    </div>
  </main>
</template>

<script>
import { createNewChatroom } from '../firebase/api.js'
import router from '../router.js'

export default {
  name: 'Top',
  components: {},
  props: {
    user: Object,
    search_roomId: String,
  },
  methods: {
    createNewChatroom: function() {
      createNewChatroom(this.user.uid)
    },
    enterChatroom: function() {
      router.push({ name: 'chat', params: { roomId: this.search_roomId } })
    },
  },
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  background: $color-bg-sub;
  color: $color-font;
  height: calc(100vh - #{$header-height});
}

main {
  text-align: center;
}

button {
  height: 40px;
  padding: 0 20px;
  box-sizing: border-box;
  display: inline-block;
  cursor: pointer;
  border: 3px solid $color-primary;
  background-color: $color-primary-lighten;
  color: $color-font;
}

.btn-new {
  margin-top: 80px;
}

.enter-room {
  margin-top: 80px;
  input {
    height: 40px;
    box-sizing: border-box;
    margin-right: 8px;
    width: 200px;
  }
}
</style>
