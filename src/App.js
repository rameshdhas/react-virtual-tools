import logo from './logo.svg';
import './App.css';
import MaskedBackgroundRecording from './components/MaskedBackgroundRecording'
import BokehEffectRecording from './components/BokehEffectRecording'
import VideoRecorderOld from './components/VideoRecorderOld'
import Recorder from './components/Recorder'
import VideoRecorder from './components/VideoRecorder'


function App() {

  const actionLoggers = {}

  return (
    <div className="App">
     <VideoRecorder
         mimeType={'video/webm'}
         countdownTime={3000}
         timeLimit={60000}
         {...actionLoggers}
       />
       {/* <MaskedBackgroundRecording/>*/}
    </div>
  );
}

export default App;
