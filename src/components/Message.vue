<template>
  <div
    class="wrapper"
    :class="{
      wrapper__isMine: isMine,
      wrapper__isReply: isReply,
      wrapper__isMineReply: isMine && isReply,
    }"
  >
    <img
      :src="icon"
      class="icon"
      :class="{ hidden: isTokumei, icon__isReply: isReply }"
    />
    <div
      class="card-wrapper"
      :class="{
        'card-wrapper__isMine': isMine,
        'card-wrapper__isReply': isReply,
      }"
    >
      <span
        class="display-name"
        :class="{
          hidden: isTokumei,
          'display-name__isMine': isMine,
          'display-name__isReply': isReply,
        }"
      >
        {{ displayName }}
      </span>
      <div
        class="card"
        :class="{
          card__isMine: isMine,
          card__isReply: isReply,
          card__isMineReply: isMine && isReply,
        }"
      >
        <!-- <span class="content">{{ message }}</span> -->
        <!-- リンクにするためv-html -->
        <span v-html="message" class="content"></span>
        <Message
          v-for="reply in replys"
          :isReply="true"
          :key="reply.id"
          :msgId="reply.id"
          :message="reply.message"
          :icon="reply.icon"
          :timestamp="reply.timestamp"
          :displayName="reply.displayName"
          :goodUid="reply.goodUid"
          :isMine="reply.isMine"
          @delete-replypost="deleteReplyPost(reply.id)"
          :class="{ transparent: !reply.isAlive }"
          :user="user"
          :isTokumei="isTokumei"
        ></Message>
      </div>
      <span
        class="card-info"
        :class="{ 'card-info__isMine': isMine, 'card-info__isReply': isReply }"
      >
        <!-- <span class="date">{{ date }}</span> -->
        <span class="edit-msg">
          <!-- <MessageGood class="MessageGood" :uid="user.uid" :msgId="msgId" /> -->
          <span class="good" v-if="!isReply">
            <fa
              icon="thumbs-up"
              type="fas"
              :class="{
                'good-icon__checked': goodUid.indexOf(user.uid) !== -1,
              }"
              @click="toggleGood(msgId)"
            ></fa>
            <span class="good-num">{{ goodUid.length }}</span>
          </span>
          <fa
            v-if="!isPresenter && !isReply"
            icon="reply"
            type="fas"
            :class="{ reply__checked: replyIsChecked }"
            @click="$emit('toggle-reply')"
          ></fa>
          <span v-if="isMine" @click="$emit('delete-post')" class="delete"
            >削除
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import Message from './Message'
import { deletePost, setPostListener, toggleGood } from '../firebase/api.js'
import { isMobile } from 'mobile-device-detect'

export default {
  name: 'Message',
  components: {
    Message,
  },
  props: {
    msgId: String,
    message: String,
    timestamp: Object,
    displayName: String,
    icon: String,
    goodUid: Array,
    isMine: Boolean,
    user: Object,
    replyIsChecked: Boolean,
    isReply: Boolean,
    isTokumei: Boolean,
  },
  computed: {
    date: function() {
      return this.timestamp.toLocaleString()
    },
  },
  methods: {
    toggleGood: function(id) {
      toggleGood(
        this.roomId,
        id,
        this.user.uid,
        this.goodUid.indexOf(this.user.uid) !== -1
      )
    },
    addReplyMessage: function(newPost) {
      //配列に追加
      newPost.isAlive = true
      //自分の投稿かどうか
      if (newPost.uid === this.user.uid) {
        newPost.isMine = true
      } else {
        newPost.isMine = false
      }
      this.replys.push(newPost)
    },
    modifyReplyMessage: function(id) {
      console.log(id)
    },
    deleteReplyPost: function(id) {
      const ans = confirm('メッセージを削除してもよろしいですか') // 確認ダイアログの表示
      if (ans) deletePost(this.roomId, id, this.msgId)
      else event.preventDefault()
    },
    deleteReplyMessage: function(id) {
      const idx = this.messages.findIndex(message => message.id === id)
      this.messages[idx].isAlive = false
      this.$nextTick(() => {
        this.messages.splice(idx, 1)
      })
    },
  },
  mounted: function() {
    setPostListener(
      this.roomId,
      this.msgId,
      this.addReplyMessage,
      this.modifyReplyMessage,
      this.deleteReplyMessage
    )
  },
  data: function() {
    return {
      replys: [],
      roomId: this.$route.params['roomId'],
      isPresenter: isMobile,
    }
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  max-width: 80%;
  padding: 8px 0;
  grid-template-columns: 48px 1fr;
  grid-template-areas: 'icon message';
  &__isMine {
    grid-template-columns: 1fr 48px;
    grid-template-areas: 'message icon';
    margin: 0 0 0 auto;
  }
  &__isReply {
    max-width: calc(100% - 36px);
    grid-template-columns: 36px 1fr;
    grid-template-areas: 'icon message';
  }
  &__isMineReply {
    grid-template-columns: 1fr 36px;
    grid-template-areas: 'message icon';
    margin: 0 0 0 auto;
  }
  .icon {
    margin-top: 12px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    grid-area: icon;
    &__isReply {
      margin-top: 20px;
      width: 36px;
      height: 36px;
    }
  }
  .card-wrapper {
    grid-area: message;
    margin: 0 24px;
    &__isReply {
      margin: 0 14px;
    }
    .display-name {
      margin: 0 16px;
      font-size: 14px;
      display: block;
      text-align: left;
      &__isMine {
        text-align: right;
      }
      &__isReply {
        font-size: 12px;
      }
    }
    .card {
      border-radius: 16px;
      font-size: 16px;
      padding: 14px;
      line-height: 16px;
      background: $color-secondary;
      &__isMine {
        background: $color-primary;
      }
      &__isReply {
        background: lighten($color-secondary, 10%);
        font-size: 14px;
      }
      &__isMineReply {
        background: $color-primary-lighten;
      }
      .content {
        word-break: break-all;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
    }
    .card-info {
      margin: 0 16px;
      font-size: 14px;
      display: block;
      text-align: left;
      &__isMine {
        text-align: right;
      }
      &__isReply {
        font-size: 12px;
      }
      .edit-msg {
        display: inline-block;
        * {
          width: 12px;
          cursor: pointer;
          margin-right: 16px;
        }
        .MessageGood {
          display: inline;
          margin-left: 0;
        }
        .delete {
          cursor: pointer;
          margin-left: 16px;
          color: $color-font-link;
          text-decoration: underline;
        }
      }
    }
  }
}
@media screen and (max-width: 896px) {
  .wrapper {
    max-width: calc(100% - 48px);
  }
}

.good-icon__checked {
  color: orange;
}

.fa-icon {
  width: 12px;
  cursor: pointer;
  margin: 0 16px;
}

.reply__checked {
  color: lightgreen;
}
.hidden {
  display: none;
}
</style>
