import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
    test('submits form and checks value recieved by createBlog handler', () => {
        const testBlog = {
            title: 'The Best Blog Ever!',
            author: 'John Doe',
            url: 'https://www.google.com'
        }
        const createBlog = jest.fn()

        const component = render(
            <BlogForm createBlog={createBlog} />
        )

        const blogForm = component.container.querySelector('.blog-form')
        const titleInput = component.container.querySelector('.title-input')
        const authorInput = component.container.querySelector('.author-input')
        const urlInput = component.container.querySelector('.url-input')

        fireEvent.change(titleInput, {
            target: { value: testBlog.title }
        })
        fireEvent.change(authorInput, {
            target: { value: testBlog.author }
        })
        fireEvent.change(urlInput, {
            target: { value: testBlog.url }
        })
        fireEvent.submit(blogForm)

        expect(createBlog.mock.calls).toHaveLength(1)
        expect(createBlog.mock.calls[0][0].title).toBe(testBlog.title)
        expect(createBlog.mock.calls[0][0].author).toBe(testBlog.author)
        expect(createBlog.mock.calls[0][0].url).toBe(testBlog.url)
    })
})