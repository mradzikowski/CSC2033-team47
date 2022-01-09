import React from "react"
import NasaData from "./NasaData"

class ClimateData extends React.Component {
    render(){
        return (
            <div>
                
                <NasaData climate_data={this.props.climate_data} />
            </div>
        )
    }
}

export default ClimateData