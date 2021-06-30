import React, { Component, useState } from 'react';
import { AddButton } from './AddButton';
import './custom.css';
import { CustomerButton } from './CustomerButton';
import { DateManipulator } from './Manipulators/DateManipulator';
import { DOMManipulator } from './Manipulators/DOMManipulator';
import { UsersManipulator } from './Manipulators/UsersManipulator';
import { RenderManipulator } from './Manipulators/RenderManipulator';
export class Home extends Component {
    static displayName = Home.name;
    constructor(props) {
        super(props);
        this.state = {
            userRetentionDtos: [],
            counter: 0,
            loading: true,
            countOfErrorFields: 0,
            uniqueKey: 0,
            showCharts: false
        };
        this.onAdd = this.onAdd.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onCalculate = this.onCalculate.bind(this);
        this.onRemove = this.onRemove.bind(this);
    }
    componentDidMount() {
        this.getUsers();
    }
    updateUniqueKey() {
        this.setState({ uniqueKey: new Date().getTime() });
    }
    updateUsersData() {
        let dtos = this.state.userRetentionDtos;
        let users = [];
        let counter = 0;
        for (var i = 0; i < dtos.length; i++) {
            let id = DOMManipulator.getValueById('userID' + i);
            let reg = DOMManipulator.getValueById('regDate' + i);
            let last = DOMManipulator.getValueById('lastDate' + i);
            let values = 'vals' + id + reg + last;
            if (values === 'vals') {
                continue;

            }

            users.push({ id: id, registrationDate: reg, lastActivityDate: last });
            counter++;
        }

        return users;
    }
    async onSave() {
        let users = [];
        let dtos = this.updateUsersData();
        if (!UsersManipulator.checkData(dtos)) {
            return;
        }
        for (var i = 0; i < dtos.length; i++) {

            users.push({ id: dtos[i].id, registrationDate: DateManipulator.localDateStringToIso(dtos[i].registrationDate), lastActivityDate: DateManipulator.localDateStringToIso(dtos[i].lastActivityDate) });
        }
        let json = JSON.stringify(users);
        this.setState({ userRetentionDtos: dtos });
        fetch('/retention/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: json

        })
        alert('Data saved');
    }
    onCalculate() {
        let dtos = this.updateUsersData();
        this.updateUniqueKey();
        if (dtos.length == 0) {
            alert('No data for calculating');
            return;
        }
        if (!UsersManipulator.checkData(dtos)) {
            return;
        }

        this.setState({ userRetentionDtos: dtos, showCharts: true });
    }
    removeEmptyFields() {
        var users = this.updateUsersData();
        this.updateUniqueKey();

        this.setState({ userRetentionDtos: users, showCharts: false });
    }
    onRemove(event) {
        let id = event.currentTarget.id.replace('remove', '');
        DOMManipulator.changeValue('userID' + id);
        DOMManipulator.changeValue('regDate' + id);
        DOMManipulator.changeValue('lastDate' + id);
        this.removeEmptyFields();
    }
    onAdd() {
        this.removeEmptyFields();
        let users = this.state.userRetentionDtos;
        let date = new Date();
        let dateNow = date.toLocaleDateString();
        let newId = 1;
        while (users.filter((v, index, a) => v.id == newId).length > 0) {
            newId++;
        }
        users.unshift({ id: newId, registrationDate: dateNow, lastActivityDate: dateNow });
        this.setState(prevState => ({
            counter: prevState.counter + 1,
            userRetentionDtos: users,
            showCharts: false
        }));
    }



    render() {
        let rolling = this.state.showCharts ? RenderManipulator.renderRolling(this.state.userRetentionDtos, this.state.uniqueKey) : <p><em>Press calculate button to show Rolling Retention info:)</em></p>;
        let chart = this.state.showCharts ? RenderManipulator.renderChart(this.state.userRetentionDtos, this.state.uniqueKey) : <p><em>Press calculate button to show Life Cycle distribution :)</em></p>;
        let table = this.state.loading ? <p><em>Loading...</em></p> : RenderManipulator.renderTable(this.state.userRetentionDtos, this.onRemove, this.state.uniqueKey);
        return (
            <div >

                {chart}
                {rolling}
                <div>
                    <AddButton text="Add one more" onClick={this.onAdd} />
                    <CustomerButton text="Save" onClick={this.onSave} />
                    <CustomerButton text="Calculate" onClick={this.onCalculate} />
                </div>
                {table}
            </div>
        );

    }
    
    async getUsers() {
        const response = await fetch('retention');
        const data = await response.json();
        let users = [];
        for (var i = 0; i < data.length; i++) {
            users.push({ id: data[i].id, registrationDate: DateManipulator.isoToLocalDateString(data[i].registrationDate), lastActivityDate: DateManipulator.isoToLocalDateString(data[i].lastActivityDate) });
        }
        this.setState({ userRetentionDtos: users, loading: false });
    }
}
