import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubProjectDetails from './subcomponents/ProjectDetails';

class ProjectDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount ProjectDetails')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')

      // console.log('show me values in ProjectDetails', email, this.props);

      if (email !== null) {
        // We have data!!

        let selectedProject = null
        let objectId = null
        if (this.props.route && this.props.route.params) {
          console.log('show params: ', this.props.route)

          selectedProject = this.props.route.params.selectedProject
          objectId = this.props.route.params.objectId
          // console.log('show objectId: ', objectId)
        }

        this.setState({ selectedProject, objectId })

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called within projectDetails ')

    if (this.props.route.params && this.props.route.params.selectedProject !== prevProps.route.params.selectedProject) {
      console.log('new career selected in parent')
      this.setState({ selectedProject: this.props.route.params.selectedProject })
    }
  }

  render() {
    return (
      <View>
        <SubProjectDetails navigation={this.props.navigation} closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} selectedProject={this.state.selectedProject} objectId={this.state.objectId} orgCode={this.state.activeOrg} excludeModal={true} />
      </View>
    )
  }
}

export default ProjectDetails;
