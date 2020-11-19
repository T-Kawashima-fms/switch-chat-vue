<template>
  <div class="timer-wrapper">
    <div v-if="isFacilitator">
      <button class="timer__plus-minute timer_btn" @click="changeTime(60)">
        <fa icon="plus" type="fas" class="fa-icon"></fa>
      </button>
      <button class="timer__plus-second timer_btn" @click="changeTime(1)">
        <fa icon="plus" type="fas" class="fa-icon"></fa>
      </button>
    </div>
    <div class="timer__main">
      <span class="timer__main-minute">{{ time_minute }}</span>
      :
      <span class="timer__main-second">{{ time_second }}</span>
    </div>
    <div v-if="isFacilitator">
      <button class="timer__minus-minute timer_btn" @click="changeTime(-60)">
        <fa icon="minus" type="fas" class="fa-icon"></fa>
      </button>
      <button class="timer__minus-second timer_btn" @click="changeTime(-1)">
        <fa icon="minus" type="fas" class="fa-icon"></fa>
      </button>
      <button
        class="timer_btn-long"
        @click="
          $emit('toggle-timer', { time: this.time, play: !this.isPlaying })
        "
      >
        <fa v-if="isPlaying" icon="pause" type="fas" class="fa-icon"></fa>
        <fa v-else icon="play" type="fas" class="fa-icon"></fa>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Timer',
  props: {
    isFacilitator: Boolean,
    isPlaying: Boolean,
    timer: Number,
  },
  data: function() {
    return {
      time: 0,
      time_minute: '00',
      time_second: '00',
      timerObj: null,
    }
  },
  watch: {
    isPlaying: function(newVal, oldVal) {
      if (newVal != oldVal) {
        this.time = this.timer
        if (newVal) {
          this.timerObj = setInterval(
            function() {
              this.time--
            }.bind(this),
            1000
          )
        } else clearInterval(this.timerObj)
      }
    },
    time: function() {
      if (this.time < 0) this.time = 0
      if (parseInt(this.time / 60) < 10)
        this.time_minute = '0' + String(parseInt(this.time / 60))
      else this.time_minute = String(parseInt(this.time / 60))
      if (parseInt(this.time % 60) < 10)
        this.time_second = '0' + String(parseInt(this.time % 60))
      else this.time_second = String(parseInt(this.time % 60))
      if (this.time <= 0 && this.isPlaying) {
        clearInterval(this.timerObj)
        this.$emit('toggle-timer', { time: this.time, play: !this.isPlaying })
      }
    },
  },
  methods: {
    changeTime: function(num) {
      this.time += num
    },
  },
}
</script>

<style lang="scss" scoped>
.timer-wrapper {
  margin-top: 64px;
}
.timer_btn {
  width: 80px;
  padding: 8px 0;
  cursor: pointer;
  &__red {
    color: red;
  }
  &__yellow {
    color: yellow;
  }
  &-long {
    padding: 8px 0;
    cursor: pointer;
    width: 160px;
    margin-top: 16px;
  }
}
.timer__main {
  font-size: 40px;
  color: black;
}
</style>
