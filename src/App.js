import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

const App = () => {
  const [welcome, setWelcome] = useState('');
  const [joinSocket, setJoinSocket] = useState({});
  const [data, setData] = useState([]);
  const [interval, setInterval] = useState(1);
  const endpoint = "http://localhost:4030";

  const handleChange = (e) => {
    setInterval(Number(e.target.value));
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
    socket.emit('fetchData', (interval*1000));
    socket.on('receiveData', ({text}) => {
      // console.table(text.map((item) => {
      //   return item.split(',');
      // }));
      setData(text);
    });
  }, [interval]);

  return (
    <div style={{margin: "50px 80px"}}>
      <h1 style={{textAlign: "center"}}>{welcome}</h1>
      <div style={{textAlign: "center"}}>
        <label>Interval: </label>
        <select onChange={handleChange} defaultValue={1}>
          <option >choose interval</option>
          <option value={1}>1 second</option>
          <option value={5}>5 second</option>
          <option value={10}>10 second</option>
        </select>
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