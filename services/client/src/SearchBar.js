import {state, useState, useEffect} from 'react'
import Select from 'react-select'


/*
    Function:
        - Main function for the search bar that is implemented in the landing page.

    (written by Toby Dixon)
*/

function SearchBar() {
  const [categories, setCategories] = useState()

  useEffect(() => {
    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/datasets/category`)
    .then(res => res.json())
    .then(data =>{
      let tempArray = []
      for (let c of data){
        tempArray.push({value: Object.values(c)[0], label: Object.values(c)[0]})
      }
      console.log(tempArray)
      setCategories(tempArray)
    })}, [])

  return(
    <div>
      <Select 
        isMulti
        isClearable={true}
        isSearchable={false}
        options={categories}
        className='searchBar'/>
    </div>

  )
}

const style = {
}

export default SearchBar;