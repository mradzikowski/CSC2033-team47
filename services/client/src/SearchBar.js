import {state, useState, useEffect} from 'react'

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