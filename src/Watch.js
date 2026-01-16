import React, { useRef, useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Plyr from 'plyr';
import Hls from 'hls.js';

function Watch() {
  const [iframeSrc, setIframeSrc] = useState(null);
  const [m3u8Url, setM3u8Url] = useState(null);
  const [tracks, setTracks] = useState([]);
  const mop = useRef(null);
  const frm = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const animeId = searchParams.get('animeId');
  const dataId = searchParams.get('dataId');

  const [animeData, setAnimeData] = useState(null);
  const [animeEpisodes, setAnimeEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [servers, setServers] = useState([]);
  const [selectedRangeKey, setSelectedRangeKey] = useState(null);

  const [search, setSearch] = useState('');
  const [results, setResults] = useState(null);
  const ress = useRef(null);

  const [allState, setAllState] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [genre, setGenre] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  // ===== VideoPlayer Component =====
  const VideoPlayer = React.memo(({ m3u8Url, tracks }) => {
    const videoRef = useRef(null);
    const plyrRef = useRef(null);
    const hlsRef = useRef(null);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      // Destroy previous instances
      plyrRef.current?.destroy();
      hlsRef.current?.destroy();

      if (!m3u8Url) return;

      // Initialize HLS
      const hls = new Hls({ enableWebVTT: true });
      hls.loadSource(m3u8Url);
      hls.attachMedia(video);
      hlsRef.current = hls;

      // Initialize Plyr
      plyrRef.current = new Plyr(video, {
        captions: { active: true, update: true },
        controls: [
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'captions',
          'settings',
          'fullscreen',
        ],
      });

      // Set default caption track
      const defaultTrackIndex = tracks.findIndex(t => t.default);
      if (defaultTrackIndex !== -1) {
        video.textTracks[defaultTrackIndex].mode = 'showing';
      }

      return () => {
        plyrRef.current?.destroy();
        hlsRef.current?.destroy();
      };
    }, [m3u8Url, tracks]);

    return (
      <video
        ref={videoRef}
        controls
        crossOrigin="anonymous"
        playsInline
        style={{ width: '100%', height: '100%' }}
      >
        {tracks
          .filter(t => t.kind === 'captions')
          .map((track, index) => (
            <track
              key={index}
              src={track.file}
              kind="captions"
              label={track.label || `Track ${index + 1}`}
              srcLang={track.label?.toLowerCase().slice(0, 2) || `lang${index}`}
              default={track.default || false}
            />
          ))}
      </video>
    );
  });

  // ===== Fetch Anime Info =====
  useEffect(() => {
    if (!animeId) return;
    axios
      .get('https://could-harold-awarded-patio.trycloudflare.com/animeInfo', { params: { animeId } })
      .then(res => setAnimeData(res.data.animeInfo))
      .catch(err => console.error(err));
  }, [animeId]);

  // ===== Fetch Episodes =====
  useEffect(() => {
    if (!dataId) return;
    axios
      .get('https://could-harold-awarded-patio.trycloudflare.com/episodes', { params: { dataId } })
      .then(res => {
        const sorted = res.data.episodes.sort((a, b) => a.number - b.number);
        setAnimeEpisodes(sorted);
        if (sorted[0]) changeSource(sorted[0].id);
      })
      .catch(err => console.error(err));
  }, [dataId]);

  // ===== Fetch Episode Servers =====
  const changeSource = async (episodeId, dub = false) => {
    try {
      const res = await axios.get('https://could-harold-awarded-patio.trycloudflare.com/episodeServers', {
        params: { episodeId },
      });
      setServers(res.data);
      setSelectedEpisode(episodeId);
    } catch (err) {
      console.error(err);
    }

    if (mop.current) mop.current.style.paddingTop = '56.25%';

    const newSrc = dub
      ? `https://megaplay.buzz/stream/s-2/${episodeId}/dub`
      : `https://megaplay.buzz/stream/s-2/${episodeId}/sub`;

    setIframeSrc(newSrc);
    setM3u8Url(null); // reset player
  };

  // ===== Search Handler =====
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setResults(null);
      if (ress.current) ress.current.style.display = 'none';
      return;
    }
    try {
      const { data } = await axios.get('https://could-harold-awarded-patio.trycloudflare.com/search', {
        params: { keyword: query },
      });
      const res = data?.animeList || [];
      setResults(res);
      if (ress.current) ress.current.style.display = res.length ? 'block' : 'none';
    } catch (err) {
      console.error(err);
      if (ress.current) ress.current.style.display = 'none';
    }
  };

  // ===== Click Outside Handler for Search =====
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ress.current && !ress.current.contains(event.target)) {
        ress.current.style.display = 'none';
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ===== Episode Browser Component =====
  const EpisodeBrowser = ({ episodes }) => {
    if (!episodes.length) return null;

    const grouped = {};
    episodes.forEach((ep) => {
      const start = Math.floor((ep.number - 1) / 100) * 100 + 1;
      const end = Math.min(start + 99, Math.max(...episodes.map(e => e.number)));
      const key = `${start}–${end}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(ep);
    });

    const sortedKeys = Object.keys(grouped).sort((a, b) => parseInt(a) - parseInt(b));

    useEffect(() => {
      if (!selectedRangeKey && sortedKeys.length) setSelectedRangeKey(sortedKeys[0]);
    }, [sortedKeys]);

    return (
      <div id="epo">
        <div style={{ marginBottom: '20px' }}>
          {sortedKeys.map(key => (
            <span
              key={key}
              onClick={() => setSelectedRangeKey(key)}
              style={{
                cursor: 'pointer',
                margin: '10px',
                padding: '6px 10px',
                display: 'inline-block',
                backgroundColor: selectedRangeKey === key ? '#5a2e98' : '#eee',
                color: selectedRangeKey === key ? '#fff' : '#000',
                borderRadius: '4px',
              }}
            >
              {key}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {selectedRangeKey &&
            grouped[selectedRangeKey]?.sort((a, b) => a.number - b.number).map(ep => (
              <button
                key={ep.number}
                onClick={() => changeSource(ep.id)}
                style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '4px',
                  backgroundColor: selectedEpisode === ep.number ? '#5a2e98' : '#999',
                  color: selectedEpisode === ep.number ? '#fff' : '#000',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {ep.number}
              </button>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Video Section */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div ref={mop} id="mop" style={{ position: 'relative', width: '80%', paddingTop: '56.25%' }}>
          {m3u8Url ? (
            <VideoPlayer m3u8Url={m3u8Url} tracks={tracks} />
          ) : (
            <iframe
              ref={frm}
              src={iframeSrc}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          )}
        </div>
      </div>

      {/* Episode Browser */}
      <EpisodeBrowser episodes={animeEpisodes} />

      {/* Example: SUB/DUB Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
        {(servers.sub || []).map((server, index) => (
          <button key={index} onClick={() => getEpisodeSource(server.id)}>
            {server.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Watch;
