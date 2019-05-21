import React, { Component } from 'react';
import { TextArea, Message, Transition, Grid } from 'semantic-ui-react';
import { Segment, Header, Container, Button } from 'semantic-ui-react';
import ReCAPTCHA from "react-google-recaptcha";
class MessageBox extends Component {
  render() {
    if (this.props.successful) {
      return <Transition visible={this.props.visible} animation={'scale'} duration={500}>
        <Message positive>
          <Message.Header>Submit Successful</Message.Header>
          <p>
            please copy your <b>uuid</b> as following:
          </p>
          <p><b>{this.props.uuid}</b></p>
          <p>note: that uuid is not recoverable, keep them for futher modification of your posts</p>
        </Message>
      </Transition>
    }
    else {
      return <Transition visible={this.props.visible} animation={'scale'} duration={500}>
        <Message negative>
          <Message.Header>Something went wrong</Message.Header>
          {(this.props.err) ? this.props.err : <p>please contact the site admin</p>}
        </Message>
      </Transition>
    }

  }
}
class TextAreaInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: null
    }
  }
  handleInput = (e) => {
    this.setState({ text: e.target.value });
  }
  render() {
    return <TextArea rows={10} placeholder='type something' style={{ width: '100%', resize: 'none', padding: '1em', fontSize: '1.5em' }} onInput={this.handleInput} />
  }
}
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      submited: false,
      successful: false,
      errormsg: null
    };
    this.textInput = React.createRef();
    this.recap = React.createRef();
  }
  recaptchaOnChange = (value) => {
    this.recaptok = value;
  }
  ClickHandler = () => {
    if (this.state.loading === true) {
      return;
    }
    this.setState({ loading: true });
    //convert to URI encoded
    let Inputval = encodeURI(this.textInput.current.state.text);
    if (Inputval === '') {
      this.setState({ submited: true, loading: false, successful: false, errormsg: <p>empty string</p> });
      return;
    }
    
    if (!this.recaptok) {
      this.setState({ submited: true, loading: false, successful: false, errormsg: <p>please verify that you are not robot</p> })
      return;
    }
    
    fetch('/api/posts',
      {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: Inputval, verifytoken: this.recaptok })
      })
      .then((res) => res.json())
      .catch((err) => this.setState({ submited: true, loading: false, successful: false, errormsg: <p>{err.message}</p> }))
      .then((res) => {
        if(res.uuid){
          this.setState({ loading: false, submited: true, successful: true, uuid: res.uuid })
        }
        else{
          this.setState({ submited: true, loading: false, successful: false, errormsg: <p>{res.message}</p> })
        }
      })
    this.recap.current.reset();
    this.recaptok = null;
    
    /*
    console.log('set');
    this.setState({
        loading: true,
    });
    setTimeout(() => { btnfn(); this.setState({ loading: false, submited: true }); console.log('setStated'); }, 2000);
    */
  }
  render() {
    return (
      <Transition transitionOnMount={true} animation={'fade left'} duration={1000}>
        <Container text textAlign='center' style={{ margin: '5em 0em' }}>
          <Segment.Group raised>
            <Segment textAlign='center'>
              <Header as='h1'>Enter New Text</Header>
            </Segment>
            <Segment textAlign='center'>
              <TextAreaInput ref={this.textInput} />
            </Segment>
            <Segment>
              <Container style={{ padding: '1em 0em' }}>
                <Grid centered columns={2}>
                  <Grid.Column>
                    <ReCAPTCHA theme='dark' sitekey='your recaptcha client side key' onChange={this.recaptchaOnChange} ref={this.recap}/>
                  </Grid.Column>
                </Grid>
              </Container>
              <Container fluid textAlign='center'>
                <Button loading={this.state.loading} color='black' type='submit' fluid size='large' onClick={this.ClickHandler}>Submit</Button>
              </Container>
              <MessageBox visible={this.state.submited} successful={this.state.successful} uuid={this.state.uuid} err={this.state.errormsg} />
            </Segment>
          </Segment.Group>
        </Container>
      </Transition>
    )
  }
}
