export const convertStringToDate = (passedValue, type)=>{
  console.log('convertStringToDate called', passedValue, type)

  let returnedValue = new Date()
  if (type === 'toLocal') {
    // date and time from client dropdown
    const datePassedValue = new Date(passedValue)
    let universalTime = datePassedValue.getTime()
    let timeOffset = new Date().getTimezoneOffset()*60000
    returnedValue = new Date(universalTime - timeOffset)
    console.log('returnedValue: ', passedValue, datePassedValue, returnedValue)
  } else if (type === 'dateOnly') {
    // only date from client dropdown

    const datePassedValue = new Date(passedValue)
    let universalTime = datePassedValue.getTime()
    let timeOffset = new Date().getTimezoneOffset()*60000
    returnedValue = new Date(universalTime + timeOffset)
    console.log('returnedValue: ', passedValue, datePassedValue, returnedValue)
  }

  return returnedValue
}
