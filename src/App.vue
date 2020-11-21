<template>
  <div class="page-wrapper">
    <div v-if="Object.keys(user).length === 0">
      <header class="header">
        <h1>P-Switch Chat</h1>
      </header>
      <main class="logins">
        <h2>利用するにはログインしてください</h2>
        <img
          class="login-google"
          @click="login"
          src="./assets/images/btn_google_signin.png"
        />
      </main>
    </div>
    <div v-else>
      <Header :user="user" @toggle-mypage="toggleMypage" />
      <div class="mypage-wrapper" :class="{ hidden: isHidden }">
        <input
          type="text"
          v-model="changedName"
          :placeholder="user.displayName"
        />
        <br />
        <button @click="submitName">
          名前を変更する
        </button>
        <br />
        <button class="logout" @click="logout">ログアウト</button>
      </div>
      <router-view :user="user"></router-view>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import { login } from './firebase/index.js'
import { getUserData, changeName } from './firebase/api.js'

export default {
  name: 'App',
  components: {
    Header,
  },
  data: function() {
    return {
      user: {},
      isHidden: true,
    }
  },
  //セッションの確認
  mounted: function() {
    // console.log(this.$store.state.user_session)
    if (Object.keys(this.$store.state.user_session).length !== 0) {
      //セッションしてる
      getUserData(this.$store.state.user_session, this.setUserData)
    } else {
      //セッションしてない→ログイン促す
      this.user = {}
    }
  },
  methods: {
    login: function() {
      login()
        .then(result => {
          //ログインしたらセッション→props
          this.$store.commit('setUser', result.user)
        })
        .then(() => {
          getUserData(this.$store.state.user_session, this.setUserData)
        })
    },
    setUserData: function(id, name, icon) {
      //セッションの情報をPropsに持ってくる
      this.user.uid = id
      this.user.displayName = name
      this.user.photoURL = icon
    },
    toggleMypage: function() {
      this.isHidden = !this.isHidden
    },
    submitName: function() {
      changeName(
        this.$store.state.user_session,
        this.changedName,
        this.setUserData
      )
    },
    logout: function() {
      this.user = {}
      this.$store.state.user_session = {}
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  height: $header-height;
  padding: 0 16px;
  background: $color-primary;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $color-font;
  h1 {
    display: inline-block;
    line-height: $header-height;
    font-size: 28px;
    .title-link {
      text-decoration: none;
      color: $color-font;
    }
  }
}

.page-wrapper {
  width: 100%;
}

.mypage-wrapper {
  position: fixed;
  background: #ffffff;
  display: inline-block;
  top: #{$header-height};
  left: 240px;
  right: 0;
  bottom: 0;
  padding: 64px 0;
  text-align: center;
  * {
    margin-top: 32px;
  }
  .logout {
    margin-top: 128px;
  }
}
.hidden {
  display: none;
}

.logins {
  text-align: center;
  h2 {
    margin-top: 24px;
    font-size: 20px;
  }
  .login-google {
    margin-top: 24px;
    cursor: pointer;
  }
}
</style>

<style>
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
body {
  font-family: 'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial', 'Hiragino Sans',
    'ヒラギノ角ゴシック', YuGothic, 'Yu Gothic', 'メイリオ', Meiryo,
    'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif;
}
</style>
