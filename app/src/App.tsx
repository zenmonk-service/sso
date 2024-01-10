import React, { useEffect } from 'react';

function App() {
  useEffect(()=> {
     const login = async () => {
      let response = await fetch('http://localhost:5555', {
        credentials: 'include', // To include cookies
        headers: {
          'Content-type': 'application/json'
        }
      });
      response = await response.json();
      console.log('response: ', response);
     }
  }, []);
  return (
    <div className="App">
       <a href='http://localhost:5555/login?redirectURL=http://localhost:3000'><button>Login</button></a>
    </div>
  );
}

export default App;
