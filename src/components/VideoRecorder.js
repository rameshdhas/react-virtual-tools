import React from "react";
import Webcam from "react-webcam";
import './style.css'

const VideoRecorderOld = () => {



  return (

        <div className="container mycontainer">
        			<div className="steps">

        				<div className="card" id="step-give-permissions">
        					<h4 className="card-header">Allow camera/microphone access</h4>
        					<div className="card-block">
        						<p className="card-text">
        							A popup should appear in the top-left of your screen &ndash; click "allow".
        						</p>
        					</div>
        				</div>



        				<div className="card" id="step-test-input">
        					<h4 className="card-header">Test your input</h4>
        					<div className="card-block">
        						Please ensure that:
        						<ol>
        							<li>
        								Your voice registers on this bar:
        								<div className="progress" style={{width: '350px', maxWidth: '100%'}}>
        									<div className="progress-bar bg-success" id="test-meter" role="progressbar"></div>
        								</div>
        							</li>
        							<li>
        								You can see yourself below:
        							</li>
        							<video className="liveview" id="test-liveview" muted style={{width: '100%', maxWidth: '300px'}}></video>
        						</ol>
        						<form id="test-form" className="w-100 text-right" >
        							<button className="btn btn-primary chevron" type="submit" id="test-submit">Looks good</button>
        						</form>
        					</div>
        				</div>


        				<div className="card" id="step-record">
        					<h4 className="card-header"><span className="record-icon"></span> Record video</h4>
        					<div className="liveview-overlay-wrapper">
        						<video className="liveview card-img-top w-100" id="record-liveview" muted></video>
        						<div className="liveview-overlay fade-at-countdown-end"></div>

        						<div className="liveview-overlay-content-wrapper fade-at-countdown-end">
        							<div className="countdown-inner">
        								<form id="record-start-form">
        									<button className="btn btn-danger btn-lg chevron" type="submit" id="record-start-submit">Start Recording</button>
        								</form>
        								<div>
        									<h1 className="countdown-number">3</h1>
        								</div>
        								<div>
        									<h1 className="countdown-number">2</h1>
        								</div>
        								<div>
        									<h1 className="countdown-number">1</h1>
        								</div>
        								<div>
        									<h1 className="countdown-number">Go!</h1>
        								</div>
        							</div>
        						</div>
        					</div>
        					<div className="card-block">
        						<form id="record-form" className="w-100 text-right" >
        							<span className="recording-timer-outer">Recorded for <span className="recording-timer">0:00</span></span> <button className="btn btn-primary chevron" disabled type="submit" id="record-submit">Stop and upload</button>
        						</form>
        					</div>
        				</div>


        				<div className="card" id="step-finalise-upload">
        					<h4 className="card-header">Finish upload</h4>
        					<div className="card-block">
        						<div className="alert alert-warning">
        							<strong>Hold on!</strong> Please do not close this page until the upload completes:
        						</div>

        						<div className="progress">
        							<div id="progress-meter" className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"></div>
        						</div>
        					</div>
        				</div>


        				<div className="card" id="step-success">
        					<h4 className="card-header">Done</h4>
        					<div className="card-block">
        						<div className="alert alert-success">
        							<strong>Success!</strong> Your video has been uploaded to Google Drive. <span className="only-if-folder-not-specified">It is not in any folder: you may wish to open Google Drive now and move it into place.</span>
        						</div>
        					</div>
        				</div>
        			</div>

        		</div>

  );

};

export default VideoRecorderOld;