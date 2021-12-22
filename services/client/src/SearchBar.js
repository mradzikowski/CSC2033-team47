import {state, useState, useEffect} from 'react'
import Select from 'react-select'


/*
    Function:
        - Main function for the search bar that is implemented in the landing page.

    (written by Toby Dixon)
*/

function SearchBar() {
  const categories = [
    { value: 'climate', label: 'Climate' },
    { value: 'carbon', label: 'Carbon Emissions' },
    { value: 'water', label: 'Water' },
  ]

  return(
    <div>
      <Select 
        isMulti
        isSearchable={false}
        options={categories} className='searchBar'/>
    </div>

  )
}

const style = {
}

export default SearchBar;