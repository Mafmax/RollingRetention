import React, { Component } from 'react'
import store from './InputsStore'
export class InputBlock extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: this.props.value
        }
        store.push({ id: this.props.id, valid: true });
    }
    handleChange(event) {
        let valid = !event.target.validity.patternMismatch;
        let id = this.props.id;
        let a = [];
        let index = store.findIndex((val, i, a) => val.id == id);
        store[index].valid = valid;

        this.setState({ value: event.target.value });
    }
    componentWillUnmount() {
        let id = this.props.id;
        let index = store.findIndex((val, i, a) => val.id == id);
        store.splice(index,1);
    }
   
    render() {
        return (
            <input pattern={this.props.pattern} className='input-block' type="text" placeholder={this.props.placeHolder} id={this.props.id} value={this.state.value} onChange={this.handleChange} />
        );
    }
}