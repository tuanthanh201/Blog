const sameImage = (img1, img2) => {
  return (
    img1 === img2 ||
    (img1 === null && img2 === '') ||
    (img2 === null && img1 === '')
  )
}

const arePostsEqual = (post1, post2) => {
  const keys = ['title', 'body', 'image', 'author']
  for (const key of keys) {
    if (post1[key] !== post2[key]) {
      if (key === 'image' && sameImage(post1[key], post2[key])) {
        continue
      } else if (key === 'author') {
        if (post1[key].toString() === post2[key].toString()) {
          continue
        }
      }
      return false
    }
  }
  return true
}

const arePostArraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false
  }

  const len = arr1.length
  for (let i = 0; i < len; i++) {
    if (!arePostsEqual(arr1[i], arr2[i])) {
      return false
    }
  }
  return true
}

module.exports = {
  arePostArraysEqual,
  arePostsEqual,
}
