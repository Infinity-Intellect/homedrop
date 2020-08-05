import { TextField } from '@material-ui/core'
const SearchBar = (props) => {
    const handleInputChange = () => {
        console.log("HELLO")
    }
    return (
        <TextField label="Product"
            variant="outlined"
            color="primary"
            onKeyUp={(event) => { props.setText(event.target.value) }}
            fullWidth />
    )
}

export default SearchBar