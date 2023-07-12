import React from 'react';
import "./Body.css";
import UserInfo from '../section/UserInfo';
import Contribution from '../section/Contribution';
import DonateAction from '../section/DonateAction';
import Ranking from '../section/Ranking';
import Close from '../section/Close';
import axios from 'axios';

class Body extends React.Component {
    state = {
        show: false,
        playerName: 'Unknown',
        money: 0,
        personalDonated: 0,
        totalDonation: 0,
        topContributors: [],
    }

    getAction() {
        window.addEventListener('message', (event) => {
            const data = event.data;
            if (data.action === 'open') {
                this.setState({
                    show: true,
                    playerName: data.name,
                    money: data.money,
                    personalDonated: data.personalDonated,
                    totalDonation: data.totalDonation,
                    topContributors: data.contributors,
                })
            } else if (data.action === 'close') {
                this.setState({
                    show: false
                })
            } else if (data.action === 'updateMoney') {
                this.setState({
                    money: data.money,
                    personalDonated: data.personalDonated,
                    totalDonation: data.totalDonation,
                    topContributors: data.contributors
                })
            }
        });
    }

    async closeForm() {
        let response = await axios.post('https://mb-contribution/close');
        this.setState({
            data: response.action
        })
    }

    componentDidMount() {
        // call api or anything
        this.getAction();
    }

    render() {
        const { show, playerName, money, personalDonated, totalDonation, topContributors } = this.state;
        return (
            <>
                {show &&
                    <div className="container">
                        <div className="header">
                            <img src="https://media.discordapp.net/attachments/1032874818141425715/1057568866995273798/1024_trans.png?width=1359&height=1359" className="logo" width="120" alt=""></img>
                            <h1 className="rank">Quỹ nghiên cứu zombie</h1>
                        </div>
                        <div className="info-container">
                            <div className="left">
                                <UserInfo playerName={playerName} money={money}/>
                                <Contribution personalDonated={personalDonated} totalDonation={totalDonation}/>
                                <DonateAction />
                            </div>
                            <div className="right">
                                <div className="rankingContainer">
                                    <Ranking topContributors={topContributors}/>
                                </div>
                            </div>
                        </div>
                        <footer className="closeContainer">
                            <Close closeForm={this.closeForm}/>
                        </footer>
                    </div>}
            </>
        )
    }
}

export default Body;