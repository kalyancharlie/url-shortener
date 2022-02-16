import './styles.css';
import URLSearch from './components/URLSearch';
import UrlsList from './components/URLsList';

function App() {
  return (
    <div className='url-shortener-container'>
      <URLSearch />
      {/* <UrlsList /> */}
    </div>
  );
}

export default App;
