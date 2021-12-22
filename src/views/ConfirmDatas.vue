<template>
  vqwTlVlbWIRh9THSpcLG
  <input
    class="text-chatroomId"
    type="text"
    v-model.trim="chatroomId"
    placeholder="チャットルームIDを入力"
  />
  <button @click="getPostData">表示</button>
  <button @click="downloadCSV">
    ダウンロード
  </button>
  <table border="1">
    <tr>
      <td>name</td>
      <td>message</td>
      <td>timestamp</td>
      <td>id</td>
    </tr>
    <tr v-for="post in posts" :key="post.id">
      <td>{{ post.name }}</td>
      <td>{{ post.message }}</td>
      <td>{{ post.timestamp }}</td>
      <td>{{ post.id }}</td>
    </tr>
  </table>
</template>

<script>
import { getPostData, getReplyData } from '../firebase/api.js'

export default {
  name: 'ConfirmDatas',
  methods: {
    addMessage: function(posts) {
      this.posts = posts
      this.posts.forEach(post => {
        getReplyData(this.chatroomId, post.id, this.addReply)
      })
    },
    addReply: function(replys) {
      if (replys.length > 0) this.replys.push(replys)
    },
    getPostData: function() {
      console.log(this.chatroomId)
      getPostData(this.chatroomId, this.addMessage)
    },
    downloadCSV: function() {
      if (this.posts.length === 0) return
      let csv = '\ufeff' + 'name,message,timestamp\n'
      this.posts.forEach(el => {
        let line =
          el['name'] +
          ',' +
          el['message'].replace(/r?n/g, '').replace(',', '、') +
          ',' +
          el['timestamp'] +
          ',' +
          el['id'] +
          '\n'
        csv += line
      })
      let blob = new Blob([csv], { type: 'text/csv' })
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = this.chatroomId + '.csv'
      link.click()
    },
  },
  data: function() {
    return {
      posts: [],
      replys: [],
    }
  },
}
</script>
