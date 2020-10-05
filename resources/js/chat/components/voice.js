export default {recorder}

function recorder(onRecorderCreated, onComplete, onCatch, seconds){
	let gumStream; 						//stream from getUserMedia()
	let recorder; 						//WebAudioRecorder object
	let input; 							//MediaStreamAudioSourceNode  we'll be recording
	let encodingType; 					//holds selected encoding for resulting audio (file)
	let encodeAfterRecord = true;       // when to encode
	let constraints = { audio: true, video:false };
	let audioContext; //new audio context to help us record

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		audioContext = new AudioContext();
		gumStream = stream;
		input = audioContext.createMediaStreamSource(stream);
		encodingType = 'mp3';

		recorder = new WebAudioRecorder(input, {
			workerDir: "/assets/js/", // must end with slash
			encoding: encodingType,
			numChannels:2, //2 is the default, mp3 encoding supports only 2
			onEncoderLoading: function(recorder, encoding) {
				// show "loading encoder..." display
				console.log("Loading "+encoding+" encoder...");
			},
			onEncoderLoaded: function(recorder, encoding) {
				// hide "loading encoder..." display
				console.log(encoding+" encoder loaded");
			}
		});

		recorder.onComplete = function(recorder, blob) {
			console.log("Encoding complete");

			onComplete(blob);
		};

		recorder.setOptions({
			timeLimit:120,
			encodeAfterRecord:encodeAfterRecord,
			ogg: {quality: 0.5},
			mp3: {bitRate: 160}
		});

		recorder.startRecording();

		if(seconds){
			setTimeout(() => {
				recorder.finishRecording();
			}, seconds);
		}

		onRecorderCreated(recorder);
	}).catch(onCatch);
}
