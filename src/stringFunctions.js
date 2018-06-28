const removeLastOf = (character, str) => {
  let pos = str.lastIndexOf(character)
  str = str.substring(0, pos) + character + str.substring(pos + 1)
  return str
}

const removeFirstOf = (character, str) => {
  return str.replace(character, '')
}

