import { DateManipulator } from "./DateManipulator";
import { DOMManipulator } from "./DOMManipulator";

import store from '../InputsStore'

export class UsersManipulator {
    
    static checkData(data) {
        let correct = DOMManipulator.checkFields(store);
        if (!correct) {
            alert('One of the fields (red color) is incorrectly filled.');
            return false;
        }
        if (!UsersManipulator.checkDistinctIds(data)) {
            return false;
        }
        for (var i = 0; i < data.length; i++) {
            
            let id = DOMManipulator.getValueById('userID' + i);
            let reg = DOMManipulator.getValueById('regDate' + i);
            let last = DOMManipulator.getValueById('lastDate' + i);
            if (!DateManipulator.check(reg)) {
                alert('Incorrect registration date in row ' + (i + 1));
                return false;
            }
            
            if (!DateManipulator.check(last)) {
                alert('Incorrect last activity date in row ' + (i + 1));
                return false;
            }
            let currentLife = UsersManipulator.getLifeTime(data[i]);
            if (currentLife < 0) {
                alert('Incorrect dates. [ id: ' + data[i].id + ' registration: ' + data[i].registrationDate + ' last activity: ' + data[i].lastActivityDate + ' ]');
                return;
            }
        }
        return true;
    }
    static getLifeTime(user) {
        let reg = DateManipulator.parseDateFromLocalDateString(user.registrationDate);
        let last = DateManipulator.parseDateFromLocalDateString(user.lastActivityDate);
        let oneDay = DateManipulator.getOneDayMilliseconds();
        return Math.ceil((last.getTime() - reg.getTime()) / (oneDay));
    }
    static buildDataForChart(users) {
        let lifes = [];
        let result = [];
        let min = 999999999;
        let max = -1;
        for (var i = 0; i < users.length; i++) {
            let currentLifeTime = UsersManipulator.getLifeTime(users[i]);
            min = Math.min(min, currentLifeTime);
            max = Math.max(max, currentLifeTime);
            lifes.push(currentLifeTime);
        }
        let addition = Math.ceil((max - min) / 25);
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
        let reg = DateManipulator.parseDateFromLocalDateString(user.registrationDate);
        let now = new Date();
        let oneDay = DateManipulator.getOneDayMilliseconds();
        return Math.ceil((now.getTime() - reg.getTime()) / (oneDay));
    }
    static rollingRetationXDays(users, x = 7) {
        let returnCount = 0;
        let regCount = 0;
        for (var i = 0; i < users.length; i++) {
            let lifeTime = UsersManipulator.getLifeTime(users[i]);
            if (lifeTime >= x) {
                returnCount++;
            }
            let regTime = UsersManipulator.getRegistrationOffset(users[i]);
            if (regTime >= x) {
                regCount++;
            }
        }
        return returnCount / regCount * 100;
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
}