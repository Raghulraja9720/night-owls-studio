// Utility for Universal Video URL Parsing and Platform Detection

export const detectPlatform = (url) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.includes('instagram.com')) return 'Instagram';
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'YouTube';
    if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) return 'Facebook';
    if (hostname.includes('vimeo.com')) return 'Vimeo';
    if (hostname.includes('tiktok.com')) return 'TikTok';
    if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) return 'Direct URL';
    
    return 'Unknown';
  } catch (e) {
    return 'Invalid URL';
  }
};

export const getEmbedUrl = (url, platform) => {
  if (!url) return null;
  const detectedPlatform = platform || detectPlatform(url);
  
  try {
    const urlObj = new URL(url);
    
    if (detectedPlatform === 'YouTube') {
      let videoId = '';
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.pathname.includes('/shorts/')) {
        videoId = urlObj.pathname.split('/shorts/')[1];
      } else {
        videoId = urlObj.searchParams.get('v');
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    if (detectedPlatform === 'Vimeo') {
      const videoId = urlObj.pathname.split('/').pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }

    if (detectedPlatform === 'TikTok') {
      // Official TikTok embed format requires the video ID
      // https://www.tiktok.com/@username/video/123456789
      const match = url.match(/\/video\/(\d+)/);
      if (match && match[1]) {
         return `https://www.tiktok.com/embed/v2/${match[1]}`;
      }
      return null;
    }

    if (detectedPlatform === 'Instagram') {
      // Instagram embeds can be done via their /embed/ endpoint
      // Strip trailing slash and add /embed/
      let cleanUrl = url.split('?')[0].replace(/\/$/, '');
      if (cleanUrl.includes('/reel/') || cleanUrl.includes('/p/') || cleanUrl.includes('/reels/')) {
        return `${cleanUrl}/embed/`;
      }
      return null;
    }

    if (detectedPlatform === 'Facebook') {
      // Facebook provides a generic embed player
      // https://www.facebook.com/plugins/video.php?href={URL}
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
    }
    
    return null; // For Direct URL or Unknown, we handle differently in UI
  } catch (e) {
    return null;
  }
};

export const isDirectVideo = (url) => {
  return detectPlatform(url) === 'Direct URL';
};
