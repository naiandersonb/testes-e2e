import assert from 'assert'

class RegisterForm {
  elements = {
    titleInput: () => cy.get('#title'),
    titleFeedback: () => cy.get('#titleFeedback'),
    imageUrlInput: () => cy.get('#imageUrl'),
    urlFeedback: () => cy.get('#urlFeedback'),
    submitBtn: () => cy.get('#btnSubmit'),
    cardList: () => cy.get('#card-list')
  }

  typeTitle(text) {
    if(!text) return
    this.elements.titleInput().type(text)
  }
  typeUrl(url) {
    if(!url) return
    this.elements.imageUrlInput().type(url)
  }

  submitForm() {
    this.elements.submitBtn().click()
  }
}

const registerForm = new RegisterForm()

const colors = {
  errors: 'rgb(220, 53, 69)',
  success: "rgb(134, 183, 254)",
}

describe('Image Registration', () => {
  describe('Submitting an image with invalid inputs', () => {
    after(() => {
      cy.clearAllLocalStorage()
    })

    const input = {
      title: '',
      url: ''
    }

    it('Given I am on the image registration page', () => {
      cy.visit('/')
    })

    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title)
    })
    it(`Then I enter "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url)
    })

    it(`Then I click the submit button`, () => {
      registerForm.submitForm()
    })
    it(`Then I should see "Please type a title for the image" message above the title field`, () => {
      registerForm.elements.titleFeedback().should('contain.text', 'Please type a title for the image')
    })
    it(`And I should see "Please type a valid URL" message above the imageUrl field`, () => {
      registerForm.elements.urlFeedback().should('contain.text', 'Please type a valid URL')
    })
    it(`And I should see an exclamation icon in the title and URL fields`, () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.errors)
      })
    })

  })

  describe('Submitting an image with valid inputs using enter key', () => {
    after(() => {
      cy.clearAllLocalStorage()
    })

    const input = {
      title: 'Alien BR',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
    }

    it('Given I am on the image registration page', () => {
      cy.visit('/')
    })

    it('When I enter "Alien BR" in the title field', () => {
      registerForm.typeTitle(input.title)
    })
    it('Then I should see a check icon in the title field', () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.success)
      })
    })
    it('When I enter "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg" in the URL field', () => {
      registerForm.typeUrl(input.url)
    })
    it('Then I should see a check icon in the imageUrl field', () => {
      registerForm.elements.imageUrlInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.success)
      })
    })
    it('Then I can hit enter to submit the form', () => {
      registerForm.submitForm()
    })
    it('And the list of registered images should be updated with the new item', () => {
      cy.get('#card-list .card-img').should(elements => {
        const lastElement = elements[elements.length -1]
        const url = lastElement.getAttribute('src')
        assert.strictEqual(url, input.url)
      })
    })
    it('And the new item should be stored in the localStorage', () => {
      cy.getAllLocalStorage().should(ls => {
        const currentLs = ls[window.location.origin]
        const elements = JSON.parse(Object.values(currentLs))
        const lastElement = elements[elements.length - 1]
       

        assert.strictEqual(lastElement.title, input.title)
        assert.strictEqual(lastElement.imageUrl, input.url)
      })
    })
    it('Then The inputs should be cleared', () => {
      registerForm.elements.titleInput().should('have.value', '')
      registerForm.elements.imageUrlInput().should('have.value', '')
    })
  })

  describe('Refreshing the page after submitting an image clicking in the submit button', () => {
    after(() => {
      cy.clearLocalStorage()
    })

    const input = {
      title: 'Alien BR',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
    }

    it('Given I am on the image registration page', () => {
      cy.visit('/')
    })

    it('I have submitted an image by clicking the submit button', () => {
      registerForm.typeTitle(input.title)
      registerForm.typeUrl(input.url)
      registerForm.submitForm()
      cy.wait(100)
    })

    it('I refresh the page', () => {
      cy.reload();
    })
    it('I should still see the submitted image in the list of registered images', () => {
      cy.getAllLocalStorage().should(ls => {
        const currentLs = ls[window.location.origin]
        const elements = JSON.parse(Object.values(currentLs))
        const lastElement = elements[elements.length - 1]
       

        assert.strictEqual(lastElement.title, input.title)
        assert.strictEqual(lastElement.imageUrl, input.url)
      })
    })
  })
})