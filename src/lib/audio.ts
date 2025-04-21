import { useEffect } from 'react';

class AudioFeedback {
  private static instance: AudioFeedback;
  private synthesis: SpeechSynthesis;
  private notificationSound: HTMLAudioElement;

  private constructor() {
    this.synthesis = window.speechSynthesis;
    this.notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  }

  public static getInstance(): AudioFeedback {
    if (!AudioFeedback.instance) {
      AudioFeedback.instance = new AudioFeedback();
    }
    return AudioFeedback.instance;
  }

  public speak(text: string, rate: number = 1, pitch: number = 1): void {
    if (!this.synthesis) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = 'en-IN';

    this.synthesis.speak(utterance);
  }

  public playNotification(): void {
    this.notificationSound.currentTime = 0;
    this.notificationSound.play().catch(console.error);
  }

  public vehicleSelected(vehicleName: string, seats: number, fare: number): void {
    this.speak(
      `You have selected ${vehicleName}, available seats: ${seats}, fare: ${fare} rupees. Please proceed to payment.`,
      1,
      1
    );
  }

  public paymentSuccess(): void {
    this.playNotification();
    this.speak('Payment successful! Your ticket is booked.', 1, 1);
  }

  public driverRegistered(): void {
    this.playNotification();
    this.speak('Congratulations! Your vehicle is now listed, and you can manage your rides in your account.', 1, 1);
  }

  public welcomeUser(name: string): void {
    this.speak(`Welcome back, ${name}! You are successfully logged in.`, 1, 1);
  }
}

export const useAudioFeedback = () => {
  useEffect(() => {
    // Request permission for notifications if needed
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  return AudioFeedback.getInstance();
};

export default AudioFeedback.getInstance();