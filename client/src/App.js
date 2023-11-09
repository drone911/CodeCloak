import logo from './logo.svg';
import './App.css';
import Search from './components/Search';
import Upload from './components/Upload';
import Discover from './components/Discover'
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
      <body>
        <section className="header-section">
          <img id='logo' src={logo} alt="CatchMeIfYouScan Logo" />
        </section>


        <section className="upload-or-search-section">
          <div name="ActionSelectionButton" onClick={toggleInputView}>
            <span className="switch-text">Upload</span>
            <div className="switch-circle"></div>
            <span ClassName="switch-text">Search</span>
          </div>

          {isActionSearch ? <Upload /> : <Search />}
        </section>

        <section className="discover-section">
          <Discover></Discover>
        </section>

      </body>
    </div>
  );
}

export default App;
