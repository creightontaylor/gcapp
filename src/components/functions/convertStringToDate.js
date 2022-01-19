export const convertStringToDate = (passedValue, type)=>{
  console.log('convertStringToDate called', passedValue, type)

  let returnedValue = new Date()
  if (type === 'toLocal') {
    // date and time from client dropdown
    const datePassedValue = new Date(passedValue)
    let universalTime = datePassedValue.getTime()
    let timeOffset = new Date().getTimezoneOffset()*60000
    returnedValue = new Date(universalTime - timeOffset)
    // console.log('returnedValue: ', passedValue, datePassedValue, returnedValue)
  } else if (type === 'dateOnly') {
    // only date from client dropdown

    const datePassedValue = new Date(passedValue)
    let universalTime = datePassedValue.getTime()
    let timeOffset = new Date().getTimezoneOffset()*60000
    returnedValue = new Date(universalTime + timeOffset)
    // console.log('returnedValue: ', passedValue, datePassedValue, returnedValue, new Date(1598051730000))

    // 2002-09-13
    // 2002-09-13T00:00:00.000Z
    // 2002-09-13T08:00:00.000Z
    // 2020-08-21T23:15:30.000Z
  }

  return returnedValue
}
