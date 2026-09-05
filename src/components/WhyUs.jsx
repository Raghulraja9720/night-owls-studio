import React from 'react';
import { Target, Smartphone, TrendingUp, MessageSquare, Receipt, ShieldCheck } from 'lucide-react';

export default function WhyUs() {
  return (
    <section id="why-us" className="section light-theme bg-white">
      <div className="container">
        <div className="text-center section-header">
          <div className="section-badge">The Night Owls Studio Advantage</div>
          <h2 className="section-title">Why Ambitious Brands Partner With Us</h2>
          <p className="section-description">
            We focus on what moves the needle for your business — uncompromised code speed, clear technical roadmap, and dependable delivery.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Target size={24} /></div>
            <h4 className="feature-title">Built Around Your Goals</h4>
            <p className="feature-desc">We create websites and ads based on your business, your customers, and your goals.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Smartphone size={24} /></div>
            <h4 className="feature-title">Designed for Every Screen</h4>
            <p className="feature-desc">Your website works smoothly and looks good on phones, tablets, and computers.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><TrendingUp size={24} /></div>
            <h4 className="feature-title">Results You Can See</h4>
            <p className="feature-desc">We track your ads and show you where your money is going and what you're getting from it.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><MessageSquare size={24} /></div>
            <h4 className="feature-title">Communication You Can Trust</h4>
            <p className="feature-desc">We keep things simple and tell you exactly what we're doing and why.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Receipt size={24} /></div>
            <h4 className="feature-title">Pricing Without Surprises</h4>
            <p className="feature-desc">You know the cost before we start, with no unexpected charges later.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={24} /></div>
            <h4 className="feature-title">Support From Start to Finish</h4>
            <p className="feature-desc">From setting up your website to keeping it updated, we take care of the work for you.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
