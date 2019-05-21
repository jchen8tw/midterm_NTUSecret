import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
export default class extends Component {
    render() {
        return (
            <Segment vertical textAlign='center'>
            {/* make multiple white space possible */}
                <p style={{ whiteSpace: 'pre' }}>(ɔ) 2019-present</p>
                <p>NTUSecret - 管理Facebook匿名頁面最優質的服務</p>
            </Segment>
        );
    }
}
