import React, {state, setState} from "react"
import NasaData from "./NasaData"
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import WaterIcon from '@mui/icons-material/Water';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BoltIcon from '@mui/icons-material/Bolt';

class ClimateData extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            retrieved: false,
        }
    }

    componentDidMount() {
        fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/climatedata/all`)
          .then((res) => res.json())
          .then((values) => {
            let dataArray = []

            for (let i = 0; i < values.length; i++){
                let dataset = values[i.toString()]
                let setArray = []
                for (let key in dataset) {
                    if (key != 'id') setArray.push({title: key, data: dataset[key]});
                }
                dataArray.push(setArray)
            }
            
            this.setState({data: dataArray})
            this.setState({retrieved: true})
          })

    }

    render(){
        if (this.state.retrieved){
            return (
                <div>
                    <CounterData data={this.state.data[0]} />
                    <NasaData climate_data={this.state.data[1]} />
                </div>
            )
        } else {
            return (
                <div>
                    Loading...
                </div>
            )
        }
    }
}

class CounterData extends React.Component {

    constructor(props){
        super(props)
    }

    render(){
        return(
            <Box className="climatedata-list">
                <Box className='climatedata-container' key=''>
                    <Paper key='' className='climatedata'>
                        <WbSunnyIcon style={{position: 'relative', top: '10'}} className='climatedata-item' />
                        <div className='climatedata-item'>
                            <div key=''>
                                <strong>{this.props.data['0'].data}</strong>
                            </div>
                            <div key=''>
                                World Average Temperature (°C)
                            </div>
                        </div>
                    </Paper>
                </Box>
                <Box className='climatedata-container' key=''>
                    <Paper key='' className='climatedata'>
                        <ArrowUpwardIcon style={{position: 'relative', top: '10'}} className='climatedata-item' />
                        <div className='climatedata-item'>
                            <div key=''>
                                <strong>{parseInt(this.props.data['1'].data).toLocaleString('en-US')}</strong>
                            </div>
                            <div key=''>
                                Tons of CO2 released into the atmosphere
                            </div>
                        </div>
                    </Paper>
                </Box>
                <Box className='climatedata-container' key=''>
                    <Paper key='' className='climatedata'>
                        <WaterIcon style={{position: 'relative', top: '10'}} className='climatedata-item' />
                        <div className='climatedata-item'>
                            <div key=''>
                                <strong>{parseInt(this.props.data['2'].data).toLocaleString('en-US')}</strong>
                            </div>
                            <div key=''>
                                Tons of melted ice
                            </div>
                        </div>
                    </Paper>
                </Box>
                <Box className='climatedata-container' key=''>
                    <Paper key='' className='climatedata'>
                        <WaterIcon style={{position: 'relative', top: '10'}} className='climatedata-item' />
                        <div className='climatedata-item'>
                            <div key=''>
                                <strong>{this.props.data['3'].data}</strong>
                            </div>
                            <div key=''>
                                Rise in sea levels (cm)
                            </div>
                        </div>
                    </Paper>
                </Box>
                <Box className='climatedata-container' key=''>
                    <Paper key='' className='climatedata'>
                        <AttachMoneyIcon style={{position: 'relative', top: '10'}} className='climatedata-item' />
                        <div className='climatedata-item'>
                            <div key=''>
                                <strong>{parseInt(this.props.data['4'].data).toLocaleString('en-US')}</strong>
                            </div>
                            <div key=''>
                                Cost of not acting on climate change (US $)
                            </div>
                        </div>
                    </Paper>
                </Box>
                <Box className='climatedata-container' key=''>
                    <Paper key='' className='climatedata'>
                        <BoltIcon style={{position: 'relative', top: '10'}} className='climatedata-item' />
                        <div className='climatedata-item'>
                            <div key=''>
                                <strong>{parseInt(this.props.data['5'].data).toLocaleString('en-US')}</strong>
                            </div>
                            <div key=''>
                                Terajoules of energy used
                            </div>
                        </div>
                    </Paper>
                </Box>
                <Box className='climatedata-container' key=''>
                    <Paper key='' className='climatedata'>
                        <WbSunnyIcon style={{position: 'relative', top: '10'}} className='climatedata-item' />
                        <div className='climatedata-item'>
                            <div key=''>
                                <strong>{parseInt(this.props.data['6'].data).toLocaleString('en-US')}</strong>
                            </div>
                            <div key=''>
                                Terajoules of solar energy striking earth
                            </div>
                        </div>
                    </Paper>
                </Box>
                <Box className='climatedata-container' key=''>
                    <Paper key='' className='climatedata'>
                        <BoltIcon style={{position: 'relative', top: '10'}} className='climatedata-item' />
                        <div className='climatedata-item'>
                            <div key=''>
                                <strong>{parseInt(this.props.data['7'].data).toLocaleString('en-US')}</strong>
                            </div>
                            <div key=''>
                                Terajoules of electricity used
                            </div>
                        </div>
                    </Paper>
                </Box>
                <Box className='climatedata-container' key=''>
                    <Paper key='' className='climatedata'>
                        <BoltIcon style={{position: 'relative', top: '10'}} className='climatedata-item' />
                        <div className='climatedata-item'>
                            <div key=''>
                                <strong>{this.props.data['8'].data}</strong>
                            </div>
                            <div key=''>
                                % of electricty produced from renewable sources
                            </div>
                        </div>
                    </Paper>
                </Box>
                <Box className='climatedata-container' key=''>
                    <Paper key='' className='climatedata'>
                        <BoltIcon style={{position: 'relative', top: '10'}} className='climatedata-item' />
                        <div className='climatedata-item'>
                            <div key=''>
                                <strong>{this.props.data['8'].data}</strong>
                            </div>
                            <div key=''>
                                Time left till the we run out oil
                            </div>
                        </div>
                    </Paper>
                </Box>
            </Box>
        )
    }
}

export default ClimateData