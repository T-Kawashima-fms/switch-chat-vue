<template>
  <div class="wrapper">
    <div class="content-wrapper pp-wrapper">
      <div class="pp-wrapper__show">
        <p v-if="!checkboxModel" class="pp-wrapper__show-private">
          <fa icon="lock" type="fas" class="fa-icon"></fa>
          <span>コメント非公開中</span>
        </p>
        <p v-else class="pp-wrapper__show-public">
          <fa icon="lock-open" type="fas" class="fa-icon"></fa>
          <span>コメント公開中</span>
        </p>
      </div>
      <div v-if="isFacilitator" class="pp-wrapper__op">
        <input
          type="checkbox"
          id="p-switch"
          v-model="checkboxModel"
          v-on:click="clickCheckbox"
        />
        <label for="p-switch" class="label_p-switch">
          <p v-if="!checkboxModel">
            <span>コメントを公開する</span>
          </p>
          <p v-else>
            <span>コメントを非公開にする</span>
          </p>
        </label>
      </div>
    </div>
    <div class="content-wrapper">
      <Timer
        :isFacilitator="isFacilitator"
        :isPlaying="isPlaying"
        :timer="timer"
        @toggle-timer="toggleTimer($event)"
      ></Timer>
    </div>
    <div class="content-wrapper">
      <div>
        チャットルームID：<span>{{ roomId }}</span>
      </div>
      <div>
        <vue-qrcode
          :value="'https://switch-chat-c5ad1.web.app' + $route.path"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { changePP, setDataListener, changeTimer } from '../firebase/api.js'
import Timer from './Timer'
import VueQrcode from 'vue3-qrcode'

export default {
  name: 'Message',
  components: {
    Timer,
    VueQrcode,
  },
  created() {
    this.fetchData()
  },
  props: {
    uid: String,
  },
  methods: {
    fetchData: function() {
      this.roomId = this.$route.params['roomId']
    },
    //ルーム情報をロードした時にコールバックする関数
    getChatroomDatas: function(chatroomDatas) {
      if (this.uid === chatroomDatas.createUid) this.isFacilitator = true
      if (this.checkboxModel != chatroomDatas.isPublic)
        this.checkboxModel = chatroomDatas.isPublic
      this.isPlaying = chatroomDatas.isPlaying
      this.timer = chatroomDatas.timer
    },
    clickCheckbox: function() {
      let qes = 'メッセージを公開してもよろしいですか'
      if (this.checkboxModel == true)
        qes = 'メッセージを非公開にしてもよろしいですか'
      const ans = confirm(qes)
      if (!ans) event.preventDefault()
    },
    toggleTimer: function(event) {
      changeTimer(this.roomId, event.time, event.play)
    },
  },
  data: function() {
    return {
      isFacilitator: false,
      isPlaying: false,
      timer: 0,
      checkboxModel: false,
      roomId: this.$route.params['roomId'],
    }
  },
  watch: {
    $route: 'fetchData',
    checkboxModel: function(newVal, oldVal) {
      if (newVal != oldVal) changePP(this.roomId, newVal)
    },
  },
  mounted: function() {
    setDataListener(this.roomId, this.getChatroomDatas)
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  display: inline-block;
  text-align: center;
}

.pp-wrapper__show {
  display: inline-block;
  color: white;
  p {
    padding: 8px 16px;
  }
  &-private {
    background-color: blue;
  }
  &-public {
    background-color: red;
  }
}

#p-switch {
  display: none;
}
.label_p-switch {
  margin-top: 16px;
  cursor: pointer;
  display: inline-block;
  p {
    padding: 8px 16px;
    box-sizing: border-box;
    display: inline-block;
    cursor: pointer;
    border: 3px solid $color-primary;
    background-color: $color-primary-lighten;
    color: $color-font;
  }
}

.content-wrapper {
  margin-top: 64px;
}
.pp-wrapper {
  margin-top: 32px;
}
</style>
