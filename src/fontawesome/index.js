import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faLock,
  faLockOpen,
  faReply,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons'
//import { faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'
import FontAwesomeIcon from './FontAwesomeIcon.vue'

library.add(faLock, faLockOpen, faReply, faThumbsUp)

export { FontAwesomeIcon }
