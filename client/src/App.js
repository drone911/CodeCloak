import logo from './logo.svg';
import './App.css';
import Search from './components/Search';
import Upload from './components/Upload';
import { useState } from 'react';

function toggleInputView() {

};

function App() {
  const [isActionSearch, setActionSearch] = useState(0);

  function toggleInputView() {
    setActionSearch(!isActionSearch);
  }
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <body>
        <img src="/logo.png" alt="CatchMeIfYouScan Logo" />     
        <h2>Catch Me If You Scan</h2>
        <p>Dive deep into your pentesting code or executables and discover exactly what security mechanisms caught them.</p>
        <div name="ActionSelectionButton" onClick={toggleInputView}>
          <span className="switchText">Upload</span>
          <div className="switchCircle"></div>
          <span ClassName="switchText">Search</span>
        </div>
        {isActionSearch? <Upload/>: <Search/>}
      </body>
    </div>
  );
}

export default App;
