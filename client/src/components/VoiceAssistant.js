import React, { useState, useEffect } from 'react';
import { Fab, Dialog, DialogContent, Typography, Box, IconButton } from '@mui/material';
import { Mic, MicOff, VolumeUp, Close } from '@mui/icons-material';

function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const voiceCommands = {
    'doctor': () => {
      speak('डॉक्टर खोजने के लिए बोलें');
      return 'AI suggests: Describe your symptoms for better doctor matching';
    },
    'tooth pain': () => {
      speak('दांत के डॉक्टर मिल जाएंगे');
      return '🦷 AI recommends: BDS specialists available for dental consultation';
    },
    'headache': () => {
      speak('सिर दर्द के लिए डॉक्टर');
      return '🤕 AI analysis: General physicians can help with headache assessment';
    },
    'fever': () => {
      speak('बुखार के लिए डॉक्टर');
      return '🤒 AI insight: MBBS doctors available for fever evaluation';
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setIsOpen(true);
      };

      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        setTranscript(command);
        
        const matchedCommand = Object.keys(voiceCommands).find(cmd => 
          command.includes(cmd)
        );
        
        if (matchedCommand) {
          const result = voiceCommands[matchedCommand]();
          setResponse(result);
        } else {
          speak('फिर से बोलें');
          setResponse('AI listening: Say doctor, tooth pain, headache, or fever');
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        speak('फिर से कोशिश करें');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  return (
    <>
      <Fab
        color="secondary"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
        onClick={startListening}
      >
        {isListening ? <MicOff /> : <Mic />}
      </Fab>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <IconButton onClick={() => setIsOpen(false)} sx={{ float: 'right' }}>
              <Close />
            </IconButton>
            
            <VolumeUp sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              🎤 Voice Assistant / आवाज़ सहायक
            </Typography>
            
            {isListening ? (
              <Typography color="primary">
                🎙️ Listening... / सुन रहा हूं...
              </Typography>
            ) : (
              <Typography>
                Say: "doctor", "tooth pain", "headache", "fever"
              </Typography>
            )}
            
            {transcript && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2">You said: {transcript}</Typography>
              </Box>
            )}
            
            {response && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="body1">{response}</Typography>
              </Box>
            )}
            
            <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
              💡 Tip: Speak clearly in English or Hindi
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default VoiceAssistant;