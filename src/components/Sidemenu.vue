<template>
  <div class="wrapper">
    <div class="show-p">
      <p v-if="!checkboxModel" class="show-private">
        <fa icon="lock" type="fas" class="fa-icon"></fa>
        <span>コメント非公開中</span>
      </p>
      <p v-else class="show-public">
        <fa icon="lock-open" type="fas" class="fa-icon"></fa>
        <span>コメント公開中</span>
      </p>
    </div>
    <div v-if="isFacilitator">
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
</template>

<script>
import { changePP, setDataListener } from '../firebase/api.js'

export default {
  name: 'Message',
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
    },
    clickCheckbox: function() {
      let qes = 'メッセージを公開してもよろしいですか'
      if (this.checkboxModel == true)
        qes = 'メッセージを非公開にしてもよろしいですか'
      const ans = confirm(qes)
      if (!ans) event.preventDefault()
    },
  },
  data: function() {
    return {
      isFacilitator: false,
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

.show-p {
  display: inline-block;
  margin-top: 64px;
  color: white;
  p {
    padding: 8px 16px;
  }
  &rivate {
    background-color: blue;
  }
  &ublic {
    background-color: red;
  }
}

#p-switch {
  display: none;
}
.label_p-switch {
  margin-top: 32px;
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
</style>
