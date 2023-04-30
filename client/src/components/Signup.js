/**
 * Components: Signup
 * A React component that allows users to sign up for the website. It provides an email input, a password input and two buttons, one for submitting and one for canceling the sign-up process.
 * Props:
 * setView : function - A function that takes in a string as an argument and changes the view of the app to that view.
 * Functions:
 * handleChange : function - A function that takes in two arguments, type and event, and sets the values state according to the input.
 * handleClickShowPassword : function - A function that toggles the visibility of the password in the password input.
 * handleMouseDownPassword : function - A function that prevents the default action when the password input is clicked.
 * handleSignup : function - A function that sends a POST request to the server to sign up the user. It sets the error state and error message state accordingly.
 * States:
 * values : object - An object that contains two properties, email and password, that store the input values for email and password.
 * showPassword : boolean - A boolean value that indicates whether the password input is visible or not.
 * error : boolean - A boolean value that indicates whether there is an error during the sign-up process.
 * errorMessage : string - A string that stores the error message when there is an error during the sign-up process.
*/
import * as React from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

const axios = require('axios').default

function Signup({ setView, ...props }) {
    // set initial state for values variable using useState hook
    const [values, setValues] = React.useState({
        email: '', // set email property to an empty string
        password: '' // set password property to an empty string
    })
    // set initial state for showPassword variable using useState hook and set it to false
    const [showPassword, setShowPassword] = React.useState(false)
    // set initial state for error variable using useState hook and set it to false
    const [error, setError] = React.useState(false)
    // set initial state for errorMessage variable using useState hook and set it to an empty string
    const [errorMessage, setErrorMessage] = React.useState('')

    // define handleChange function to update values variable based on input type and value
    const handleChange = (type, event) => {
        if (type === 'password') {
            // update password property of values variable with event.target.value
            setValues({ ...values, password: event.target.value })
        } else if (type === 'email') {
            // update email property of values variable with event.target.value
            setValues({ ...values, email: event.target.value })
        }
    }

    // define handleClickShowPassword function to toggle the visibility of the password
    const handleClickShowPassword = () => {
        // set showPassword variable to the opposite of its current state
        setShowPassword(!showPassword)
    }

    // define handleMouseDownPassword function to prevent default mouse down event
    const handleMouseDownPassword = (event) => {
        // prevent default mouse down event
        event.preventDefault()
    }

    // define handleSignup function to handle signup process using axios module
    const handleSignup = () => {
        axios({
            method: 'post', // set method to post
            url: '/api/auth/signup/', // set url to endpoint for signup
            data: values // set data to values variable
        }).then((response) => {
            // set error to false
            setError(false)
            // change the view to login
            setView('login')
        }).catch((err) => {
            // set error to true
            setError(true)
            if (!isEmail(values.email))
                // set error message if email input is not valid
                setErrorMessage("The email you input is not a valid email address.")
            else if (!isLength(values.password, { min: 8, max: 20 }))
                // set error message if password length is not within range
                setErrorMessage("The length of the password must be between 8 to 20.")
            else
                // set error message if email has already been registered
                setErrorMessage("The email address has already been registered!")
        })
    }

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card style={{ height: '40%', width: '30%', padding: '1%' }}>
                <CardContent>
                    <h3>Sign Up</h3>
                    {/* create form control component for email input */}
                    <FormControl sx={{ m: 1, width: '100%' }} variant='standard'>
                        <InputLabel htmlFor='standard-adornment-password'>Email</InputLabel>
                        <Input
                            value={values.email}
                            onChange={(e) => { handleChange('email', e) }} // call handleChange function with type 'email' and event
                        />
                    </FormControl>
                    {/* create form control component for password input */}
                    <FormControl sx={{ m: 1, width: '100%' }} variant='standard'>
                        <InputLabel htmlFor='standard-adornment-password'>Password</InputLabel>
                        <Input
                            id='standard-adornment-password'
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={(e) => { handleChange('password', e) }} // call handleChange function with type 'password' and event
                            endAdornment={
                                // add end adornment with an icon button to toggle password visibility
                                <InputAdornment position='end'>
                                    <IconButton
                                        aria-label='toggle password visibility'
                                        onClick={handleClickShowPassword} // call handleClickShowPassword function
                                        onMouseDown={handleMouseDownPassword} // call handleMouseDownPassword function
                                    >
                                        {/*render different icon based on the state of showPassword variable*/}
                                        {showPassword ? <VisibilityOff /> : <Visibility />} 
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    {/* show error message when error state is true */}
                    {error && <Alert severity="error">{errorMessage}</Alert>}
                    {/* create buttons for cancel and submit */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '10%' }}>
                        <Button variant='outlined' disableElevation onClick={() => { setView('login') }} style={{ marginTop: '5%' }}>
                            Cancel
                        </Button>
                        <Button variant='contained' disableElevation onClick={handleSignup} style={{ marginTop: '5%' }}>
                            Submit
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Signup