import React, { useEffect, useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const login = async () => {
      try {
        let response = await fetch(process.env.REACT_APP_SSO_HOST || '', {
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
            <a href={`${process.env.REACT_APP_SSO_HOST}/logout?redirectURL=${process.env.REACT_APP_APP_HOST}`}><button>Logout</button></a>
          </div>
        ) : (
          <a href={`${process.env.REACT_APP_SSO_HOST}/login?redirectURL=${process.env.REACT_APP_APP_HOST}`}><button>Login</button></a>
        )
      }
    </div>
  );
}

export default App;
