import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
    const blog = {
        title: 'Blogs: What are they good for?',
        author: 'Jim Riggins',
        url: 'https://www.blogsrus.com/jimriggins/blogs-what-are-they-good-for',
        likes: 1011,
        id: '61cbe63c9bde1376f6d09117'
    }

    const updateBlog = jest.fn()

    let component
    beforeEach(() => {
        component = render(
            <Blog blog={blog} updateBlog={updateBlog} />
        )
    })

    test('renders author and title, but not url and likes', () => {
        // check for title and author to be shown
        expect(component.container).toHaveTextContent(blog.title)
        expect(component.container).toHaveTextContent(blog.author)

        // check for url and likes to be hidden
        const additionalContent = component.container.querySelector('.additional-content')
        expect(additionalContent).toHaveTextContent(blog.url)
        expect(additionalContent).toHaveTextContent(blog.likes)
        expect(additionalContent).not.toBeVisible()
    })

    test('renders url and likes after button is clicked', () => {
        // check for url and likes hidden
        const additionalContent = component.container.querySelector('.additional-content')
        expect(additionalContent).not.toBeVisible()
        expect(additionalContent).toHaveTextContent(blog.url)
        expect(additionalContent).toHaveTextContent(blog.likes)

        // triggers toggle button
        const toggleButton = component.container.querySelector('.toggle-button')
        fireEvent.click(toggleButton)

        // check for url and likes visible
        expect(additionalContent).toBeVisible()
        expect(additionalContent).toHaveTextContent(blog.url)
        expect(additionalContent).toHaveTextContent(blog.likes)
    })

    test('if like button is clicke twice, the event handler is fired twice', () => {
        // toggles open the additional content
        const toggleButton = component.container.querySelector('.toggle-button')
        fireEvent.click(toggleButton)

        // clicks like button twice
        const likeButton = component.container.querySelector('.like-button')
        fireEvent.click(likeButton)
        fireEvent.click(likeButton)

        expect(updateBlog.mock.calls).toHaveLength(2)
    })
})