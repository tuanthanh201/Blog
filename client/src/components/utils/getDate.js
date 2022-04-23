import moment from 'moment'

const getDate = (dateString) => {
  const date = parseInt(dateString, 10)
  const twentyFourHrInMs = 12 * 60 * 60 * 1000

  const twentyFourHoursAgo = Date.now() - twentyFourHrInMs

  if (date > twentyFourHoursAgo) {
    return moment(date).fromNow()
  } else {
    return moment(date).format('HH:mm MMMM Do, YYYY')
  }
}

export default getDate
