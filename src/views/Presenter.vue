<template>
  <div class="page-wrapper">
    <div class="mesasge-wrapper">
      <transition-group name="message-transition">
        <Message
          v-for="message in messages"
          :key="message.id"
          :msgId="message.id"
          :message="message.message"
          :icon="message.icon"
          :timestamp="message.timestamp"
          :displayName="message.displayName"
          :isMine="message.isMine"
          :class="{ transparent: !message.isAlive }"
          :user="user"
        ></Message>
      </transition-group>
    </div>
    <div v-if="!isPublic" class="center_timer-wrapper">
      <Timer
        :isFacilitator="isFacilitator"
        :isPlaying="isPlaying"
        :timer="timer"
      ></Timer>
    </div>
  </div>
</template>

<script>
import Message from '../components/Message'
import Timer from '../components/Timer'
import { setDataListener, setPostListener } from '../firebase/api.js'

export default {
  name: 'Presenter',
  components: {
    Timer,
    Message,
  },
  methods: {
    addMessage: function(newPost) {
      //配列に追加
      newPost.isAlive = true
      this.messages.push(newPost)
      //DOM更新した後に一番下までスクロール
      //  this.$nextTick(() => {
      //    this.$refs['message-wrapper'].scrollTo(0, 1000000000000)
      //  })
    },
    deleteMessage: function(id) {
      const idx = this.messages.findIndex(message => message.id === id)
      this.messages[idx].isAlive = false
      this.$nextTick(() => {
        this.messages.splice(idx, 1)
      })
    },
    getChatroomDatas: function(chatroomDatas) {
      this.isPublic = chatroomDatas.isPublic
      this.isPlaying = chatroomDatas.isPlaying
      this.timer = chatroomDatas.timer
    },
  },
  mounted: function() {
    //ルームデータロード
    setDataListener(this.roomId, this.getChatroomDatas)
    //メッセージロード
    setPostListener(this.roomId, this.addMessage, this.deleteMessage, '')
  },
  props: {
    user: Object,
  },
  data: function() {
    return {
      messages: [],
      isPublic: true,
      isPlaying: false,
      timer: 0,
      roomId: this.$route.params['roomId'],
    }
  },
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  padding: 0 8px;
  width: calc(100vw - 16px);
  height: calc(100vh - #{$header-height});
  overflow-y: auto;
  white-space: nowrap;
  background: $color-bg-main;
}
.message-transition {
  &-leave,
  &-leave-to {
    opacity: 0;
  }
  &-move {
    transition: all 500ms;
  }
  &-leave-active {
    position: absolute;
    transition-duration: 0ms;
  }
}
.center_timer-wrapper {
  position: absolute;
  width: 100vw;
  height: calc(100vh - #{$header-height});
  line-height: calc(100vh - calc(#{$header-height} * 2));
  top: #{$header-height};
  left: 0;
  // transform: translateY(-50%) translateX(-50%);
  background-color: $color-bg-main;
  text-align: center;
}
</style>
