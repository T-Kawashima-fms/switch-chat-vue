<template>
  <div class="page-wrapper"></div>
</template>

<script>
export default {
  name: 'Timer',
  props: {},
  sockets: {
    connect: function() {
      console.log('socket connected')
    },
    // this.$socket.emit('customEmit', data) で送ったらここで受け取る
    // customEmit: function(data) {
    //   console.log(data)
    // },
  },
  methods: {
    clickButton: function(data) {
      // $socket is socket.io-client instance
      this.$socket.emit('emit_method', data)
    },
  },
}
</script>
