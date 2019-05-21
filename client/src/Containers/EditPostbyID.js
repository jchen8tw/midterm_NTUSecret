import React, { Component } from 'react';
import { TextArea, Message } from 'semantic-ui-react';
import { Segment, Header, Container, Button, Transition, Menu, Placeholder } from 'semantic-ui-react';
class MessageBox extends Component {
  render() {
    if (this.props.successful) {
      return <Transition visible={this.props.visible} animation={'scale'} duration={500}>
        <Message positive>
          <Message.Header>Successfully Executed</Message.Header>
        </Message>
      </Transition>
    }
    else {
      return <Transition visible={this.props.visible} animation={'scale'} duration={500}>
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{(this.props.errmsg) ? this.props.errmsg : 'something went wrong...'}</p>
        </Message>
      </Transition>
    }
  }
}
class TextAreaInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.content
    }
  }
  handleInput = (e) => {
    this.setState({ text: e.target.value });
  }
  render() {
    return <TextArea rows={10} placeholder='type something' defaultValue={this.props.content} style={{ width: '100%', resize: 'none', padding: '1em', fontSize: '1.5em' }} onInput={this.handleInput} />
  }
}
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: null, //null true false
      dloading: false, //delete loading
      sloading: false, //submit loading
      submited: false,
      message: null,
      successful: null
    };
    this.textInput = React.createRef();
  }
  componentDidMount() {
    const { id, authtok } = this.props.match.params
    let status;
    fetch('/api/posts/' + id + '/' + authtok + '/message',).then(
      (res) => { status = res.ok; return res.json() }
    ).then(
      (res) => {
        this.setState({ message: res.message, fetched: status });
      }
    )
  }
  TryDecodeURI = (message) => {
    try {
      return decodeURI(message);
    } catch{
      return message;
    }
  }
  onSubmitClick = () => {
    if (this.state.sloading || this.state.dloading === true) {
      return;
    }
    if (!this.state.fetched){
      return;
    }
    const { id, authtok } = this.props.match.params
    let Inputval = this.textInput.current.state.text;
    this.setState({ sloading: true });
    let status;
    fetch('/api/posts/' + id + '/' + authtok + '/' + encodeURI(Inputval),{method: 'PUT'}).then(
      (res) => { status = res.ok; return res.json() }
    ).then((res) => {
      if (status) {
        this.setState({ sloading: false, submited: true, successful: true });
      }
      else{
        this.setState({ sloading: false, submited: true, successful: false ,message: res.message})
      }
    })
    /*
    console.log('set');
    this.setState({
        loading: true,
    });
    setTimeout(() => { btnfn(); this.setState({ loading: false, submited: true }); console.log('setStated'); }, 2000);
    */
  }
  onDeleteClick = ()=>{
    if (this.state.sloading || this.state.dloading === true) {
      return;
    }
    if (!this.state.fetched){
      return;
    }
    const { id, authtok } = this.props.match.params
    this.setState({ dloading: true });
    let status;
    fetch('/api/posts/' + id + '/' + authtok,{method: 'DELETE'}).then(
      (res) => { status = res.ok; return res.json() }
    ).then((res) => {
      if (status) {
        this.setState({ dloading: false, submited: true, successful: true });
      }
      else{
        this.setState({ dloading: false, submited: true, successful: false ,message: res.message})
      }
    })
  }
  render() {
    let InputPlace;
    if (this.state.fetched === true) {
      //TextAreaInput = () => <TextArea rows={10} placeholder='type something' children={`the gotten id is \n ${id}`} style={{ width: '100%', resize: 'none', padding: '1em', fontSize: '1.5em' }} />
      InputPlace = () => <TextAreaInput content={this.TryDecodeURI(this.state.message)} ref={this.textInput} />
    }
    else if (this.state.fetched === false) {
      InputPlace = () => <MessageBox successful={false} visible={true} errmsg={this.state.message} />
    }
    else {
      InputPlace = () => <Placeholder>
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder>//loading
    }
    return (
      <Transition transitionOnMount={true} animation={'fade left'} duration={1000}>
        <Container text textAlign='center' style={{ margin: '5em 0em' }}>
          <Segment.Group raised>
            <Segment textAlign='center'>
              <Header as='h1'>Edit Post</Header>
            </Segment>
            <Segment textAlign='center'>
              <InputPlace />
            </Segment>
            <Segment>
              <Container fluid>
                <Menu secondary>
                  <Menu.Item position='left'><Button loading={this.state.dloading} color='red' type='submit' size='large' onClick={this.onDeleteClick}> Delete </Button></Menu.Item>
                  <Menu.Item position='right'><Button loading={this.state.sloading} color='black' type='submit' size='large' onClick={this.onSubmitClick}> Submit Edited </Button></Menu.Item>
                </Menu>
              </Container>
              <MessageBox visible={this.state.submited} successful={this.state.successful} errmsg={this.state.message} />
            </Segment>
          </Segment.Group>
        </Container>
      </Transition>
    )
  }
}

//TODO error handling of edit api