import React, { Component } from 'react';
import './custom.css';

export class CustomerButton extends Component {

    static displayName = CustomerButton.name;
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <button id={this.props.id} className='add-button' onClick={this.props.onClick}>
                <div className='button-text'>{this.props.text}</div>
            </button>
        );
    }

}