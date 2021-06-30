import React, { Component } from 'react';
import './custom.css';

export class AddButton extends Component {

    static displayName = AddButton.name;
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <button className='add-button' onClick={this.props.onClick}>
                <div className='plus' >
                    <div className="line-horizontal"></div>
                    <div className="line-vertical"></div>
                </div>
                <div className='button-text'>{this.props.text}</div>
            </button>
        );
    }

}