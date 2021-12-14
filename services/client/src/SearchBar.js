import {state, useState, useEffect} from 'react'


/*
    Function:
        - Main function for the search bar that is implemented in the landing page.

    (written by Toby Dixon)
*/

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleInput = (e) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  return(
    <div>
      <div>
        <input
          className='searchBar'
          type='text'
          placeholder='Search'
          onChange={handleInput} />
      </div>
      <div>
        Search Query = {searchQuery}
      </div>
    </div>

  )
}

const style = {
}

export default SearchBar;