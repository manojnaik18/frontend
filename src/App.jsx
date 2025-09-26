import DataEntryForm from './components/DataEntryForm';
import Dashboard from './components/Dashboard';
import './App.css';
import './components/DataEntryForm.css';

function App() {
  return (
    <>
      {/* Example routing toggle; pick one as needed */}
      <div className="page-shell">
        <div className="page-header"><h1>Add Result</h1></div>
        <div className="content-container form-container">
          <DataEntryForm />
        </div>
      </div> 
      <Dashboard />
       
    </>
  );
}

export default App;
