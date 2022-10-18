import React, { Fragment } from 'react';
import './App.css';
import UserPage from './components/UserPage';
//import { Route, Router, Redirect } from 'react-router-dom'
import LogInPage from './components/LogInPage';

function App(props) {
  

  if (props.location && props.location.hash) {
    console.log(props);
    const tokenArr = props.location.hash.split("&");
    if(tokenArr.length > 0) {
      const token = tokenArr[0].replace("#id_token=", "").replace("#access_token=", "")
      sessionStorage.setItem("token", token);
    }
  }

//console.log(window.location.href);
  //sessionStorage.setItem("token", "eyJraWQiOiJSVHBzSXFkRlJzU2hnZ2hVUDBsVXpueERGVnE5WFY3Tm10TTFlNjJ5VURRPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoic2REaFpCZzQ1NEVEZVJ1WEc3ZHJxUSIsInN1YiI6IjYyY2FiMjZiLTZmMDMtNDYzYy1iN2IyLTU0ZjA3Mjk2YzVjYSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0xLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMV81OXAzQ3pNT2ciLCJjb2duaXRvOnVzZXJuYW1lIjoiYWtoaWwiLCJhdWQiOiI2bGY1bWtlbDlrY3A2OGhvZzMwaTBwN2d0cCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjY1Nzk4ODQwLCJleHAiOjE2NjU4MDI0NDAsImlhdCI6MTY2NTc5ODg0MCwianRpIjoiZDMzNzRkZjEtMDU4ZC00N2I0LTg1Y2MtY2IzMmMzOWE0NmYyIiwiZW1haWwiOiJha2hpbHRoYW5ldGkyNEBnbWFpbC5jb20ifQ.DxwkcjSWU2_Yry40xhEfmiHQuB_DVgH72R4dPbbV8UuKxDqpypr6V1dNxmTn59KCa3VMsTJqVl8y4tW_nqLiSL1lNnA2duxlsiWmeP-eL_HHQV88n1I27Zp-63U6qC_V-XcdfIa4BVhVeRmhLcM4MWZZsbB-WQe56hALRL1jmvGwfIacpJLpKA9LvJ074ZywMFN1hZBnD1_tonG-XV2eMODyIySHWUPHSUgtQ5oFc74BOOqESZNfR0sRLc8QZJgpPSYEXheleWTqq6oW5dHfeWXwaIwxSP8_3l2hXJpdu-L9V7cvVqfWTFfoxRmqW1GKb4zNRjOA7vtaLeAdKxoX_A");

  const sessionToken = sessionStorage.getItem("token")

  const isValid =  sessionToken != undefined &&  sessionToken.length>0 ;

  console.log("IsValid", sessionToken);

  return (
    <Fragment>
         {isValid && 
         <UserPage></UserPage>
        } 
        {
          !isValid && 
          <LogInPage></LogInPage>
        }


    </Fragment>
   
  );
}

export default App;
