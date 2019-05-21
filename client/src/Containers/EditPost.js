import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Input } from 'semantic-ui-react';
import { Segment, Header, Container, Button, Transition, Message,Grid } from 'semantic-ui-react';
import ReCAPTCHA from "react-google-recaptcha";

class Uuidinput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: null
    }
  }
  handleChange = (e) => {
    this.setState({ text: e.target.value });
  }
  render() {
    return <Input fluid placeholder='enter uuid' style={{ fontSize: '1.5em' }} onChange={this.handleChange} />;
  }
}
class ErrMessageBox extends Component {
  render() {
    return (<Transition visible={this.props.visible} animation={'scale'} duration={500}>
      <Message negative>
        <Message.Header>Something went wrong</Message.Header>
        {(this.props.err) ? this.props.err : <p>please contact the site admin</p>}
      </Message>
    </Transition>)
  }
}

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      err: false,
      uuid: null,
      errormsg: null
    };
    this.textInput = React.createRef();
    this.recap = React.createRef();
    //should change later
    //this.recaptok = '03AOLTBLQV13D2Vtt-pHN-F-lp0B70PkfLs-8BPyfk-tLdlU6uxQLUtWTnzajUz39oQ43Q0dSTtByWKyXDCfUcI0ToltkGfMVIxMzTWwGNBJzZSoyDJg5asby-f9vALSu0NyIDdvlW4vnsgzE2j9riK6Vj9K_T5KYAIfLLutZq-2MesQqfF66HsW5YdMJZDmYR_fFs_xQtXWruxfgIcHANPqNd9u8iaTrhc_3KhotPwBaiFDOuzB_HZFIhQ_-U3p0OodBigl1nAtC23JQffw19fbHRRAxKSTfjULuEnoMfMeY1Yv9AOymHL7PGqKm-zTV4zNEdn30-o79F'
  }
  recaptchaOnChange = (value) => {
    this.recaptok = value;
  }
  ClickHandler = () => {
    if (this.state.loading === true) {
      return;
    }
    let Inputval = this.textInput.current.state.text;
    this.setState({ loading: true });
    if (Inputval === '') {
      this.setState({ err: true, loading: false, errormsg: <p>empty uuid</p> });
      return;
    }
    
    if (!this.recaptok) {
      this.setState({ err: true, loading: false, errormsg: <p>please verify that you are not robot</p> })
      return;
    }
    
    let status;
    fetch('/api/posts/' + Inputval + '/' + this.recaptok)
      .then((res) => {
        status = res.ok;
        return res.json();
      })
      .then(
        (res) => {
          if (status) {
            this.setState({ uuid: Inputval });
          }
          else {
            console.log(res.message);
            this.setState({ err: true, loading: false, errormsg: <p>{res.message}</p> })
          }
        }
      )

    /*
    console.log('set');
    this.setState({
        loading: true,
    });
    setTimeout(() => { btnfn(); this.setState({ loading: false, submited: true }); console.log('setStated'); }, 2000);
    */
  }
  render() {
    if (!this.state.uuid) {
      return (
        <Transition transitionOnMount={true} animation={'fade left'} duration={1000}>
          <Container text textAlign='center' style={{ margin: '5em 0em' }}>
            <Segment.Group raised>
              <Segment textAlign='center'>
                <Header as='h1'>Enter Post UUID</Header>
              </Segment>
              <Segment textAlign='center'>
                <Uuidinput ref={this.textInput} />
              </Segment>
              <Segment>
                <Container style={{ padding: '1em 0em' }}>
                  <Grid centered columns={2}>
                    <Grid.Column>
                      <ReCAPTCHA theme='dark' sitekey='your recaptcha client side key' onChange={this.recaptchaOnChange} ref={this.recap} />
                    </Grid.Column>
                  </Grid>
                </Container>
                <Container fluid textAlign='center'>
                  <Button loading={this.state.loading} color='black' type='submit' fluid size='large' onClick={this.ClickHandler}>Submit</Button>
                </Container>
                <ErrMessageBox visible={this.state.err} err={this.state.errormsg} />
              </Segment>
            </Segment.Group>
          </Container>
        </Transition>
      )
    }
    else {
      return <Redirect  to={'/editpost/' + this.state.uuid+ '/' + this.recaptok} />
    }

  }
}
