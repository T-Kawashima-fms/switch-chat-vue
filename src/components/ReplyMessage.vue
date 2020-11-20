<template>
  <div class="wrapper" :class="{ wrapper__isMine: isMine }">
    <img :src="icon" class="icon" />
    <div class="card-wrapper">
      <span
        class="display-name"
        v-bind:class="{ 'display-name__isMine': isMine }"
        >{{ displayName }}</span
      >
      <div class="card" :class="{ card__isMine: isMine }">
        <span class="content">{{ message }}</span>
      </div>
      <span class="date" :class="{ date__isMine: isMine }"
        >{{ date }}
        <span v-if="isMine" @click="$emit('delete-replypost')" class="delete"
          >削除
        </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReplyMessage',
  components: {},
  props: {
    message: String,
    timestamp: Object,
    displayName: String,
    icon: String,
    isMine: Boolean,
  },
  computed: {
    date: function() {
      return this.timestamp.toLocaleString()
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  max-width: 80%;
  padding: 12px 0;
  grid-template-columns: 36px 1fr;
  grid-template-areas: 'areaA areaB';
  &__isMine {
    grid-template-columns: 1fr 36px;
    grid-template-areas: 'areaB areaA';
    margin: 0 0 0 auto;
  }
}
.icon {
  margin-top: 22px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  grid-area: areaA;
}
.card-wrapper {
  grid-area: areaB;
  margin: 0 12px;
}
.display-name {
  margin: 0 16px;
  font-size: 12px;
  display: block;
  text-align: left;
  &__isMine {
    text-align: right;
  }
}
.card {
  font-size: 14px;
  border-radius: 14px;
  padding: 12px;
  line-height: 18px;
  background: lighten($color-secondary, 10%);
  &__isMine {
    background: $color-primary-lighten;
  }
}
.date {
  margin: 0 16px;
  font-size: 12px;
  display: block;
  text-align: left;
  &__isMine {
    text-align: right;
  }
}
.delete {
  cursor: pointer;
  margin-left: 4px;
  color: $color-font-link;
  text-decoration: underline;
}
</style>
