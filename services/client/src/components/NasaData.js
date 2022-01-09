import React, {state, setState} from 'react'
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

class NasaData extends React.Component {

    constructor(props) {
        super(props);

        this.state={
            data:[]
        }
    }


    componentDidMount() {
        fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/climatedata/all`)
          .then((res) => res.json())
          .then((values) => {
            let tempArray = []
            for (let key in values[0]) {
                tempArray.push({title: key, data: values[0][key]});
            }
            this.setState({data: tempArray})
          })
    }

    render() {
        return(
            <div className='nasa-data-bar'>
                {this.state.data.map(dataset => {
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