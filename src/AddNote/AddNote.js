import React from 'react';
import config from '../config';
import ApiContext from '../ApiContext';
import ValidationError from '../ValidationError/ValidationError';

const Required = () => (
    <span className='AddBookmark__required'>*</span>
)


export default class AddNote extends React.Component {
    static contextType = ApiContext;

    static defaultProps = {
        history: {
            push: () => {}
        },
    }
    state = {
        error: null,
        name: {
            touched: false,
            value: '',
        }
    }

    updateName (name) {
        this.setState({ name: { value: name, touched: true } });
    }

    //need a handleSubmit function
    handleSubmit(e) {
        e.preventDefault()
        //get the form fields from the event
        
        const newNote = { 
            name: e.target['noteName'].value,
            modified: new Date(),
            folderId: e.target['noteFolderId'].value,
            content: e.target['noteContent'].value,

        }

        console.log(newNote)

        this.setState({ error: null})
        fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            body: JSON.stringify(newNote),
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
            this.context.addNote(data);
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
    
    validateNoteName() {
        const name = this.state.name.value.trim();

        if (name.length === 0 ) {
            return "Name is required";
        } else if (name.length < 3) {
            return "Name must be at least 3 characters long";
        }
    }


    render () {
        const { error } = this.state
        const { folders } = this.context
        const nameError = this.validateNoteName();

        return (
            <section className="AddNote">
                <h2>Create a new note.</h2>
                <form
                    className="AddNote_form"
                    onSubmit={e => (this.handleSubmit(e))}
                >
                    <div className='AddNote__error' role='alert'>
                        {error && <p>{error.message}</p>}
                     </div>
                     <div>
                         <label htmlFor="noteName">
                             Name:
                             
                         </label>
                        <input
                            type="text"
                            name="noteName"
                            id="noteName"
                            placeholder="New Note"
                            onChange={e => this.updateName(e.target.value)}
                            required
                        />
                        <Required />
                        {this.state.name.touched && <ValidationError message={nameError} />}
                     </div>
                     <div>
                         <label htmlFor="noteContent">
                             Name:
                             
                         </label>
                        <input
                            type="text"
                            name="noteContent"
                            id="noteContent"
                            placeholder="Type content here..."
                            ref={this.nameInput}
                            required
                        />
                        <Required />
                     </div>
                     <div>
                         <label htmlFor="folderSelection">
                             Select a folder:
                         </label>
                         <select 
                            id="noteFolderSelect"
                            name="noteFolderId"
                        >
                            <option value={null}>...</option>
                            {folders.map(folder =>
                                <option 
                                    key={folder.id}
                                    value={folder.id}>
                                    {folder.name}
                                </option>        
                            )}
                        </select>
                     </div>
                     <div className='AddNote_buttons'>
                        <button type='button' onClick={this.handleClickCancel}>
                            Cancel
                        </button>
                        {' '}
                        <button 
                            type='submit'
                            disabled = {this.validateNoteName()}
                            >
                         Save
                        </button>
                    </div>
                </form>
            </section>
        )
    }
}