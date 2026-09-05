import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/918531807705?text=Hi%20Night%20Owls%20Studio,%20I%20would%20like%20to%20know%20more%20about%20your%20services!"
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      aria-label="Direct WhatsApp Message"
    >
      <MessageCircle className="whatsapp-float-icon" size={24} />
      <span className="whatsapp-float-text">Chat with Us</span>
    </a>
  );
}
