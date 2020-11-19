import { db, firebase } from './index.js'

import router from '../router.js'

const chatroomRef = db.collection('chatroom')

const shapeData = doc => {
  const post = {
    id: doc.id,
    ...doc.data(),
  }
  if (post.timestamp === null) {
    post.timestamp = new Date(Date.now())
  } else {
    post.timestamp = post.timestamp.toDate()
  }
  return post
}

const createNewChatroom = create_uid => {
  const chatroomRefId = chatroomRef.doc().id
  chatroomRef
    .doc(chatroomRefId)
    .set({
      createTime: new Date(Date.now()),
      createUid: create_uid,
      isPublic: false,
    })
    .then(() => {
      router.push({ name: 'chat', params: { roomId: chatroomRefId } })
    })

  // const chatroomDoc = chatroomRef
  //   .add({
  //     createdTime: new Date(Date.now()),
  //   })
  // .then(() => {
  //   console.log(chatroomDoc.id)
  //   router.push({ name: 'chat', params: { roomId: chatroomDoc.id } })
  // })
}

const postMessage = (roomId, user, message, replyMsgId) => {
  let postRef = chatroomRef.doc(roomId).collection('posts')
  if (replyMsgId !== '') postRef = postRef.doc(replyMsgId).collection('replys')
  postRef
    .add({
      message,
      uid: user.uid,
      displayName: user.displayName,
      icon: user.photoURL,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(), //サーバに到達した時間
      goodUid: [],
    })
    // .then(result => {
    //   console.log(result)
    // })
    .catch(error => {
      console.log(error)
    })
}

const deletePost = (roomId, id, replyMsgId) => {
  console.log(replyMsgId)
  let postRef = chatroomRef.doc(roomId).collection('posts')
  if (replyMsgId !== '') postRef = postRef.doc(replyMsgId).collection('replys')
  postRef
    .doc(id)
    .delete()
    .then(() => {
      console.log('削除成功')
    })
    .catch(() => {
      console.log('削除失敗')
    })
}

// const getPost = callback => {
//   //すでにデータベースにあるメッセージをロード
//    postRef
//     .orderBy('timestamp', 'asc')
//     .get()
//     .then(querySnapshot => {
//       querySnapshot.forEach(doc => {
//         callback(shapeData(doc))
//       })
//     })
// }

// Chat.vue用チャットメッセージ変更取得
const setPostListener = (roomId, added, removed, replyMsgId) => {
  //追加されたメッセージを取得するためのリスナ
  let postRef = chatroomRef.doc(roomId).collection('posts')
  if (replyMsgId !== '') postRef = postRef.doc(replyMsgId).collection('replys')
  postRef
    .orderBy('timestamp', 'asc')
    // .startAt(new Date(Date.now()))
    .onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if (change.type == 'added') {
          //added
          added(shapeData(change.doc))
        } else if (change.type == 'modified') {
          //modified
        } else if (change.type == 'removed') {
          removed(change.doc.id)
        }
      })
    })
}

// Chat.vue用チャットルーム情報変更取得
const setChangeListener = (roomId, showMsgs, hideMsgs) => {
  const chatroomDoc = chatroomRef.doc(roomId)
  chatroomDoc.onSnapshot(
    docSnapshot => {
      // console.log(docSnapshot.data())
      if (docSnapshot.data().isPublic) showMsgs()
      else hideMsgs()
    },
    error => {
      console.log('Error at setChangeListener: ' + error)
    }
  )
}

const changePP = (roomId, isPublic) => {
  const chatroomDoc = chatroomRef.doc(roomId)
  chatroomDoc.set(
    {
      isPublic: isPublic,
    },
    { merge: true }
  )
}

// SIdemenu用最初のデータ読み込み
const setDataListener = (roomId, got) => {
  //追加されたメッセージを取得するためのリスナ
  const chatroomDoc = chatroomRef.doc(roomId)
  chatroomDoc.onSnapshot(
    docSnapshot => {
      got(docSnapshot.data())
    },
    err => {
      console.log(`Encountered error: ${err}`)
    }
  )
}

const addGood = (roomId, msgId, uid) => {
  const postDoc = chatroomRef
    .doc(roomId)
    .collection('posts')
    .doc(msgId)
  postDoc.update({
    goodUid: firebase.firestore.FieldValue.arrayUnion(uid),
  })
}
const deleteGood = (roomId, msgId, uid) => {
  const postDoc = chatroomRef
    .doc(roomId)
    .collection('posts')
    .doc(msgId)
  postDoc.update({
    goodUid: firebase.firestore.FieldValue.arrayRemove(uid),
  })
}

const setGoodListener = (roomId, msgId, modified) => {
  const postDoc = chatroomRef
    .doc(roomId)
    .collection('posts')
    .doc(msgId)
  postDoc.onSnapshot(
    docSnapshot => {
      modified(docSnapshot.data().goodUid)
    },
    err => {
      console.log(`Encountered error: ${err}`)
    }
  )
}

export {
  postMessage,
  deletePost,
  setPostListener,
  createNewChatroom,
  changePP,
  setChangeListener,
  setDataListener,
  addGood,
  deleteGood,
  setGoodListener,
}
