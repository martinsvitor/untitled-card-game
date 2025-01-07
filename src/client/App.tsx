import "./App.css";
import {io} from "socket.io-client";

import {useState} from "react";

const socket = io();
function App() {
  const [count, setCount] = useState('');

  function emitEvent() {
    console.log('! clicked', count);
    socket.emit('test', count);
  }

  return (
    <div className="App">
      <input
          placeholder={'Message...'}
          value={count}
          onChange={(event) => setCount(event.target.value)} />
        <button onClick={emitEvent}> Send Message </button>
    </div>
  );
}

export default App;
