import { Chart } from "../Chart";
import { UsersManipulator } from "./UsersManipulator";
import React from 'react';
import { Home } from "../Home";
import { InputBlock } from "../InputBlock";
import { CustomerButton } from "../CustomerButton";
export class RenderManipulator {
    static renderChart(users, key = 0) {

        let data = UsersManipulator.buildDataForChart(users);
        return (
            
            <Chart key={key + 'chart'} data={data} />
        );
    }
    static renderRolling(users, key = 0, daysAmount = 7) {
        


        let rolling = UsersManipulator.rollingRetationXDays(users, daysAmount);
        let message = isNaN(rolling) ? "The number of users who registered later than " + daysAmount + " days is zero. Rolling Retention " + daysAmount + " day is NaN." : "Rolling Retention " + daysAmount + " day is equal " + rolling.toFixed(2) + " %";

        return (
            <div key={key + 'rolling'}>{message}</div>
        );
        
    }

    static renderTable(users, removeCallback, key = 0) {
        
        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
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
                        < tr key={key + index} id={'user' + index} >
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
                                <CustomerButton text="Remove" id={"remove" + index} onClick={removeCallback} />
                            </td>
                        </tr >
                    )}

                </tbody>
            </table>
        );

    }
}