describe('Note app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'John Doe',
            username: 'username',
            password: 'password'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('then example', function () {
        cy.get('button').then(buttons => {
            console.log('number of buttons', buttons.length)
            cy.wrap(buttons[0]).click()
        })
    })

    it('front page can be opened', function () {
        cy.contains('Notes')
        cy.contains('Note app, Department of Computer Science, University of Helsinki 2021')
    })

    it('login form can be opened', function () {
        cy.contains('log in').click()
    })

    it('user can login', function () {
        cy.contains('log in').click()
        cy.get('.username-input').type('username')
        cy.get('.password-input').type('password')
        cy.get('.login-button').click()

        cy.contains('John Doe is logged in')
    })

    it('login fails with wrong password', function () {
        cy.contains('log in').click()
        cy.get('.username-input').type('username')
        cy.get('.password-input').type('wrong password')
        cy.get('.login-button').click()

        cy.get('.error')
            .should('contain', 'Wrong credentials')
            .and('have.css', 'color', 'rgb(255, 0, 0)')
            .and('have.css', 'border-style', 'solid')

        cy.get('html').should('not.contain', 'John Doe is logged in')
    })

    describe('when logged in', function () {
        beforeEach(function () {
            cy.login({ username: 'username', password: 'password' })
        })

        it('a new note can be created', function () {
            cy.contains('new note button').click()
            cy.get('.note-input').type('a note created by cypress')
            cy.get('.save-button').click()
            cy.contains('a note created by cypress')
        })

        describe('and several notes exist', function () {
            beforeEach(function () {
                cy.createNote({ content: 'first note', important: false })
                cy.createNote({ content: 'second note', important: false })
                cy.createNote({ content: 'third note', important: false })
            })

            it('one of those can be made important', function () {
                cy.contains('second note').parent().find('button').as('theButton')
                cy.get('@theButton').click()
                cy.get('@theButton').should('contain', 'make not important')
            })
        })
    })
})