<template>
  <div class="page-wrapper">
    <div class="sidemenu-wrapper">
      <div class="sidemenu-container">
        <Sidemenu :uid="user.uid" />
      </div>
    </div>
    <div class="message-wrapper">
      <div class="message-container" ref="message-container">
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
            @delete-post="deletePost(message.id)"
            :class="{ transparent: !message.isAlive }"
            @toggle-reply="toggleReply(message.id)"
            :replyIsChecked="message.replyIsChecked"
            :user="user"
            :isTokumei="isTokumei"
          ></Message>
        </transition-group>
      </div>
    </div>
    <div class="form-wrapper">
      <div class="form-container">
        <textarea
          v-model="textarea"
          @keydown.enter.exact="checkNewline"
          @keydown.enter.meta="submitPost"
          @keydown.enter.ctrl="submitPost"
          placeholder="メッセージを入力"
          class="form__textarea"
          ref="form__textarea"
        ></textarea>
        <button @click="submitPost" class="form__submit">
          送信する
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Message from '../components/Message'
import Sidemenu from '../components/Sidemenu'
import {
  postMessage,
  deletePost,
  setPostListener,
  setDataListener,
} from '../firebase/api.js'

export default {
  name: 'Chat',
  created() {
    // view が作られた時にデータを取得し、
    // そのデータは既に監視されています
    this.fetchData()
  },
  watch: {
    // ルートが変更されたらこのメソッドを再び呼び出します
    $route: 'fetchData',
  },
  components: {
    Message,
    Sidemenu,
  },
  props: {
    user: Object,
  },
  methods: {
    fetchData: function() {
      this.roomId = this.$route.params['roomId']
    },
    checkNewline: function() {
      if (this.textarea === '') event.preventDefault()
    },
    submitPost: function() {
      if (this.textarea !== '') {
        postMessage(this.roomId, this.user, this.textarea, this.replyMsgId)
        this.textarea = ''
        this.messages.forEach(message => (message.replyIsChecked = false))
        this.replyMsgId = ''
        this.$refs.form__textarea.focus()
      } else event.preventDefault()
    },
    addAnker: function(match) {
      return `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`
    },
    addMessage: function(newPost) {
      const url_regexp = /https*?:\/\/([\w-]+\.)+[\w-]+(\/[\w-~ .?%&=]*)*/g
      newPost.message = newPost.message.replace(url_regexp, this.addAnker)
      //配列に追加
      newPost.isAlive = true
      newPost.replyIsChecked = false
      //自分の投稿かどうか
      if (newPost.uid == this.user.uid) {
        newPost.isMine = true
        this.myMessages.push(newPost)
        // this.messages.push(newPost)
      } else {
        newPost.isMine = false
      }
      this.allMessages.push(newPost)
      //DOM更新した後に一番下までスクロール
      this.$nextTick(() => {
        this.$refs['message-container'].scrollTo(0, 1000000000000)
      })
    },
    deletePost: function(id) {
      const ans = confirm('メッセージを削除してもよろしいですか') // 確認ダイアログの表示
      if (ans) {
        deletePost(this.roomId, id, '')
      } else {
        event.preventDefault()
      }
    },
    deleteMessage: function(id) {
      const idx = this.messages.findIndex(message => message.id === id)
      this.messages[idx].isAlive = false
      this.$nextTick(() => {
        this.messages.splice(idx, 1)
      })
    },
    getChatroomDatas: function(chatroomDatas) {
      if (chatroomDatas.isPublic) this.messages = this.allMessages
      else this.messages = this.myMessages
      this.isTokumei = chatroomDatas.isTokumei
    },
    toggleReply: function(id) {
      this.messages.forEach(message => (message.replyIsChecked = false))
      const idx = this.messages.findIndex(message => message.id === id)
      if (this.replyMsgId === id) this.replyMsgId = ''
      else {
        this.messages[idx].replyIsChecked = true
        this.replyMsgId = id
      }
    },
  },
  mounted: function() {
    this.$refs.form__textarea.focus()
    //ルームデータロード
    setDataListener(this.roomId, this.getChatroomDatas)
    //メッセージロード
    setPostListener(this.roomId, this.addMessage, this.deleteMessage, '')
  },
  data: function() {
    return {
      textarea: '',
      messages: [],
      myMessages: [],
      allMessages: [],
      roomId: this.$route.params['roomId'],
      replyMsgId: '',
      isTokumei: true,
    }
  },
}
</script>

<style lang="scss" scoped>
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
.transparent {
  opacity: 0;
}

.page-wrapper {
  background: $color-bg-sub;
  color: $color-font;
  width: 100vw;
  height: calc(100vh - #{$header-height});
  display: grid;
  grid-template-rows: calc(100vh - calc(#{$header-height} + #{$form-height})) #{$form-height}; //縦
  grid-template-columns: 240px calc(100vw - 240px); //横
  grid-template-areas:
    'sidemenu message'
    'sidemenu form';
  .sidemenu-wrapper {
    grid-area: sidemenu;
    .sidemenu-container {
      height: 100%;
      overflow-y: auto;
    }
  }
  .message-wrapper {
    background-color: $color-bg-main;
    grid-area: message;
    .message-container {
      height: 100%;
      padding: 0 16px;
      overflow-y: auto;
      scroll-behavior: smooth;
    }
  }
  .form-wrapper {
    grid-area: form;
    background-color: $color-primary-lighten;
    .form-container {
      margin: 0 auto;
      padding: 16px;
      height: calc(100% - 32px);
      display: grid;
      grid-template-columns: calc(100vw - calc(240px + 32px + 130px)) 130px;
      .form {
        &__textarea {
          height: 64px;
          background: $color-bg-main;
          outline: none;
          box-sizing: border-box;
          border: none;
          border-radius: 18px;
          padding: 16px;
          font-size: 16px;
          white-space: pre-wrap;
        }
        &__submit {
          background: $color-primary;
          height: 64px;
          padding: 0 24px;
          margin-left: 24px;
          border-radius: 18px;
          border: none;
          outline: none;
          &:active {
            background: darken($color-primary, 5%);
          }
        }
      }
    }
  }
}
</style>
