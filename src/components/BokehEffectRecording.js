import React, { useEffect, useRef, useCallback, useState } from "react"
import * as tf from "@tensorflow/tfjs"
import * as bodyPix from "@tensorflow-models/body-pix"

export const BokehEffectRecording = () => {
    const [isRecording, setIsRecording] = useState(false)
    const [audioTrack, setAudioTrack] = useState(null)
    const frameId = useRef(null)
    const canvasReference = useRef(null)
    const videoRef = useRef(null)
    // const recordedVideoRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const [recordedChunks, setRecordedChunks] = React.useState([]);

    const setupCamera = useCallback(async (videoElement) => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: 640,
                height: 480,
            },
            audio: true,
        })
        videoElement.srcObject = stream
        const tracks = stream.getAudioTracks()
        setAudioTrack(tracks[0])
        return new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                videoElement.play()
                resolve()
            }
        })
    }, [])

    const segmentBodyAndBlur = useCallback(
        (videoInput, canvasOutput, bodypixnet) => {
            async function renderFrame() {
                const segmentation = await bodypixnet.segmentPerson(videoInput)
                const backgroundBlurAmount = 5
                const edgeBlurAmount = 4
                const flipHorizontal = false
                bodyPix.drawBokehEffect(
                    canvasOutput,
                    videoInput,
                    segmentation,
                    backgroundBlurAmount,
                    edgeBlurAmount,
                    flipHorizontal
                )
                frameId.current = requestAnimationFrame(renderFrame)
            }
            renderFrame()
        },
        []
    )

    const loadCamAndModel = async () => {
        const videoElement = videoRef.current
        const canvasElement = canvasReference.current
        await setupCamera(videoElement)
        videoElement.width = canvasElement.width = videoElement.videoWidth
        videoElement.height = canvasElement.height = videoElement.videoHeight
        tf.getBackend()
        const bodypixnet = await bodyPix.load()
        segmentBodyAndBlur(videoElement, canvasElement, bodypixnet)
    }

    const handleCaptureStream = useCallback(() => {
      setIsRecording(true)
      const stream = canvasReference.current.captureStream()
      stream.addTrack(audioTrack)
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm",
      })
      // mediaRecorderRef.current.addEventListener("dataavailable", (evt) => {
      //   const url = URL.createObjectURL(evt.data)
      //   recordedVideoRef.current.src = url
      // })

        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
      mediaRecorderRef.current.start()
    }, [canvasReference, mediaRecorderRef, setIsRecording, audioTrack])

    const handleStopCaptureClick = useCallback(() => {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }, [mediaRecorderRef, setIsRecording])


    const handleDataAvailable = React.useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleDownload = React.useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "react-webcam-stream-capture.webm";
            a.click();
            window.URL.revokeObjectURL(url);
            setRecordedChunks([]);
        }
    }, [recordedChunks]);

    //cancel requestAnimationFrame on unmount
    const cleanUpFrames = useCallback(() => {
        frameId && cancelAnimationFrame(frameId.current)
    }, [frameId])

    useEffect(() => {
        return () => {
            cleanUpFrames()
        }
    }, [])

    useEffect(() => {
        loadCamAndModel()
    }, [])

    return (
        <>
            <button
                onClick={isRecording ? handleStopCaptureClick : handleCaptureStream}
            >
                {isRecording ? "Stop" : "Start"}
            </button>
            <button onClick={handleDownload}>Download</button>
            <h1>Recorder</h1>
            <video
                ref={videoRef}
                id="input"
                muted
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    margin: "auto",
                    zindex: 1,
                }}
            ></video>
            <canvas
                ref={canvasReference}
                id="canvas"
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    margin: "auto",
                    zindex: 9,
                }}
            />
        </>
    )
}


export default BokehEffectRecording;
