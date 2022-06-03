import Axios from 'axios';

export const requestConnection = async(friend)=>{
  console.log('requestConnection called')

  return await Axios.post('https://www.guidedcompass.com/api/friend/request', friend)
  .then(async(response) => {

    // "orgCode": "unite-la", "orgName": "UNITE-LA", "recipientEmail": "creightontaylor+1000@gmail.com", "recipientFirstName": "Cray", "recipientHeadline": undefined, "recipientLastName": "Zay", "recipientPictureURL": undefined, "recipientUsername": "crayzay-581", "relationship": "Peer", "senderEmail": "creightontaylor+7@gmail.com", "senderEmployerName": undefined, "senderFirstName": "Paul", "senderHeadline": "I'm building products people love", "senderJobTitle": undefined, "senderLastName": "Dawson", "senderPictureURL": "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/profilePics/profilePic%7Ccreightontaylor%2B7%40gmail.com%7C57F9ADE4-E704-4BF0-9ECD-AC42F986BE0C.jpg%7CWed%20Jan%2019%202022%2013%3A25%3A11%20GMT-0800%20%28PST%29", "senderSchoolName": "Abram Friedman occupational center ", "senderUsername": "crayzay1", "unsubscribed": null

    if (response.data.success) {

      return { success: true, message: response.data.message }

    } else {

      return { success: false, message: response.data.message }
    }
  }).catch((error) => {
      console.log('Advisee request send did not work', error);
  });
}
