import React, {state, setState} from 'react'
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

class NasaData extends React.Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        console.log(this.props)
    }

    render() {
        return(
            <div className='nasa-data-bar'>
                {this.props.climate_data.map(dataset => {
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