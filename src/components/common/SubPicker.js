import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator, Image, TextInput } from 'react-native';
const styles = require('../css/style');
import {Picker} from '@react-native-picker/picker';

const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png'

class SubPicker extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }

        this.retrieveData = this.retrieveData.bind(this)
        this.formChangeHandler = this.formChangeHandler.bind(this)

    }

    componentDidMount() {
      //see if user is logged in
      console.log('profilePage just mounted')

      this.retrieveData()

    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in SubExternalProfile', this.props, prevProps)

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode || this.props.posts !== prevProps.posts) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {
        console.log('retrieveData called in renderPosts')

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    formChangeHandler = (eventName,eventValue) => {
      console.log('formChangeHandler called')
    }

    render() {

      return (
        <View style={[styles.flex1,styles.pinBottom,styles.justifyEnd]}>
          <View style={[styles.card,styles.absoluteBottom0,styles.absoluteLeft0,styles.absoluteRight0]}>
            <View style={[styles.rowDirection,styles.bottomMargin]}>
              <View style={[styles.calcColumn120]}>
                <Text style={[styles.descriptionText2]}>Pick {this.props.pickerName}</Text>
              </View>
              <View style={[styles.width30]}>
                <TouchableOpacity onPress={() => this.props.closeModal()}>
                  <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.lightHorizontalLine]} />

            {(this.props.differentLabels) ? (
              <Picker
                selectedValue={this.props.selectedValue}
                onValueChange={(itemValue, itemIndex) =>
                  this.props.formChangeHandler(this.props.selectedName,itemValue)
                }>
                  {this.props.selectedOptions.map(value =>
                    <Picker.Item key={value.label} label={value.label} value={value.value} />
                  )}
              </Picker>
            ) : (
              <Picker
                selectedValue={this.props.selectedValue}
                onValueChange={(itemValue, itemIndex) =>
                  this.props.formChangeHandler(this.props.selectedName,itemValue)
                }>
                  {this.props.selectedOptions.map(value =>
                    <Picker.Item key={(this.props.selectedSubKey) ? value[this.props.selectedSubKey] : value} label={(this.props.selectedSubKey) ? value[this.props.selectedSubKey] : value} value={(this.props.selectedSubKey) ? value[this.props.selectedSubKey] : value} />
                  )}
              </Picker>
            )}

          </View>
        </View>
      )
    }
}

export default SubPicker;
