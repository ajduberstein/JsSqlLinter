const hasWindow = (() => {
  /**
   * Test to see if using browser
   */
  try {
    window
    return true
  } catch(err) {
    return false
  }
})()

const log = (msg) => {
  console.log(msg)
}

const debug = (...msg) => {
  let msgs = []
  if (!hasWindow) {
    for (let each of msg) {
      if (typeof each === 'object' && each !== null) {
        each = JSON.stringify(each)
      }
      msgs.push(each)
    }
    console.log(`DEBUG\t[${new Date()}]\t${msgs}`)
  }
}


export {
  log, debug
}
