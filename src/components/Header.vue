<template lang="ja">
    <header class="header">
      <h1>
        <router-link :to="{ name: 'top' }" class="title-link">P-Switch Chat</router-link>
      </h1>
      <div class="user-data">
        <span>{{user.displayName}}でログイン中</span>
        <button @click="$emit('toggle-mypage')" class="toMypage">
          <img :src="user.photoURL" class="icon" />
        </button>
      </div>
    </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    user: Object,
  },
  methods: {
    // logout: function() {
    //   this.$store.commit('setUser', '')
    // },
  },
}
</script>

<style lang="scss" scoped>
.toMypage {
  background: none;
  border: none;
  &:focus {
    outline: none;
  }
}
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
  .user-data {
    line-height: $header-height;
    * {
      vertical-align: middle;
    }
    span {
      margin-right: 8px;
    }
    .icon {
      width: 28px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>
