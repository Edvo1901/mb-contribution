import React from 'react';
import "./UserInfo.css";

class UserInfo extends React.Component {
    render() {
        const {playerName, money} = this.props;
        return(
            <div className="user-container">
                <h1 className="personal-title">Thông tin</h1>
                <div className="userInfo">
                    <div className="name">Tên: {playerName}</div>
                    <div className="money">Bank: ${Number(money).toLocaleString()}</div>
                </div>
            </div>
        )
    }
}

export default UserInfo;