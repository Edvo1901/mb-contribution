import React from 'react';
import "./UserInfo.css";

class Contribution extends React.Component {
    render() {
        const {personalDonated, totalDonation} = this.props;
        return (
            <div className="user-container">
                <h1 className="personal-title">Đóng góp</h1>
                <div className="userInfo">
                    <div className="name">Cá nhân: ${Number(personalDonated).toLocaleString()}</div>
                    <div className="money">Tổng tiền: ${Number(totalDonation).toLocaleString()}</div>
                </div>
            </div>
        )
    }
}

export default Contribution;