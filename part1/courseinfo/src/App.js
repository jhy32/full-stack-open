import { getValue } from "@testing-library/user-event/dist/utils"

const Header = (props) => (<><h1>{props.course.name}</h1></>);
const Part = (props) => (<><p>{props.part.name} {props.part.exercises}</p></>);
const Content = (props) => (
  <div>
    {props.parts.map((val) => (<Part part={val}/>))}
  </div>
);


const Total = (props) => {
  let total = 0; 
  props.course.parts.forEach(part => {
    total += part.exercises;
  }) 
  return (
    <>
      <p>
      Number of exercises {total}
      </p>
    </>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
    ]
  }
  return (
    <div>
      <Header course={course}/> 
      <Content parts = {course.parts} />
      <Total course = {course} />
    </div>
  )
}

export default App