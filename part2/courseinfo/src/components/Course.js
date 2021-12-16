import React from 'react'

const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

const Header = ({name}) => {
  return (
    <>
      <h1>{name}</h1>
    </>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part} /> )}
    </div>
  )
}

const Part = ({part}) => {
  return (
    <>
      <p>{part.name} {part.exercises}</p>
    </>
  )
}

const Total = ({parts}) => {
  const total = parts.reduce((total, part) => total + part.exercises, 0)
  return (
    <div>
      <p><b>Total Exercises: {total}</b></p>
    </div>
  )
}

export default Course