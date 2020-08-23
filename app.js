const app = new Vue({
    el: "#app",
    data: {
        loggedin : false,
        JWT: "",
        loginUN: "",
        loginPW: "",
        createUN: "",
        createPW: "",
        devURL: "http://localhost:3000",
        prodURL: "https://notesapplication-practice.herokuapp.com",
        user: null,
        token: null,
        notes: [],
        newNote: "",
        updateNote: "",
        editID: 0
    },
    methods: {
        //////////// LOGIN /////////////
        handleLogin: function(event){
            event.preventDefault()
            const URL = this.prodURL ? this.prodURL : this.devURL
            // console.log(URL)
            const user = {
                username: this.loginUN,
                password:this.loginPW
            }
            fetch(`${URL}/login`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error){
                        alert('Error logging in')
                    } else {
                        this.user = data.user
                        this.token = data.token
                        this.loggedin = true
                        this.getNotes()
                        this.loginPW = ""
                        this.loginUN = ""
                        window.sessionStorage.setItem('login', JSON.stringify(data))
                        //storing the data response in session storage
                        //setItem means you're gonna put something in session storage
                        //login is the key, the string version of the data containing the user and the token
                    }
                })
        },

        //////////// LOG OUT /////////////
        handleLogout: function() {
            this.user = null
            this.token = null
            this.loggedin = false
            this.notes = ''
            window.sessionStorage.removeItem('login')
        },

        //////////// CREATE USER /////////////
        handleSignup: function(){
            const URL = this.prodURL ? this.prodURL : this.devURL
            const user = {
                username: this.createUN,
                password:this.createPW
            }
            fetch(`${URL}/users`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
                .then(response => response.json())
                .then((data) => {
                    if (data.error){
                        alert('Sign up unsuccessful')
                    } else {
                        alert('Sign up successful')
                        this.createPW = ""
                        this.createUN = ""
                    }
                })
        },

        //////////// GET - SHOW NOTES /////////////
        getNotes: function(){
            const URL = this.prodURL ? this.prodURL : this.devURL
            fetch(`${URL}/notes`, {
                method: "get",
                headers:{
                    Authorization: `bearer ${this.token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    this.notes = data
                })
        },

        //////////// CREATE - CREATE NOTES /////////////
        createNote: function() {
            const URL = this.prodURL ? this.prodURL : this.devURL
            const note = {
                message: this.newNote
            }
            fetch(`${URL}/notes`,{
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `bearer ${this.token}`
                },
                body: JSON.stringify(note)
            }).then(response => {
                this.newNote=""
                this.getNotes()
            })
        },

        //////////// DELETE - DELETE A NOTE /////////////
        deleteNote: function(event) {
            const URL = this.prodURL ? this.prodURL : this.devURL
            const id = event.target.id

            fetch(`${URL}/notes/${id}`, {
                method: "delete",
                headers: {
                    Authorization: `bearer ${this.token}`
                },
            })
                .then(response => {
                    this.getNotes()
                })
        },

        //////////// UPDATE - Update a note /////////////
        editNote: function(event){
            const URL = this.prodURL ? this.prodURL : this.devURL
            const id = event.target.id
            const updated = {
                message: this.updateNote
            }
            fetch(`${URL}/notes/${id}`, {
                method: "put",
                headers: {
                    Authorization: `bearer ${this.token}`,
                    "Content-type": "application/json"
                },
                body:JSON.stringify(updated)
            })
                .then(response => {
                    this.getNotes()
                })
        },

        editSelect: function(event){
            this.editID = event.target.id
            console.log(this.editID, event.target.id)
            //taking the id of the update form and making sure it matches the id of the individual update button which should be the id of the individual note

            const theNote = this.notes.find((note) => {
                return note.id == this.editID
            })
            //Sets the form field equal to the note in the array that has an id that matches the id
            //Grabbing the note from our list of notes using the id

            this.updateNote = theNote.message
            //the forms should reflect the message of that note
        },
    },

    //LIFESTYLE OBJECT - checks to see if there is already login information from previous sessions
    created: function(){
        const getLogin = JSON.parse(window.sessionStorage.getItem('login'))
        // console.log(getLogin)

        if(getLogin){
            this.user = getLogin.user
            this.token = getLogin.token
            this.loggedin = true
            this.getNotes()
        }
    }
})