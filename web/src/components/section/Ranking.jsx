import React from 'react';
import './Ranking.css';

class Ranking extends React.Component {
    render() {
        const { topContributors } = this.props;
        return (
            <div className="donor-container">
                <h1>BXH Đóng Góp</h1>
                <table>
                    <thead className="stickyHeader">
                        <tr>
                            <th>Rank</th>
                            <th>Tên</th>
                            <th>Số tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topContributors.map((donor, index) => (
                            <tr key={index}>
                                <td>#{index + 1}</td>
                                <td>{donor.user}</td>
                                <td className="align-right">${donor.totalMoney.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Ranking;
