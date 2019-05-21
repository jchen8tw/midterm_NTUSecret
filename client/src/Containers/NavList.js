import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Container, Button, Grid, Icon, Transition } from 'semantic-ui-react';

export default class extends Component {
    render() {
        return (
            <Segment vertical>

                <Container text style={{ margin: '5em 0em' }}>
                    <Grid centered>

                        <Grid.Row>
                            <Transition transitionOnMount={true} animation={'fade left'} duration={1000}>
                                <Button fluid color='black' animated='vertical' size='massive' as={Link} to='/editpost'>
                                    <Button.Content visible >Edit Post</Button.Content>
                                    <Button.Content hidden><Icon name='arrow right' /></Button.Content>
                                </Button>
                            </Transition>
                        </Grid.Row>
                        <Grid.Row>
                            <Transition transitionOnMount={true} animation={'fade left'} duration={1000}>
                                <Button animated='vertical' fluid color='black' size='massive' as={Link} to='/newpost'>
                                    <Button.Content visible >New Post</Button.Content>
                                    <Button.Content hidden><Icon name='arrow right' /></Button.Content>
                                </Button>
                            </Transition>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
        )
    }
}