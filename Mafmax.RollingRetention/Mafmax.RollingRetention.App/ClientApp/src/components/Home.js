import React, { Component, useState } from 'react';
import { AddButton } from './AddButton';
import './custom.css';
import { InputBlock } from './InputBlock';
import { CustomerButton } from './CustomerButton';
import store from './InputsStore'
import { Chart } from './Chart';
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
    static checkData(data) {
        let correct = Home.checkFields(store);
        if (!correct) {
            alert('One of the fields (red color) is incorrectly filled.');
            return false;
        }
        if (!this.checkDistinctIds(data)) {
            return false;
        }
        for (var i = 0; i < data.length; i++) {
            let id = Home.getInputValue('userID' + i);
            let reg = Home.getInputValue('regDate' + i);
            let last = Home.getInputValue('lastDate' + i);
            if (!Home.checkCorrectDate(reg)) {
                alert('Incorrect registration date in row ' + (i + 1));
                return false;
            }
            if (!Home.checkCorrectDate(last)) {
                alert('Incorrect last activity date in row ' + (i + 1));
                return false;
            }
            let currentLife = Home.getLifeTime(data[i]);
            if (currentLife < 0) {
                alert('Incorrect dates. [ id: ' + data[i].id + ' registration: ' + data[i].registrationDate + ' last activity: ' + data[i].lastActivityDate + ' ]');
                return;
            }
        }
        return true;
    }
    static getDate(date) {
        let splittedDate = date.split('.');
        let da = new Date();
        let d = new Date(splittedDate[2], splittedDate[1] - 1, splittedDate[0], 0, -da.getTimezoneOffset());
        return d;
    }
    static checkCorrectDate(date) {
        let splittedDate = date.split('.');
        let da = new Date();
        let d = new Date(splittedDate[2], splittedDate[1] - 1, splittedDate[0], 0, -da.getTimezoneOffset());
        if (d.getTime() > da.getTime()) return false;
        if (d.getDate() != splittedDate[0]) return false;
        if (d.getMonth() != splittedDate[1] - 1) return false;
        if (d.getFullYear() != splittedDate[2]) return false;
        return true;
    }
    static checkDistinctIds(users) {


        for (var i = 0; i < users.length; i++) {
            var index = users.findIndex((v, ind, o) => v.id == users[i].id).toString();
            if (i.toString() != index) {
                alert('Duplicates finded in raw ' + (i + 1));
                return false;
            }
        }
        return true;
    }
    static toIsoDate(date) {
        let splittedDate = date.split('.');
        let da = new Date();
        let d = new Date(splittedDate[2], splittedDate[1] - 1, splittedDate[0], 0, -da.getTimezoneOffset());
        let iso = d.toISOString();
        return iso;
    }

    updateUniqueKey() {
        this.setState({ uniqueKey: new Date().getTime() });
    }
    static changeInputValue(id, newValue = '') {
        let input = document.getElementById(id);
        input.value = newValue;

    }
   
    static removeElementById(id) {
        let element = document.getElementById(id);
        element.remove();
    }
    static getInputValue(id) {
        let input = document.getElementById(id);
        return input.value;
    }
    updateUsersData() {
        let dtos = this.state.userRetentionDtos;
        let users = [];
        let counter = 0;
        for (var i = 0; i < dtos.length; i++) {
            let id = Home.getInputValue('userID' + i);
            let reg = Home.getInputValue('regDate' + i);
            let last = Home.getInputValue('lastDate' + i);
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
        if (!Home.checkData(dtos)) {
            return;
        }
        for (var i = 0; i < dtos.length; i++) {

            users.push({ id: dtos[i].id, registrationDate: Home.toIsoDate(dtos[i].registrationDate), lastActivityDate: Home.toIsoDate(dtos[i].lastActivityDate) });
        }

        let json = JSON.stringify(users);
        console.log(json);
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
        if (!Home.checkData(dtos)) {
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
        Home.changeInputValue('userID' + id);
        Home.changeInputValue('regDate' + id);
        Home.changeInputValue('lastDate' + id);
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
    static renderChart(users, key = 0) {

        let data = Home.buildDataForChart(users);
        return (
            <Chart key={key + 'chart'} data={data} />
        );
    }
    static renderRolling(users, key = 0, daysAmount=7) {

        let rolling = Home.rollingRetationXDays(users, daysAmount);
        let message = isNaN(rolling) ? "The number of users who registered later than " + daysAmount + " days is zero. Rolling Retention " + daysAmount + " days is NaN." : "Rolling Retention " + daysAmount + " days is equal " + rolling + " %";

        return (
            <div key={key + 'rolling'}>{message}</div>
        );
    }

    renderTable(users, keyPrefix = 0) {

        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>
                            <div className="field-header">Row Number</div>
                        </th>
                        <th>
                            <div className="field-header">User Id</div>
                        </th>
                        <th>
                            <div className="field-header">Date Registration</div>
                        </th>
                        <th>
                            <div className="field-header">Date Last Activity</div>
                        </th>
                        <th>
                            <div className="field-header">Remove</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) =>
                        < tr key={keyPrefix + index} id={'user' + index} >
                            <td style={{ width: 100 }}>
                                <div style={{ textAlign: 'center' }}>{index + 1}</div>
                            </td>
                            <td>
                                <InputBlock placeHolder="number" pattern="[0-9]{1,9}" value={user.id} id={"userID" + index} />
                            </td>
                            <td>
                                <InputBlock placeHolder="dd.mm.yyyy" pattern="[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}" value={user.registrationDate} id={"regDate" + index} />
                            </td>
                            <td>
                                <InputBlock placeHolder="dd.mm.yyyy" pattern="[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}" value={user.lastActivityDate} id={"lastDate" + index} />
                            </td>
                            <td>
                                <CustomerButton text="Remove" id={"remove" + index} onClick={this.onRemove} />
                            </td>
                        </tr >
                    )}

                </tbody>
            </table>
        );

    }
    static checkFields(array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].valid == false) {
                return false;
            }
        }
        return true;
    }
    static getLifeTime(user) {
        let reg = Home.getDate(user.registrationDate);
        let last = Home.getDate(user.lastActivityDate);
        let oneDay = 1000 * 60 * 60 * 24;
        return Math.ceil((last.getTime() - reg.getTime()) / (oneDay));
    }
    static buildDataForChart(users) {
        let lifes = [];
        let result = [];
        let min = 999999999;
        let max = -1;
        for (var i = 0; i < users.length; i++) {
            let currentLifeTime = Home.getLifeTime(users[i]);
            min = Math.min(min, currentLifeTime);
            max = Math.max(max, currentLifeTime);
            lifes.push(currentLifeTime);
        }
        let addition = Math.ceil((max - min) / 50);
        if (min == max) {
            return [{ value: min, frequency: users.length }];
        }
        for (var i = min; i <= max; i += addition) {
            let value = addition == 1 ? i : "[ " + i + " - " + (i + addition - 1) + " ]";

            result.push({ value: value, frequency: lifes.filter((v, index, a) => v >= i && v <= i + addition - 1).length });
        }
        return result;
    }
    static getRegistrationOffset(user) {
        let reg = Home.getDate(user.registrationDate);
        let now = new Date();
        let oneDay = 1000 * 60 * 60 * 24;
        return Math.ceil((now.getTime() - reg.getTime()) / (oneDay));
    }
    static rollingRetationXDays(users, x = 7) {
        let returnCount = 0;
        let regCount = 0;
        for (var i = 0; i < users.length; i++) {
            let lifeTime = Home.getLifeTime(users[i]);
            if (lifeTime >= x) {
                returnCount++;
            }
            let regTime = Home.getRegistrationOffset(users[i]);
            if (regTime >= x) {
                regCount++;
            }
            console.log('Reg time: ' + regTime);
        }
        console.log('Return: ' + returnCount);
        console.log('Reg: ' + regCount);
        return returnCount / regCount * 100;
    }
    render() {
        const temperature = 'temper';
        const scale = 'scale';
        let rolling = this.state.showCharts ? Home.renderRolling(this.state.userRetentionDtos, this.state.uniqueKey) : <p><em>Press calculate button to show rolling rotation info:)</em></p>;
        let chart = this.state.showCharts ? Home.renderChart(this.state.userRetentionDtos, this.state.uniqueKey) : <p><em>Press calculate button to show life distribution :)</em></p>;
        let table = this.state.loading ? <p><em>Loading...</em></p> : this.renderTable(this.state.userRetentionDtos, this.state.uniqueKey);
        return (
            <div >

                {chart}
                {rolling}
                <div>
                    <AddButton text="Add one more" onClick={this.onAdd} />
                    <CustomerButton text="Save" onClick={this.onSave} />
                    <CustomerButton text="Calculate (not save)" onClick={this.onCalculate} />
                </div>
                {table}
            </div>
        );

    }
    local(dateString) {
        return new Date(dateString).toLocaleDateString();
    }
    async getUsers() {
        const response = await fetch('retention');
        const data = await response.json();
        let users = [];
        for (var i = 0; i < data.length; i++) {
            users.push({ id: data[i].id, registrationDate: this.local(data[i].registrationDate), lastActivityDate: this.local(data[i].lastActivityDate) });
        }
        this.setState({ userRetentionDtos: users, loading: false });
    }
}
