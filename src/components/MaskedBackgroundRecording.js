import React, { useEffect, useRef, useCallback, useState } from "react"
import * as tf from "@tensorflow/tfjs"
import * as bodyPix from "@tensorflow-models/body-pix"

export const MaskedBackgroundRecording = () => {
    const [isRecording, setIsRecording] = useState(false)
    const [audioTrack, setAudioTrack] = useState(null)
    const frameId = useRef(null)
    const canvasReference = useRef(null)
    const videoRef = useRef(null)
    const recordedVideoRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const [recordedChunks, setRecordedChunks] = React.useState([]);

    const setupCamera = useCallback(async (videoElement) => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: 640,
                height: 480,
                facingMode: "user",
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

    const segmentBodyAndAddMask = useCallback(
        (videoInput, canvasOutput, bodypixnet) => {
            const context = canvasOutput.getContext("2d")
            context.clearRect(0, 0, canvasOutput.width, canvasOutput.height)

            const backgroundImg = document.createElement("img")
            backgroundImg.width = "640"
            backgroundImg.height = "480"
            backgroundImg.objectFit = "contain"

            backgroundImg.onload = function () {
                const tempImgCanvas = document.createElement("canvas")
                tempImgCanvas.width = canvasOutput.width
                tempImgCanvas.height = canvasOutput.height
                const tempImgCanvasCtx = tempImgCanvas.getContext("2d")

                async function renderMaskFrame() {
                    frameId.current = requestAnimationFrame(renderMaskFrame)

                    //perform segmentation and create a mask from the output
                    const segmentation = await bodypixnet.segmentPerson(videoInput)
                    const mask = bodyPix.toMask(segmentation)
                    tempImgCanvasCtx.putImageData(mask, 0, 0)

                    context.save()
                    context.clearRect(0, 0, canvasOutput.width, canvasOutput.height)
                    //draw the mask
                    context.globalCompositeOperation = "copy"
                    context.filter = `blur(4px)`
                    context.drawImage(
                        tempImgCanvas,
                        0,
                        0,
                        canvasOutput.width,
                        canvasOutput.height
                    )
                    //draw the virtual background
                    context.globalCompositeOperation = "source-in"
                    context.filter = "none"
                    context.drawImage(
                        backgroundImg,
                        0,
                        0,
                        canvasOutput.width,
                        canvasOutput.height
                    )
                    //finally, draw the video stream
                    context.globalCompositeOperation = "destination-over"
                    context.filter = "none"
                    context.drawImage(
                        videoInput,
                        0,
                        0,
                        canvasOutput.width,
                        canvasOutput.height
                    )

                    context.restore()
                }
                renderMaskFrame()
            }
            backgroundImg.src = "images/bg.jpg"
        },
        []
    )

    const loadCamAndModel = async () => {
        const videoElement = videoRef.current
        await setupCamera(videoElement)
        const canvasElement = canvasReference.current
        videoElement.width = canvasElement.width = videoElement.videoWidth
        videoElement.height = canvasElement.height = videoElement.videoHeight
        tf.getBackend()
        const bodypixnet = await bodyPix.load()
        segmentBodyAndAddMask(videoElement, canvasElement, bodypixnet)
    }

    const handleCaptureStream = useCallback(() => {
      setIsRecording(true)
      const stream = canvasReference.current.captureStream()
      stream.addTrack(audioTrack)

        try {
            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: "video/webm",
            });

        } catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
        }

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
            {/*  <video ref={recordedVideoRef} controls></video>*/}

        </>
    )
}

export default MaskedBackgroundRecording;
