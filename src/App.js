import logo from './logo.svg';
import './App.css';
import MaskedBackgroundRecording from './components/MaskedBackgroundRecording'
import BokehEffectRecording from './components/BokehEffectRecording'
import VideoRecorder from './components/VideoRecorder'

function App() {
  return (
    <div className="App">
      <VideoRecorder/>
    </div>
  );
}

export default App;
