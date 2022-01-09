import React, {state, setState} from 'react'
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

class NasaData extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            tempData: [
                {title: 'CLIMATE CHANGE', data: '207 Tons'},
                {title: 'TITLE2', data: 'data'},
                {title: 'TITLE3', data: 'data'},
                {title: 'TITLE4', data: 'data'},
                {title: 'TITLE5', data: 'data'},
                {title: 'TITLE6', data: 'data'},
                {title: 'TITLE7', data: 'data'},
                {title: 'TITLE8', data: 'data'},
                {title: 'TITLE9', data: 'data'},
            ]
        }
    }

    render() {
        return(
            <div className='nasa-data-bar'>
                {this.state.tempData.map(dataset => {
                    return(
                        <div key='1' className='nasa-data-container'>
                            <div key='2' className='nasa-data-title'>
                                {dataset.title}
                            </div>
                            <div key='3' className='nasa-data-value'> 
                                {dataset.data}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default NasaData;