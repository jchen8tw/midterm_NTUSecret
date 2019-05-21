import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { Segment, Container, Menu, Transition, Header } from 'semantic-ui-react';
export default class extends Component {
    render() {
        return (
            <Segment inverted vertical style={{ padding: '1em 0em' }}>
                <Menu inverted size='large' secondary>
                    <Transition transitionOnMount={true} animation={'fade left'} duration={1000}>
                         <Container fluid style={{padding:'0em 5em'}}>
                            <Header size='huge' as={NavLink} to='/' inverted>NTUSecrets</Header>
                        </Container>
                    </Transition>
                </Menu>
            </Segment>
        );
    }
}