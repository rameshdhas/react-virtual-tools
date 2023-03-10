import logo from './logo.svg';
import './App.css';
import MaskedBackgroundRecording from './components/MaskedBackgroundRecording'
import BokehEffectRecording from './components/BokehEffectRecording'
import VideoRecorderOld from './components/VideoRecorder'
import Recorder from './components/Recorder'
import VideoRecorder from './components/video-recorder'


function App() {

  const actionLoggers = {}



  return (
    <div className="App">
     <VideoRecorder
         mimeType={'video/webm'}
         countdownTime={3000}
         timeLimit={25000}
         {...actionLoggers}
       />
    </div>
  );
}

export default App;
