import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

const App = () => {
  const [welcome, setWelcome] = useState('');
  const [joinSocket, setJoinSocket] = useState({});
  const [data, setData] = useState([]);
  const endpoint = "http://localhost:4030";

  const handleClick = () => {
    alert('کونت میخاره؟!!');
  }

  useEffect(() => {
    fetch('/api')
    .then(res => res.json())
    .then(data => setWelcome(data.message))
    .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    socket = io(endpoint, { transports: ['websocket', 'polling', 'flashsocket'] });

    socket.on('serverMessage', (msg) => {
      setJoinSocket(msg);
    });

    return () => {
      socket.emit('disconnect');
      socket.off();
  }
  }, []);

  useEffect(() => {
    socket.on('receiveData', ({text}) => {
      const textArray = text.map(item => item.trim());
      setData(textArray);
    });
  }, []);

  return (
    <div style={{margin: "50px 80px"}}>
      <h1 style={{textAlign: "center"}}>{welcome}</h1>
      <div style={{textAlign: "center"}}>
        <button onClick={handleClick} style={{backgroundColor: "crimson", color: "white", padding: "10px 20px", borderRadius: "5px", border: "none", cursor: "pointer", fontSize: "20px"}}>Get Data</button>
      </div>
      <div style={{display: "flex", flexFlow: "row wrap", justifyContent: "space-between", alignContent: "center"}}>
        <h3>{joinSocket.message}</h3>
        <h4>{joinSocket.date}</h4>
      </div>
      <ul>
        {data.map((list, key) => {
          return (
            <li key={key}>
              {list}
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default App;