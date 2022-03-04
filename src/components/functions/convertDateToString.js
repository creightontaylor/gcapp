export const convertDateToString = (passedValue, type)=>{
  console.log('convertDateToString called', passedValue, type)

  function convertTime(passedTime) {
    // console.log('convertTime called')

    let returnedTime = ''
    if (passedTime) {
      let hours = Number(passedTime.substring(0,2))
      if (hours > 12) {
        returnedTime = (hours - 12).toString() + ':' + passedValue.substring(14,16) + 'PM'
      } else if (hours === 12) {
        returnedTime = (hours).toString() + ':' + passedValue.substring(14,16) + 'PM'
      } else {
        returnedTime = passedTime + ' AM'
      }
    }

    return returnedTime
  }

  let returnedValue = ''
  if (passedValue && passedValue !== '') {
    if (type === 'first16') {

      returnedValue = passedValue.toString().substring(0,16)
    } else if (type === 'first10') {
      returnedValue = passedValue.toString().substring(0,10)
    } else if (type === 'datetime') {
      console.log('in datetime', passedValue)
      returnedValue = passedValue.toString().substring(0,16)
      const dateArray = returnedValue.split("T")

      const month = dateArray[0].substring(5,7)
      const day = dateArray[0].substring(8,10)
      const year = dateArray[0].substring(0,4)

      returnedValue = month + '/' + day + '/' + year + ' ' + convertTime(dateArray[1])
    } else if (type === 'datetime-2') {
      console.log('in datetime-2', passedValue)
      let month = passedValue.getMonth()
      if ((month + 1) >= 10) {
        month = (month + 1).toString()
      } else {
        month = '0' + (month + 1).toString()
      }

      let day = passedValue.getDate()
      if (day < 10) {
        day = '0' + day.toString()
      } else {
        day = day.toString()
      }
      const year = passedValue.getFullYear()

      let hours = passedValue.getHours().toString()
      let suffix = 'AM'
      if (hours > 12) {
        hours = (hours - 12).toString()
        suffix = 'PM'
      } else if (hours === 12) {
        hours = (hours).toString()
        suffix = 'PM'
      } else if (hours === 0) {
        hours = '12'
        suffix = 'AM'
      } else {
        hours = hours.toString()
      }

      let mins = passedValue.getMinutes().toString()
      if (mins < 10) {
        mins = '0' + mins.toString()
      } else {
        mins = mins.toString()
      }

      returnedValue = month + '/' + day + '/' + year + ' ' + hours + ':' + mins + suffix
    } else if (type === 'date') {

      returnedValue = passedValue.toString().substring(0,10)

      const month = returnedValue.substring(5,7)
      const day = returnedValue.substring(8,10)
      const year = returnedValue.substring(0,4)

      returnedValue = month + '/' + day + '/' + year
    } else if (type === 'date-2') {
      console.log('in date-2', passedValue)
      let month = passedValue.getMonth()
      if ((month + 1) >= 10) {
        month = (month + 1).toString()
      } else {
        month = '0' + (month + 1).toString()
      }

      let day = passedValue.getDate()
      if (day > 10) {
        day = day.toString()
      } else {
        day = '0' + day.toString()
      }
      const year = passedValue.getFullYear()

      returnedValue = month + '/' + day + '/' + year
    } else if (type === 'hyphenatedDate') {
      // console.log('show passedValue: ', passedValue)
      let month = passedValue.getMonth()
      console.log('show month: ', month)
      if ((month + 2) > 10) {
        month = (month + 1).toString()
      } else {
        month = '0' + (month + 1).toString()
      }
      let day = passedValue.getDate()
      if ((day + 1) > 10) {
        day = day.toString()
      } else {
        day = '0' + day.toString()
      }
      const year = passedValue.getFullYear()
      // console.log('dateForInput: ', month, day, year)
      // returnedValue = passedValue.toString().substring(0,10)
      //
      // const month = returnedValue.substring(5,7)
      // const day = returnedValue.substring(8,10)
      // const year = returnedValue.substring(0,4)

      returnedValue = year + '-' + month + '-' + day
    } else if (type === 'hyphenatedDateTime') {
      // console.log('show passedValue: ', passedValue)
      let month = passedValue.getMonth()
      if ((month + 2) >= 10) {
        month = (month + 1).toString()
      } else {
        month = '0' + (month + 1).toString()
      }
      let day = passedValue.getDate()
      if ((day + 1) > 10) {
        day = day.toString()
      } else {
        day = '0' + day.toString()
      }
      const year = passedValue.getFullYear()

      let hours = passedValue.getHours().toString()
      if (Number(hours) < 10) {
        hours = '0' + hours
      }

      let mins = passedValue.getMinutes().toString()
      if (Number(mins) < 10) {
        mins = '0' + mins
      }

      console.log('show hours: ', hours)
      console.log('show mins: ', mins)

      // console.log('dateForInput: ', month, day, year)
      // returnedValue = passedValue.toString().substring(0,10)
      //
      // const month = returnedValue.substring(5,7)
      // const day = returnedValue.substring(8,10)
      // const year = returnedValue.substring(0,4)

      returnedValue = year + '-' + month + '-' + day + 'T' + hours + ':' + mins

    } else if (type === 'daysAgo') {

      if (typeof passedValue === 'string') {
        // technically converting string to string
        const passedValueDate = new Date(passedValue)
        const diffTime = Math.abs(passedValueDate - new Date());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // console.log('difference between days ', passedValueDate, typeof passedValueDate, diffTime, diffDays)

        returnedValue = diffDays + ' days ago'

      } else {
        // this is actually a date to string
        returnedValue = 'N/A'
      }
    }
  }

  return returnedValue
}
