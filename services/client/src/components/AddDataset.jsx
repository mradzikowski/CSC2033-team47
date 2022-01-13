import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import Select from "react-select";

class AddDataset extends React.Component {

  constructor(props) {
    super(props)

    this.state={
      categories:[],
      query: ''
    }
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/datasets/category`)
    .then((res) => res.json())
    .then((data) => {
      let tempArray = [];
      for (let c of data) {
        tempArray.push({
          value: Object.values(c)[0],
          label: Object.values(c)[0],
        });
      }
      console.log(tempArray);
      this.setState({categories: tempArray});
    })
    .then(() => {console.log(this.state)});
  }

  handleChange = (e) => {
    this.setState({query: e})
  }

  getStyles = () => {
    return {
      option: (provided, state) => ({
        ...provided,
        padding: 20,
        fontSize: '15px',
        backgroundColor: state.isSelected ? 'grey' : 'white'
      }),
      control: () => ({
        // none of react-select's styles are passed to <Control />
        textAlign: "left",
        fontSize: '15px',
        border: 'solid',
        borderRadius: '10px',
        borderWidth: "1px",
        width: '100%',
        display: 'flex',
        marginBottom: 20,
        marginTop: 20
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
    
        return { ...provided, opacity, transition };
      }
    }
  }

  render() {
    if (!this.props.isAuthenticated()) {
      return <Redirect to="/login" />;
    }
      
    return (
        <Paper elevation={10} className='upload-container'>
          <form style={{padding: '20px'}}>
            <div className="upload-title">
              Upload Your Dataset
            </div>
            <div className="upload-field">
              <TextField
                type="file"
                name="file_name"
                className="form-control"
                onChange={this.props.handleChange}
                style={{width: '100%'}}
              />
            </div>
            <div>
              <div className="upload-field">
                <TextField
                  id="outlined-basic"
                  name="title"
                  onChange={this.props.handleChange}
                  variant="standard"
                  label="Title"
                  style={{width: '100%'}}
                />
              </div>
              <Select
                name="category"
                isClearable
                isSearchable={false}
                options={this.state.categories}
                onChange={this.props.handleSelectChange}
                placeholder='Category'
                styles={this.getStyles()}
              />
              <Button
                type="submit"
                className="btn btn-success btn-block"
                onClick={this.props.handleClick}
                variant="contained"
              >
                Upload
              </Button>
            </div>
          </form>
        </Paper>
    );
  }
}

AddDataset.propTypes = {
  handleSelectChange: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
};

export default AddDataset;
