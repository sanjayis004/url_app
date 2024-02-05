import './App.css';
import UrlsShortenerBox from './Components/UrlsShortenerBox.js'
import RedirectComponent  from './Components/RedirectComponent.js';
import { BrowserRouter as Router,Routes,Route, useLocation, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path ="/" Component={UrlsShortenerBox} />
          <Route path ="/:short_url" Component={RedirectComponent}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
