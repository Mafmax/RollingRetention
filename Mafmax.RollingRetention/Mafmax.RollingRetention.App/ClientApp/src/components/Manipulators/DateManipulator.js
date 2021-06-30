export class DateManipulator {



    static parseDateFromLocalDateString(dateString) {
        let splittedDate = dateString.split('.');
        let offset = new Date().getTimezoneOffset();
        let d = new Date(splittedDate[2], splittedDate[1] - 1, splittedDate[0], 0, -offset);
        return d;
    }
    static getOneDayMilliseconds() {
        return 1000 * 60 * 60 * 24;
    }


    static check(dateString) {
        let splittedDate = dateString.split('.');
        let now = new Date();
        let offset = now.getTimezoneOffset();
        let d = new Date(splittedDate[2], splittedDate[1] - 1, splittedDate[0], 0, -offset);
        if (d.getTime() > now.getTime()) return false;
        if (d.getDate() != splittedDate[0]) return false;
        if (d.getMonth() != splittedDate[1] - 1) return false;
        if (d.getFullYear() != splittedDate[2]) return false;
        return true;
    }
    static localDateStringToIso(dateString) {
        let splittedDate = dateString.split('.');
        let offset = new Date().getTimezoneOffset();
        let d = new Date(splittedDate[2], splittedDate[1] - 1, splittedDate[0], 0, -offset);
        let iso = d.toISOString();
        return iso;
    }
    static isoToLocalDateString(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

}