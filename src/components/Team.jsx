import React, { useState, useEffect, useRef } from 'react';
import { Crown, Target, Search, Share2, Film } from 'lucide-react';

const members = [
  {
    name: 'Sivamanikandan P',
    role: 'Team Leader & Web/App Developer',
    dept: 'Web & App Development',
    bio: 'Leads the team and builds modern websites and web applications that are fast, responsive, and reliable.',
    image: '/assets/images/sivamanikandan.jpg',
    skills: ['Web Development', 'App Development', 'Full-Stack Development'],
    icon: Crown,
    objectPosition: 'center 18%'
  },
  {
    name: 'Rithanya RS',
    role: 'Meta Ads Specialist',
    dept: 'Meta Ads & Growth',
    bio: 'Creates and manages Meta ad campaigns that help businesses reach the right audience and generate more leads.',
    image: '/assets/images/rithanya.jpg',
    skills: ['Meta Ads', 'Campaign Management', 'Lead Generation'],
    icon: Target,
    objectPosition: 'center 14%'
  },
  {
    name: 'Raghul Raja V',
    role: 'SEO Specialist',
    dept: 'SEO & Organic Growth',
    bio: 'Optimizes websites to improve Google rankings, increase organic traffic, and help businesses get found online.',
    image: '/assets/images/raghulraja.jpg',
    skills: ['SEO', 'Keyword Strategy', 'Website Optimization'],
    icon: Search,
    objectPosition: 'center 8%'
  },
  {
    name: 'Shivaranjani K',
    role: 'Social Media Manager',
    dept: 'Social Media Management',
    bio: 'Manages social media content and strategies to build brand awareness, engage audiences, and grow online presence.',
    image: '/assets/images/shivaranjani.jpg',
    skills: ['Social Media', 'Content Strategy', 'Brand Growth'],
    icon: Share2,
    objectPosition: 'center 14%'
  },
  {
    name: 'Sarathy',
    role: 'Video Editor & Motion Designer',
    dept: 'Video & Motion Design',
    bio: 'Creates engaging videos, reels, and promotional content that help brands attract attention and communicate their message effectively.',
    image: '/assets/images/sarathy.jpg',
    skills: ['Video Editing', 'Motion Graphics', 'Reels', 'Promotional Content'],
    icon: Film,
    objectPosition: 'center 15%'
  }
];

export default function Team() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="team" ref={sectionRef} className="section light-theme bg-light">
      <div className="container">
        {/* Section Header */}
        <div className="text-center section-header">
          <div className="section-badge">Leadership &amp; Core Collective</div>
          <h2 className="section-title">Meet The Night Owls Studio Team</h2>
          <p className="section-description">
            Dedicated builders, designers, and strategists working hard so your business commands real authority online.
          </p>
        </div>

        {/* Team Grid */}
        <div className="team-grid">
          {members.map((member, index) => {
            const IconComponent = member.icon;

            return (
              <div
                key={index}
                className={`team-card ${isVisible ? 'is-visible' : ''}`}
                style={{ '--delay': `${index * 110}ms` }}
              >
                {/* Department Badge */}
                <span className="team-dept-pill">{member.dept}</span>

                {/* Avatar Frame with Gold Gradient Ring */}
                <div className="team-avatar-wrap">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    className="team-avatar-img"
                    style={{ objectPosition: member.objectPosition || 'center 15%' }}
                    loading="lazy"
                  />
                  <div className="team-badge-icon" aria-label={member.role}>
                    <IconComponent size={16} />
                  </div>
                </div>

                {/* Card Content & Readable Typography */}
                <div className="team-card-content">
                  <h3 className="team-member-name">{member.name}</h3>

                  <div className="team-role-wrap">
                    <span className="team-member-role">{member.role}</span>
                  </div>

                  <p className="team-member-bio">{member.bio}</p>

                  {/* Skills Chips */}
                  <div className="team-skills">
                    {member.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
