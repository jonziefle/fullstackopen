# [Part 6: State management with Redux](https://fullstackopen.com/en/part6)
So far, we have placed the application's state and state logic directly inside React components. When applications grow larger, state management should be moved outside React components. In this part, we will introduce the Redux library, which is currently the most popular solution for managing the state of React applications.

## Sections:
* [Flux-architecture and Redux](https://fullstackopen.com/en/part6/flux_architecture_and_redux)
* [Many reducers](https://fullstackopen.com/en/part6/many_reducers)
* [Communicating with server in a redux application](https://fullstackopen.com/en/part6/communicating_with_server_in_a_redux_application)
* [connect](https://fullstackopen.com/en/part6/connect)

## Exercises:
### **6.1-6.2: Unicafe Revisited**
Let's make a simplified version of the unicafe-exercise from part 1. Let's handle the state management with Redux.
* https://fullstackopen.com/en/part6/flux_architecture_and_redux#exercises-6-1-6-2

### **6.3-6.21: Anecdotes Redux**
Let's make a new version of the anecdote voting application from part 1. 
* https://fullstackopen.com/en/part6/flux_architecture_and_redux#exercises-6-3-6-8

Let's continue working on the anecdote application using Redux Toolkit.
* https://fullstackopen.com/en/part6/many_reducers#exercises-6-9-6-12

Connect the anecdotes app to a simple backend server.
* https://fullstackopen.com/en/part6/communicating_with_server_in_a_redux_application#exercises-6-13-6-14

Modify the application using asynchronous action creators, which are made possible by the Redux Thunk library.
* https://fullstackopen.com/en/part6/communicating_with_server_in_a_redux_application#exercises-6-15-6-18

Use the connect function instead of hooks to connect to the redux store.
* https://fullstackopen.com/en/part6/connect#exercises-6-19-6-21