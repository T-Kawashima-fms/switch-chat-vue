<template>
  <div class="page-wrapper">
    <header class="header">
      <h1>
        <router-link :to="{ name: 'top' }" class="title-link"
          >P-Switch Chat</router-link
        >
      </h1>
    </header>
    <div class="message-wrapper">
      <div class="message-container">
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
          :isTokumei="isTokumei"
        ></Message>
      </div>
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
    addAnker: function(match) {
      return `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`
    },
    addMessage: function(newPost) {
      const url_regexp = /https*?:\/\/([\w-]+\.)+[\w-]+(\/[\w-~ .?%&=]*)*/g
      newPost.message = newPost.message.replace(url_regexp, this.addAnker)
      //配列に追加
      newPost.isAlive = true
      if (newPost.uid == this.user.uid) {
        newPost.isMine = true
      } else {
        newPost.isMine = false
      }
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
      this.isTokumei = chatroomDatas.isTokumei
    },
  },
  mounted: function() {
    //ルームデータロード
    setDataListener(this.roomId, this.getChatroomDatas)
    //メッセージロード
    setPostListener(
      this.roomId,
      'isNotReply',
      this.addMessage,
      this.deleteMessage
    )
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
      isTokumei: true,
    }
  },
}
</script>

<style lang="scss" scoped>
.header {
  height: $header-height;
  padding: 0 16px;
  background: $color-primary;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $color-font;
  * {
    display: inline-block;
  }
  h1 {
    line-height: $header-height;
    font-size: 28px;
    .title-link {
      text-decoration: none;
      color: $color-font;
    }
  }
}
.page-wrapper {
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: #{$header-height};
  }
}
.message-wrapper {
  background-color: $color-bg-main;
  margin-top: #{$header-height};
  height: calc(100vh - #{$header-height});
  .message-container {
    height: 100%;
    overflow-y: auto;
    padding: 0 8px;
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
