export class DOMManipulator {

    static checkFields(array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].valid == false) {
                return false;
            }
        }
        return true;
    }
    static changeValue(id, newValue = '') {
        let input = document.getElementById(id);
        input.value = newValue;

    }
    static removeElementById(id) {
        let element = document.getElementById(id);
        element.remove();
    }
    static getValueById(id) {
        let input = document.getElementById(id);
        return input.value;
    }
}