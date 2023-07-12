import React from "react";
import './DonateAction.css';
import axios from 'axios';

class DonateAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: '',
            hasDonate: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            amount: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.amount && !this.state.hasDonate) {
            this.setState({hasDonate: true});
            axios.post('https://mb-contribution/donateMoney', {
                money: this.state.amount
            })
            .then(response => {
                this.setState({ amount: '' });
            })
            .catch(error => {
                console.log(error);
            });
            setTimeout(() => this.setState({hasDonate: false}), 10000);
        }
    }

    render() {
        return (
            <div className="DonateAction">
                <h1>Hành động</h1>
                <input
                    type="number"
                    placeholder="Số tiền"
                    value={this.state.amount}
                    onChange={this.handleChange}
                />
                <button onClick={this.handleSubmit}>
                    Đóng góp
                </button>
            </div>
        )
    }
}

export default DonateAction;