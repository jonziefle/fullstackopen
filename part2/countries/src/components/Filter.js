import React from 'react'

const Filter = ({filter, handleFilterChange}) => {
  return (
    <div>
      filter countries <input value={filter} onChange={handleFilterChange}/>
    </div>
  )
}

export default Filter