import React, { useEffect, useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const login = async () => {
      try {
        let response = await fetch('http://localhost:5555', {
          credentials: 'include', // To include cookies
          headers: {
            'Content-type': 'application/json'
          }
        });
        let rawResponse = await response.json();
        if(rawResponse && rawResponse.message) {
          console.log('rawResponse: ', rawResponse);
          setIsLoggedIn(true)
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.log('err: ', err);
      }
    }

    login();
  }, []);
  return (
    <div className="App" style={{ padding: '20px' }}>
      {
        isLoggedIn ? (
          <div>
            <h4>Logged in</h4> 
            <a href='http://localhost:5555/logout?redirectURL=http://localhost:3000'><button>Logout</button></a>
          </div>
        ) : (
          <a href='http://localhost:5555/login?redirectURL=http://localhost:3000'><button>Login</button></a>
        )
      }
    </div>
  );
}

export default App;
