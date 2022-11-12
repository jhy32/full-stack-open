const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p>Number of exercises {sum}</p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  console.log("parts", parts);
  // const makePart = (part) => (
  //   <Part key={part.id} part = {part}/>
  // )
  return (
  <>
  {parts.map((part) => (
    <Part key={part.id} part = {part}/>
  ))}
  </>
  )
  
}




const Course = ({course}) => {
  // function addUp(parts) {
  //   return parts.reduce((tot, part) => tot + part.exercises, 0)
  // }
  console.log("course", course);
  return (
  <>
  <Header course={course.name}/>
  <Content parts={course.parts}/>
  <Total sum={course.parts.reduce((tot, part) => tot + part.exercises, 0)} />
  </>
  ) 
}

const Courses = ({courses}) => {
  console.log("course length", courses.length);
  return courses.map((course) => <Course key={course.id} course={course}/>)
}

export default Courses
