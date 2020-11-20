<template>
  <div class="wrapper">
    <fa
      v-if="!isChecked"
      icon="thumbs-up"
      type="fas"
      class="good good__unchecked"
      @click="addGood(msgId)"
    ></fa>
    <fa
      v-else
      icon="thumbs-up"
      type="fas"
      class="good good__checked"
      @click="deleteGood(msgId)"
    ></fa>
    <span class="good-num">{{ goodNum }}</span>
  </div>
</template>

<script>
import { addGood, deleteGood, setGoodListener } from '../firebase/api.js'

export default {
  name: 'MessageGood',
  created() {
    this.fetchData()
  },
  watch: {
    $route: 'fetchData',
  },
  props: {
    uid: String,
    msgId: String,
  },
  data: function() {
    return {
      roomId: this.$route.params['roomId'],
      isChecked: false,
      goodNum: 0,
    }
  },
  methods: {
    fetchData: function() {
      this.roomId = this.$route.params['roomId']
    },
    addGood: function(id) {
      addGood(this.roomId, id, this.uid)
    },
    deleteGood: function(id) {
      deleteGood(this.roomId, id, this.uid)
    },
    modifiedGood: function(goodUid) {
      const goodUser = goodUid.some(uid => uid === this.uid)
      if (goodUser) this.isChecked = true
      else this.isChecked = false
      this.goodNum = goodUid.length
    },
  },
  mounted: function() {
    setGoodListener(this.roomId, this.msgId, this.modifiedGood)
  },
}
</script>

<style lang="scss" scoped>
.good {
  width: 12px;
  &__checked {
    color: orange;
  }
}
</style>
