import React from 'react';
import "./Close.css";

class Close extends React.Component {
    render() {
        return (
            <button className="exit-button" onClick={() => this.props.closeForm()}>
                Quay về
            </button>
        );
    }
}

export default Close;