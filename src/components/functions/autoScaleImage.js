import { Image } from 'react-native';

export const autoScaleImage = (uri,passedWidth,passedHeight)=>{
  console.log('autoScaleImage called',uri, passedWidth,passedHeight)

  // let returnedValue = null

  Image.getSize(uri, (width, height) => {
    console.log('show width and height: ', uri, width, height)
      if (passedWidth && !passedHeight) {
          // this.setState({
          //     width: this.props.width,
          //     height: height * (this.props.width / width)
          // });
          console.log('show the values: ', (height * (passedWidth / width)), height, passedWidth, width)
          return (height * (passedWidth / width))
      } else if (!passedWidth && passedHeight) {
          // this.setState({
          //     width: width * (this.props.height / height),
          //     height: this.props.height
          // });
          return (width * (passedHeight / height))
      } else {
          // this.setState({ width: width, height: height });
          return null
      }

      // return returnedValue
  });
}
