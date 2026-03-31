import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Loader2, Mic, MicOff } from "lucide-react";
import { transcribeAudio } from "@/lib/ai-service";
import { showError } from "@/utils/toast";

interface Props {
  onProcess: (text: string) => Promise<void>;
  processing: boolean;
  disabled?: boolean;
}

export const WhatsAppSimulator = ({ onProcess, processing, disabled }: Props) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleSend = async () => {
    if (!message.trim() || processing) return;
    await onProcess(message);
    setMessage("");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], "recording.wav", { type: 'audio/wav' });
        
        try {
          const text = await transcribeAudio(audioFile);
          setMessage(text);
          await onProcess(text);
          setMessage("");
        } catch (err) {
          showError("Failed to transcribe audio.");
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      showError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-100 flex flex-col justify-center space-y-4">
      <div className="flex items-center gap-3 text-green-700 font-bold text-lg">
        <div className="bg-green-100 p-2 rounded-xl">
          <MessageSquare className="h-5 w-5" />
        </div>
        <span>WhatsApp Simulator</span>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">
        Record sales or expenses by typing or using your voice. Our AI handles the rest.
      </p>
      <div className="space-y-3">
        <Input 
          placeholder="Type or use mic..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={processing || disabled}
          className="bg-gray-50 border-green-100 focus-visible:ring-green-500 rounded-2xl h-14 text-base px-5"
        />
        <div className="flex gap-2">
          <Button 
            variant={isRecording ? "destructive" : "outline"}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={processing || disabled}
            className={`flex-1 h-14 rounded-2xl text-base font-semibold transition-all ${
              !isRecording ? "border-green-200 text-green-600 hover:bg-green-50" : "animate-pulse"
            }`}
          >
            {isRecording ? <MicOff className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
            {isRecording ? "Stop Recording" : "Voice Note"}
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={processing || !message.trim() || disabled}
            className="bg-green-600 hover:bg-green-700 h-14 px-8 rounded-2xl shadow-lg shadow-green-100"
          >
            {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};