describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

    cy.visit('')
  })

  it('front page can be opened', function () {
    cy.contains('Log in to an application')
  })
  it('login form can be opened', function () {
    cy.contains('log in').click()
  })
  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })
    it('fails with wrong credentials', function () {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
      cy.contains('Matti Luukkainen logged in').should('not.exist') //the same as above
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('a new blog can be created', function () {
      cy.contains('new blog').click()

      /* cy.wait(500)
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('Cypress')
      cy.get('#url').type('https://www.cypress.io/')
      cy.get('#create').click()
      cy.contains('a blog created by cypress') */

      cy.createBlog({
        title: 'a blog created by cypress',
        author: 'Cypress',
        url: 'https://www.cypress.io/',
      })
      cy.contains('a blog created by cypress')
    })
    it('can like', function () {
      cy.createBlog({
        title: 'another blog created by cypress',
        author: 'Cypress',
        url: 'https://www.cypress.io/',
      })
      cy.contains('another blog created by cypress')
      cy.contains('view').click()
      cy.contains('Likes: 0')
      cy.contains('like').click()
      cy.contains('Likes: 1')
    })
    it('can delete', function () {
      cy.createBlog({
        title: 'another blog created by cypress',
        author: 'Cypress',
        url: 'https://www.cypress.io/',
      })
      cy.contains('another blog created by cypress')
      cy.contains('view').click()

      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'another blog created by cypress')
    })
  })
  describe('blogs are ordered according to likes descending', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })
    it('they are ordered by number of likes', function () {
      const blog1 = {
        title: 'Miikas News',
        author: 'Miika Nissi',
        url: 'https://miikanissi.com',
        likes: 4,
      }
      const blog2 = {
        title: 'Miikas Cooking',
        author: 'Miika Nissi',
        url: 'https://miikanissi.com',
        likes: 12,
      }
      cy.createBlog(blog1)
      cy.createBlog(blog2)
      cy.contains('Miikas News')
      cy.contains('Miikas Cooking')

      cy.contains('sort⬇').click()

      cy.get('.blogStyle').eq(0).should('contain', 'Miikas Cooking')
      cy.get('.blogStyle').eq(1).should('contain', 'Miikas News')
    })
  })
})
