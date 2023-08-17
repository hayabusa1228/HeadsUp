import React from 'react';
import './App.css';
import Title from "./Pages/Title.tsx"

const App: React.FC = () => {
  return (
    <div className="App h-screen bg-home-bg-img  bg-cover"> 
      <Title />
    </div>
  );
}

export default App;
