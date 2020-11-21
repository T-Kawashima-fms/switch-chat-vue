<template>
  <div class="page-wrapper">
    <div class="sidemenu-wrapper">
      <Sidemenu :uid="user.uid" />
    </div>
    <div class="main-wrapper">
      <div class="message-wrapper" ref="message-wrapper">
        <div class="scroll-wrapper">
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
            ></Message>
          </transition-group>
        </div>
      </div>
      <div class="message-form__background">
        <div class="message-form__wrapper">
          <textarea
            v-model="textarea"
            placeholder="メッセージを入力"
            class="message-form__textarea"
          ></textarea>
          <button @click="submitPost" class="message-form__submit">
            送信する
          </button>
        </div>
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
  setChangeListener,
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
    submitPost: function() {
      postMessage(this.roomId, this.user, this.textarea, this.replyMsgId)
      this.textarea = ''
      this.messages.forEach(message => (message.replyIsChecked = false))
      this.replyMsgId = ''
    },
    addMessage: function(newPost) {
      //配列に追加
      newPost.isAlive = true
      newPost.replyIsChecked = false
      //自分の投稿かどうか
      if (newPost.uid === this.user.uid) {
        newPost.isMine = true
        this.myMessages.push(newPost)
        // this.messages.push(newPost)
      } else {
        newPost.isMine = false
      }
      this.allMessages.push(newPost)
      //DOM更新した後に一番下までスクロール
      this.$nextTick(() => {
        this.$refs['message-wrapper'].scrollTo(0, 1000000000000)
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
    showAllMsgs: function() {
      this.messages = this.allMessages
    },
    hideMyMsgs: function() {
      this.messages = this.myMessages
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
    //ルームデータロード
    setChangeListener(this.roomId, this.showAllMsgs, this.hideMyMsgs)
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
  height: calc(100vh - #{$header-height});
  display: grid;
  grid-template-areas: 'side main';
  $calc_main: calc(100vw - calc(240px + 48px));
  grid-template-columns: 240px $calc_main;
}
.sidemenu-wrapper {
  grid-area: side;
  height: calc(100vh - #{$header-height});
}
.main-wrapper {
  grid-area: main;
  width: 100%;
}
.message-wrapper {
  background: $color-bg-main;
  display: inline-block;
  width: 100%;
  .scroll-wrapper {
    min-width: 600px;
    overflow-x: scroll;
    white-space: nowrap;
  }
  margin: 0 auto;
  height: calc(calc(100vh - #{$header-height}) - calc(#{$form-height} + 24px));
  padding: 0 24px 24px;
  overflow: auto;
  scroll-behavior: smooth;
}
.message-form {
  &__background {
    display: inline-block;
    background: $color-primary-lighten;
    width: 100%;
    height: $form-height;
    position: fixed;
    bottom: 0;
  }
  &__wrapper {
    // max-width: 1280px;
    margin: 0 auto;
    padding: 16px;
    line-height: $form-height;
    display: grid;
    grid-template-columns: calc(100vw - calc(240px + 32px + 130px)) 130px;
    border-radius: 18px;
  }
  &__textarea {
    background: $color-bg-main;
    outline: none;
    box-sizing: border-box;
    border: none;
    border-radius: 18px;
    padding: 16px;
    font-size: 16px;
    line-height: 18px;
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
</style>
