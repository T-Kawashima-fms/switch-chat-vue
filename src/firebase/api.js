import { db, firebase } from './index.js'

import router from '../router.js'

const chatroomRef = db.collection('chatroom')
const userRef = db.collection('user')

const getUserData = (user, got) => {
  userRef
    .doc(user.uid)
    .get()
    .then(doc => {
      if (!doc.exists) {
        userRef
          .doc(user.uid)
          .set({
            displayName: user.displayName,
            icon: user.icon,
          })
          .then(() => {
            got(user.uid, user.displayName, user.icon)
          })
      } else {
        got(doc.id, doc.data().displayName, doc.data().icon)
      }
    })
    .catch(err => {
      console.log('Error getting document', err)
    })
}

const changeName = (user, newName, got) => {
  userRef
    .doc(user.uid)
    .set(
      {
        displayName: newName,
      },
      { merge: true }
    )
    .then(() => {
      got(user.uid, newName, user.photoURL)
    })
}

// const storageRef = storage.ref()
// const uploadIcon = (uid, imageFile, imageName) => {
//   storageRef
//     .child(`icons/${imageName}`)
//     .put(imageFile)
//     .then(snapshot => {
//       snapshot.ref.getDownloadURL().then(downloadURL => {
//         userRef.doc(uid).set(
//           {
//             icon: downloadURL,
//           },
//           { merge: true }
//         )
//       })
//     })
// }

const htmlspecialchars = str => {
  return (str + '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

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
      isPlaying: false,
      timer: 0,
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
      message: htmlspecialchars(message),
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
  let postRef = chatroomRef.doc(roomId).collection('posts')
  if (replyMsgId !== '') postRef = postRef.doc(replyMsgId).collection('replys')
  postRef
    .doc(id)
    .delete()
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
// const setChangeListener = (roomId, showMsgs, hideMsgs) => {
//   const chatroomDoc = chatroomRef.doc(roomId)
//   chatroomDoc.onSnapshot(
//     docSnapshot => {
//       // console.log(docSnapshot.data())
//       if (docSnapshot.data().isPublic) showMsgs()
//       else hideMsgs()
//     },
//     error => {
//       console.log('Error at setChangeListener: ' + error)
//     }
//   )
// }

// Sidemenu用のデータ読み込み
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

const changePP = (roomId, isPublic) => {
  const chatroomDoc = chatroomRef.doc(roomId)
  chatroomDoc.set(
    {
      isPublic: isPublic,
    },
    { merge: true }
  )
}

const changeTimer = (roomId, time, play) => {
  const chatroomDoc = chatroomRef.doc(roomId)
  chatroomDoc.set(
    {
      timer: time,
      isPlaying: play,
    },
    { merge: true }
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
      if (docSnapshot.exists) {
        modified(docSnapshot.data().goodUid)
      }
    },
    err => {
      console.log(`Encountered error: ${err}`)
    }
  )
}

export {
  getUserData,
  postMessage,
  deletePost,
  setPostListener,
  createNewChatroom,
  changePP,
  changeTimer,
  setDataListener,
  addGood,
  deleteGood,
  setGoodListener,
  // uploadIcon,
  changeName,
}
