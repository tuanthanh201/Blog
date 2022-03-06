import moment from 'moment'

const getDate = (dateString) => {
  return moment(parseInt(dateString, 10)).format('MMMM Do, YYYY')
}

export default getDate
