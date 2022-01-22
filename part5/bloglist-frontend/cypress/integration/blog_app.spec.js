describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user1 = {
            name: 'John Doe',
            username: 'johndoe',
            password: 'password'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user1)

        const user2 = {
            name: 'Jane Doe',
            username: 'janedoe',
            password: 'password'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user2)
        cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function () {
        cy.visit('http://localhost:3000')

        cy.contains('Blog List App')
    })

    it('Login form is shown', function () {
        cy.contains('log in').click()

        cy.contains('username')
        cy.contains('password')
    })

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.contains('log in').click()
            cy.get('.username-input').type('johndoe')
            cy.get('.password-input').type('password')
            cy.get('.login-button').click()

            cy.get('.message')
                .should('contain', 'is logged in')
                .and('have.css', 'color', 'rgb(0, 128, 0)')
            cy.contains('John Doe is logged in')
        })

        it('fails with wrong credentials', function () {
            cy.contains('log in').click()
            cy.get('.username-input').type('johndoe')
            cy.get('.password-input').type('wrong password')
            cy.get('.login-button').click()

            cy.get('.error')
                .should('contain', 'Unable to login')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
            cy.get('html').should('not.contain', 'John Doe is logged in')
        })
    })

    describe('When logged in', function () {
        beforeEach(function () {
            cy.login({ username: 'johndoe', password: 'password' })
        })

        it('A blog can be created', function () {
            cy.contains('create new blog').click()
            cy.get('.title-input').type('a blog created by cypress')
            cy.get('.author-input').type('John Doe')
            cy.get('.url-input').type('https://www.google.com')
            cy.get('.save-button').click()

            cy.get('.blog-list').should('contain', 'a blog created by cypress')
        })

        describe('after adding blogs', function () {
            beforeEach(function () {
                cy.createBlog({
                    title: 'This is the first blog',
                    author: 'John Doe',
                    url: 'https://www.google.com',
                    likes: 10
                })
            })

            it('A blog can be liked', function () {
                cy.contains('This is the first blog').as('firstBlog')
                cy.get('@firstBlog').find('.toggle-button').click()
                cy.get('@firstBlog').find('.like-button').click()

                cy.get('.message')
                    .should('contain', 'Added like')
                    .and('have.css', 'color', 'rgb(0, 128, 0)')
                cy.get('@firstBlog').contains('likes: 11')
            })

            it('A blog can be deleted by the user who created it', function () {
                cy.contains('This is the first blog').as('firstBlog')
                cy.get('@firstBlog').find('.toggle-button').click()
                cy.get('@firstBlog').find('.remove-button').click()

                cy.get('.message')
                    .should('contain', 'Deleted')
                    .and('have.css', 'color', 'rgb(0, 128, 0)')
                cy.get('@firstBlog').should('not.exist')
            })

            it('A blog cannot be deleted by another user', function () {
                cy.login({ username: 'janedoe', password: 'password' })
                cy.contains('This is the first blog').as('firstBlog')
                cy.get('@firstBlog').find('.toggle-button').click()

                cy.get('@firstBlog').find('.remove-button').should('not.exist')
            })

            it('Blogs are ordered by likes, largest to smallest', function () {
                cy.createBlog({
                    title: 'This is the second blog',
                    author: 'John Doe',
                    url: 'https://www.google.com',
                    likes: 20
                })

                cy.createBlog({
                    title: 'This is the third blog',
                    author: 'John Doe',
                    url: 'https://www.google.com',
                    likes: 30
                })

                cy.get('.blog').then(blogs => {
                    cy.wrap(blogs[0]).contains('likes: 30')
                    cy.wrap(blogs[1]).contains('likes: 20')
                    cy.wrap(blogs[2]).contains('likes: 10')
                })
            })
        })
    })
})