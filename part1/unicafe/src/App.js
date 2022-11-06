import { useState } from 'react'

const Statistics = ({good, neutral, bad, all, average, positive, feedback}) => {
  if (feedback){
    return (
    <table> 
      <tbody>
      <StatisticLine text="good" value ={good} />
      <StatisticLine text="neutral" value={neutral} /> 
      <StatisticLine text="bad" value ={bad} />
      <StatisticLine text="all" value={all} /> 
      <StatisticLine text="average" value ={average} />
      <StatisticLine text="positive" value={positive*100 + "%"} /> 
      </tbody>
    </table>
  )
  } else {
    return (<> No feedback given</>);
  }
}



const Button = (props) => (
  <button onClick={props.handleClick}> {props.text} </button>
)
const StatisticLine = (props) => (
  <tr><td>{props.text}</td><td>{props.value}</td></tr>);

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)
  const [feedback, setFeedback] = useState(false);


  function newFeedbackProcessor(feedback_type){
    let returnFunction;
    let newAll; 
    if (feedback_type==="good"){
      returnFunction = () => 
      {
        let newGood = good + 1; 
        setGood(good+1);
        setAverage((newGood - bad)/newAll);
        setPositive(newGood/newAll);
      }
    } if (feedback_type === "neutral") {
      returnFunction = () =>     {
        setNeutral(neutral+1);
        setAverage((good - bad)/newAll);
        setPositive(good/newAll);
      }
    } if (feedback_type === "bad") {
      returnFunction = () =>      {
        let newBad = bad + 1; 
        setBad(bad+1);
        setAverage((good - newBad)/newAll);
        setPositive(good/newAll);
      }
    }
    return () => { 
      setFeedback(true);
      newAll = all + 1;
      setAll(all+1); 
      returnFunction()
    } ;
  }
  return (
    <div>
      <h1> give feedback </h1>
      <Button handleClick = {newFeedbackProcessor("good")} text="good"/>
      <Button handleClick = {newFeedbackProcessor("neutral")} text="neutral"/>
      <Button handleClick = {newFeedbackProcessor("bad")} text="bad"/>
      <h1> statistics </h1>
      <Statistics good={good} neutral={neutral} bad={bad} 
      all={all} average={average} positive={positive} feedback = {feedback}/>
    </div>
  )
}

export default App