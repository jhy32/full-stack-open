import {setFilter} from '../reducers/filterReducer'
import {connect} from 'react-redux'

const Filter = (props) => {

    const handleChange = (event) => {
      event.preventDefault()
      const filter = event.target.value
      props.setFilter(filter)
    }

    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        filter <input onChange={handleChange} />
      </div>
    )
}

const matchDispatchToProps = {
    setFilter
}

const ConnectedFilter = connect(null, matchDispatchToProps)(Filter)
export default ConnectedFilter