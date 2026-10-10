import React, { useState, useEffect, useRef } from 'react';
import { Crown, Target, Search, Share2, Film } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Helper to map DB icon name to Lucide component
const getIcon = (iconName) => {
  switch (iconName) {
    case 'Crown': return Crown;
    case 'Target': return Target;
    case 'Search': return Search;
    case 'Share2': return Share2;
    case 'Film': return Film;
    default: return Crown;
  }
};

export default function Team() {
  const [isVisible, setIsVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('status', 'PUBLISHED')
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching team members from Supabase:', error);
          return;
        }

        if (data) {
          const mappedData = data.map(dbMember => {
            const baseImg = dbMember.image_url || '/assets/images/placeholder.jpg';
            
            return {
              name: dbMember.name,
              role: dbMember.role,
              dept: dbMember.department || 'Night Owls Team',
              bio: dbMember.bio,
              image: baseImg,
              skills: dbMember.skills || [],
              icon: getIcon(dbMember.icon),
              objectPosition: 'center center'
            };
          });
          setMembers(mappedData);
        }
      } catch (err) {
        console.error('Exception fetching team:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

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
                    decoding="async"
                    width="140"
                    height="140"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/images/placeholder.jpg';
                      e.currentTarget.onerror = null;
                    }}
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
