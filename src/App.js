import './App.css';
import CheckOutPage from './Components/CheckOut';
import Home from './Components/Home';
import swal from 'sweetalert';

import {AuthProvider} from "./Components/AuthContext"

function App() {
  return (
    
    <AuthProvider>
    <div className="App">
      <Home/>
    </div>
    </AuthProvider>
  );
}

export default App;
