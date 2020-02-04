import React from 'react';
import config from '../config';
import ApiContext from '../ApiContext';

const Required = () => (
    <span className='AddBookmark__required'>*</span>
)


export default class AddFolder extends React.Component {
    static contextType = ApiContext;

    constructor(props) {
        super(props);
        this.nameInput = React.createRef();
    }
    state = {
        error: null,
    }


    //need a handleSubmit function
    handleSubmit(e) {
        e.preventDefault()
        //get the form fields from the event

        let fName = this.nameInput.current.value

        console.log({fName})
        
        const folderName = { 
            name: e.target['folderName'].value,
        }

        console.log(folderName)

        this.setState({ error: null})
        fetch(`${config.API_ENDPOINT}/folders`, {
            method: 'POST',
            body: JSON.stringify(folderName),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then( res => {
            if (!res.ok) {
                // get the error message from the response,
                return res.json().then(error => {
                  // then throw it
                  throw error
                })
            }
            return res.json()
        })
        .then(data => {
            fName = '';
            console.log(data)
            //not sure what/or why this does
            this.context.addFolder(data);
            this.props.history.push('/');
        })
        .catch(error => {
            this.setState({ error })
          })
        
    }  

    //need a handleClickCancel function
    handleClickCancel = () => {
        this.props.history.push('/')
      };
    

    render () {
        const { error } = this.state

        return (
            <section className="AddFolder">
                <h2>Create a new folder.</h2>
                <form
                    className="AddFolder_form"
                    onSubmit={e => (this.handleSubmit(e))}
                >
                    <div className='AddFolder__error' role='alert'>
                        {error && <p>{error.message}</p>}
                     </div>
                     <div>
                         <label htmlFor="folderName">
                             Name:
                             
                         </label>
                        <input
                            type="text"
                            name="folderName"
                            id="folderName"
                            placeholder="New Folder"
                            ref={this.nameInput}
                            required
                        />
                        <Required />
                     </div>
                     <div className='AddFolder_buttons'>
                        <button type='button' onClick={this.handleClickCancel}>
                            Cancel
                        </button>
                        {' '}
                        <button type='submit'>
                         Save
                        </button>
                    </div>
                </form>
            </section>
        )
    }
}