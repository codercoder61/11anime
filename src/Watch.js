import React,{useRef,useState,useEffect} from 'react'
import './Home.css'
import axios from 'axios'
import { useSearchParams,Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Plyr from 'plyr';
import Hls from 'hls.js';
function Watch() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const frm = useRef(null);
  const [searchParams] = useSearchParams();
  const player = new Plyr('#player', {
    captions: { active: true, update: true }
  });
	const trackNode = player.captions.currentTrackNode; // <track> element

if (trackNode) {
  // Find the matching TextTrack
  const textTrack = Array.from(player.textTracks).find(
    t => t.language === trackNode.srclang
  );

  if (textTrack && (!textTrack.activeCues || textTrack.mode !== 'showing')) {
    textTrack.mode = 'showing';
  }
}


const [tracks,setTracks]=useState([])
const track = useRef(null);
  //const player = videojs('my-video');
const animeId = searchParams.get('animeId');
const dataId = searchParams.get('dataId');
console.log("animeId:", animeId);  // Log the animeId value
console.log("dataId:", dataId);    // Log the dataId value

  const bars = useRef(null)
  const all = useRef(null)
  const ress= useRef(null)
  const [search,setSearch] = useState("")
const [results, setResults] = useState(null);
useEffect(() => {
    const handleClickOutside = (event) => {
      if (ress.current && !ress.current.contains(event.target)) {
        ress.current.style.display = 'none';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [animeData,setAnimeData] = useState(null)
  const [animeEpisodes,setAnimeEpisodes] = useState([])
  const [isHovered,setIsHovered] = useState(false)
  const [isSignIn,setIsSignIn] = useState(false)
  const [isSignUp,setIsSignUp] = useState(false)
  const [allState,setAllState] = useState(false)
  const [src,setSrc] = useState("")
  const [episodeId,setEpisodeId] = useState("")
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
    const [order, setOrder] = useState('');
    const handleSearch = async (search) => {
  if (!search.trim()) {
    setResults(null);
    ress.current.style.display = 'none';
    return;
  }

  try {
    const { data } = await axios.get('https://hianimeapi-09b09f8b1d48.herokuapp.com/search', {
      params: { keyword: search },
    });
    console.log(data)
    const results = data?.animeList || [];
    setResults(results);
    if(ress.current)
      ress.current.style.display = results.length > 0 ? 'block' : 'none';

  } catch (error) {
    console.error('Error fetching data:', error);
    // Optionally hide results or show error state
    if(ress.current)
      ress.current.style.display = 'none';
  }
};

  const [selectedEpisode, setSelectedEpisode] = useState(null);
const handleSubmit = (e) => {
    e.preventDefault(); // Prevents full page reload

    navigate(`/?genre=${genre}&type=${type}&status=${status}`)
  };

const handleClick = (show) => {
  navigate(`/?letter=${show}`)
};

console.log("animeId:", animeId);  // Log the animeId value

useEffect(() => {
  axios
    .get('https://hianimeapi-09b09f8b1d48.herokuapp.com/animeInfo', {
      params: { animeId }
    })
    .then(response => {
      console.log('Response:', response);
      setAnimeData(response.data.animeInfo);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}, [animeId]);


useEffect(()=>{
  axios
  .get('https://hianimeapi-09b09f8b1d48.herokuapp.com/episodes', {
    params: { dataId }
  })
  .then(response => {
    console.log('Response:', response);
    setAnimeEpisodes(response.data.episodes.sort((a, b) => a.number - b.number))
    let episodeId = response.data.episodes[0].id
    changeSource(episodeId)

      })
  .catch(error => {
    console.error('Error:', error);
  })
},[dataId])
const changeSource = async (episodeId,dub=false) => {
  if (!frm.current) return;
  const iframe = frm.current;
	if(!dub)
  		const mainUrl = `https://megaplay.buzz/stream/s-2/${episodeId}/sub`;
  	else
  		const mainUrl = `https://megaplay.buzz/stream/s-2/${episodeId}/dub`;
		
	iframe.src = mainUrl;
};


  const [selectedRangeKey, setSelectedRangeKey] = useState(null);
const hlsRef = useRef(null);
const EpisodeBrowser = ({ 
  episodes,
  selectedRangeKey,
  setSelectedRangeKey,
  selectedEpisode,
  setSelectedEpisode,
  changeSource
} ) => {

  // Group episodes by real 100-blocks (but only include real ones)
  const grouped = {};

  episodes.forEach((ep) => {
    const rangeStart = Math.floor((ep.number - 1) / 100) * 100 + 1;
    const rangeEnd = Math.max(rangeStart + 99, ep.number); // dynamic last block (e.g. 201–220)
    const realEnd = Math.max(...episodes.map((e) => e.number)); // max episode number
    const correctedEnd = Math.min(rangeEnd, realEnd); // cap it

    const key = `${rangeStart}–${correctedEnd}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(ep);
  });

  // Sort ranges numerically by rangeStart
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const startA = parseInt(a.split('–')[0], 10);
    const startB = parseInt(b.split('–')[0], 10);
    return startA - startB;
  });

  useEffect(() => {
  if (!selectedRangeKey && sortedKeys.length > 0) {
    setSelectedRangeKey(sortedKeys[0]);
  }
}, [sortedKeys, selectedRangeKey]);


  return (
    <div
      id='epo'
    >
      {/* Range selector spans */}
      <div style={{ marginBottom: '20px' }}>
        {sortedKeys.map((key) => (
          <span
            key={key}
            onClick={() => setSelectedRangeKey(key)}
            style={{
              cursor: 'pointer',
              margin: '10px',
              padding: '6px 10px',
              display:'inline-block',
              backgroundColor: selectedRangeKey === key ? '#5a2e98' : '#eee',
              color: selectedRangeKey === key ? '#fff' : '#000',
              borderRadius: '4px',
            }}
          >
            {key}
          </span>
        ))}
      </div>

      {/* Episode buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {selectedRangeKey && grouped && Array.isArray(grouped[selectedRangeKey]) &&
          grouped[selectedRangeKey]
            .sort((a, b) => a.number - b.number)
            .map((episode) => (
              <button
  key={episode.number}
  onClick={() => {changeSource(episode.id);setSelectedEpisode(episode.number)}}
  style={{
    padding: '6px 10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: selectedEpisode === episode.number ? '#5a2e98' : '#999',
    color: selectedEpisode === episode.number ? '#fff' : '#000',
    cursor: 'pointer',
    width: '35px',
    height: '35px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  {episode.number}
</button>
            ))}
      </div>
    </div>
  );
};
  return (
    <div>
      {allState && <div ref={all} className='all'></div>}
      {isSignIn && <div className='register'>
        <i onClick={()=>{setAllState(false);setIsSignIn(false)}} style={{cursor:'pointer',position:'absolute',right:'10px',top:'10px'}} className="fa-solid fa-xmark"></i>
        <div><img style={{position:'relative',right:'20px',width:'250px'}} src='https://9animetv.to/images/icon-login2.png'/></div>
        <div style={{height:'auto',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
          <h1 style={{color:'#5a2e98',textAlign:'center'}}>Member Login</h1>
          <p style={{textAlign:'center'}}>11anime - a better place to watch anime online for free!</p>
          <div>
            <input placeholder='Your Email' type='email' />
            <i className="fa-solid fa-user"></i>
          </div>
          <div>
            <input placeholder='Password' type='password' />
            <i className="fa-solid fa-lock"></i>
          </div>
          <div id='not' style={{display:'flex',justifyContent:'space-between'}}>
            <div><input id='rem' type='checkbox'/><label for='rem'>Remember me</label></div>
            <span style={{cursor:'pointer',color:'#5a2e98'}}>Forgot password?</span>
          </div>
          <button style={{cursor:'pointer',height:'50px',backgroundColor:'#5a2e98',outline:'none',border:'none',color:'white',fontSize:'1.3em'}}>Login</button>
          <p><span>Don't have an account?</span> <span onClick={()=>{setIsSignIn(false);setIsSignUp(true);}} style={{cursor:'pointer',color:'#5a2e98'}}>Register</span></p>
        </div>
      </div>}
      {isSignUp && <div className='register'>
        <i onClick={()=>{setAllState(false);setIsSignUp(false)}} style={{cursor:'pointer',position:'absolute',right:'10px',top:'10px'}} className="fa-solid fa-xmark"></i>
        <div><img style={{position:'relative',right:'20px',width:'250px'}} src='https://9animetv.to/images/icon-register.png'/></div>
        <div style={{height:'auto',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
          <h1 style={{color:'#5a2e98',textAlign:'center'}}>Register</h1>
          <p style={{textAlign:'center'}}>When becoming members of the site, you could use the full range of functions.</p>
          <div>
            <input placeholder='Your Name' type='text' />
            <i className="fa-solid fa-user"></i>
          </div>
          <div>
            <input placeholder='Email' type='email' />
            <i className="fa-solid fa-envelope"></i>
          </div>
          <div>
            <input placeholder='Your password' type='password' />
            <i className="fa-solid fa-lock"></i>
          </div>
          <div>
            <input placeholder='Repeat your password' type='password' />
            <i className="fa-solid fa-lock"></i>
          </div>
          
          <button style={{cursor:'pointer',height:'50px',backgroundColor:'#5a2e98',outline:'none',border:'none',color:'white',fontSize:'1.3em'}}>Register</button>
          <p><span>Have an account?</span> <span onClick={()=>{setIsSignIn(true);setIsSignUp(false);}} style={{cursor:'pointer',color:'#5a2e98'}}>Sign-in</span></p>
        </div>
      </div>}
      <header>
        <div id='head'>
           <div id='hed'>
                      
                      <Link to='/'><span style={{color:'white',fontSize:'2.2em',margin:'0 5px'}}><span style={{backgroundColor:'#5a2e98',borderRadius:'50%',fontSize:'1.1em',padding:'5px',fontWeight:'bold'}}>11</span><span style={{marginLeft:'2px',fontStyle:'italic',fontWeight:'bold'}}>Anime</span></span></Link>
                      <div style={{position:'relative'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'300px',borderRadius:'17px',backgroundColor:'#292929',paddingRight:'10px',marginLeft:"10px"}}>
                      <input value={search} onFocus={() => {if(results) ress.current.style.display='block';}}
                 onChange={(e)=>{setSearch(e.target.value);handleSearch(e.target.value);}} autoComplete='off' placeholder='Enter anime name' type='text' id='search'/>
                      <i id='icon' className="fa-solid fa-magnifying-glass"></i>
                      
                      </div>
                      <div ref={ress} id='ress'>
                        {results && results.map((elm,index)=>(
                          <Link to={`/watch?dataId=${elm.dataId}&animeId=${elm.animeId}`}><div key={index} style={{margin:'10px 0',display:'flex',alignItems:'center'}}>
                            <div><img style={{objectFit:'cover',width:'50px',height:'50px',borderRadius:'50%'}} src={elm.poster}/></div>
                            <div style={{marginLeft:'10px'}}>
                              <p>{elm.title}</p>
                            </div>
                          </div></Link>
                        ))}
                      </div>
                      </div>
                      <div id='soc'>
                        <i className="fa-brands fa-x-twitter"></i>
                        <i className="fa-brands fa-square-reddit"></i>
                        <i className="fa-brands fa-facebook"></i>
                        <i className="fa-brands fa-instagram"></i>
                      </div>
                      
                    </div>
         
          
        </div>
      </header>
      <div>
        <p style={{margin:'20px 65px',color:'#666',fontSize:'1.2em',fontWeight:'bold'}}><span>Home &gt;</span> <span>{animeData && animeData.title}</span> </p>
      </div>
      <div>
      <div style={{display:'flex',justifyContent:'center'}}>
     <div id="mop">
  <iframe 
    ref={frm}
    width="100%"
    height="100%"
    frameBorder="0"
    scrolling="no"
    allowFullScreen
    style={{
      position: 'absolute',
      top: 0, 
      left: 0,
      width: '100%',
      height: '100%',
    }}
  ></iframe>
</div>


<div id="filter">
            <h1 style={{color:'#fff',fontSize:'1.2em',margin:'40px 0'}}>Quick filter</h1>
            <form className="filter-form" onSubmit={handleSubmit}>
              <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="">All</option>
                <option value="1">Action</option>
                <option value="2">Adventure</option>
                <option value="3">Cars</option>
                <option value="4">Comedy</option>
                <option value="5">Dementia</option>
                <option value="6">Demons</option>
                <option value="8">Drama</option>
                <option value="9">Ecchi</option>
                <option value="10">Fantasy</option>
                <option value="11">Game</option>
                <option value="35">Harem</option>
                <option value="13">Historical</option>
                <option value="14">Horror</option>
                <option value="32">Vampire</option>
                <option value="41">Thriller</option>
                <option value="37">Supernatural</option>
                <option value="31">Super Power </option>
                <option value="30">Sports</option>
                <option value="29">Space</option>
                <option value="36">Slice of Life</option>
                <option value="28">Shounen Ai</option>
                <option value="27">Shounen</option>
                <option value="26">Shoujo Ai</option>
                <option value="25">Shoujo </option>
                <option value="42">Seinen</option>
                <option value="24">Sci-Fi</option>
                <option value="23">School</option>
                <option value="21">Samurai</option>
                <option value="22">Romance</option>
                <option value="40">Psychological</option>
                <option value="39">Police</option>
                <option value="20">Parody</option>
                <option value="7">Mystery</option>
                <option value="19">Music</option>
                <option value="38">Military</option>
                <option value="18">Mecha</option>
                <option value="17">Martial Arts</option>
                <option value="16">Magic</option>
                <option value="15">Kids</option>
                <option value="43">Josei</option>
                <option value="44">Isekai</option>
              </select><br/><br/>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">All</option>
                <option value="2">TV</option>
                <option value="1">Movie</option>
                <option value="3">OVA</option>
                <option value="6">Music</option>
                <option value="5">Special</option>
                <option value="4">ONA</option>
              </select><br/><br/>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All</option>
                <option value="1">Finished airing</option>
                <option value="2">Currently airing</option>
                <option value="3">Not yet aired</option>
              </select><br/><br/>
              <button style={{color:'white',backgroundColor:'#5a2e98',outline:'none',border:'none',padding:'10px',borderRadius:'15px',boxShadow:'0 0 5px grey',fontSize:'1.3em'}}>Filter</button>
            </form>
<button onClick={() => changeSource(episodeId,true)}>
  			Use Fallback (Dub)
	</button>
    </div>
</div>
<EpisodeBrowser episodes={animeEpisodes}
  selectedRangeKey={selectedRangeKey}
  setSelectedRangeKey={setSelectedRangeKey}
  selectedEpisode={selectedEpisode}
  setSelectedEpisode={setSelectedEpisode}
  changeSource={changeSource} />
 <div
  id='gl'
>
<div>
<img id='kol' src={animeData && animeData.poster}/>
</div>
<div style={{color:'gray'}}>
  <h1 style={{color:'white'}}>{animeData && animeData.title}</h1><br/>
  <p style={{textAlign:'justify'}}>{animeData && animeData.description}</p><br/>
  <div style={{display:'flex',justifyContent:'space-between'}}>
    <div>
  <p>Type : <span style={{color:'#eee'}}>{animeData?.type || 'N/A'}</span></p>
  <p>Studios : <span style={{color:'#eee'}}>{animeData?.studios || 'N/A'}</span></p>
  <p>Status : <span style={{color:'#eee'}}>{animeData?.status || 'N/A'}</span></p>
  <p>Genre : <span style={{color:'#eee'}}>{animeData?.genres?.join(', ') || 'N/A'}</span></p>
  <p>Duration : <span style={{color:'#eee'}}>{animeData?.duration || 'N/A'}</span></p>
</div>
<div>
  <p>Aired : <span style={{color:'#eee'}}>{animeData?.aired || 'N/A'}</span></p>
  <p>Premiered : <span style={{color:'#eee'}}>{animeData?.premiered || 'N/A'}</span></p>
  <p>Producers : <span style={{color:'#eee'}}>{animeData?.producers?.join(', ') || 'N/A'}</span></p>
</div>

    <div>
    </div>
  </div>
</div>
</div>
        </div>
      <div style={{position:'relative',padding:'10px',backgroundColor:'#222',width:'100%',height:'fit-content',paddingBottom:'30px'}}>
        <img id='maga' src='https://9animetv.to/images/footer-icon.png'/>
          <p style={{color:'gray',marginLeft:'15px'}}>A-Z LIST   |   Searching anime order by alphabet name A to Z.</p>
          <div className='alphabet'>
            <span onClick={() => handleClick('')}>#</span>
            <span onClick={() => handleClick('0-9')}>0-9</span>
            <span onClick={() => handleClick('A')}>A</span>
            <span onClick={() => handleClick('B')}>B</span>
            <span onClick={() => handleClick('C')}>C</span>
            <span onClick={() => handleClick('D')}>D</span>
            <span onClick={() => handleClick('E')}>E</span>
            <span onClick={() => handleClick('F')}>F</span>
            <span onClick={() => handleClick('G')}>G</span>
            <span onClick={() => handleClick('H')}>H</span>
            <span onClick={() => handleClick('I')}>I</span>
            <span onClick={() => handleClick('J')}>J</span>
            <span onClick={() => handleClick('K')}>K</span>
            <span onClick={() => handleClick('L')}>L</span>
            <span onClick={() => handleClick('M')}>M</span>
            <span onClick={() => handleClick('N')}>N</span>
            <span onClick={() => handleClick('O')}>O</span>
            <span onClick={() => handleClick('P')}>P</span>
            <span onClick={() => handleClick('Q')}>Q</span>
            <span onClick={() => handleClick('R')}>R</span>
            <span onClick={() => handleClick('S')}>S</span>
            <span onClick={() => handleClick('T')}>T</span>
            <span onClick={() => handleClick('U')}>U</span>
            <span onClick={() => handleClick('V')}>V</span>
            <span onClick={() => handleClick('W')}>W</span>
            <span onClick={() => handleClick('X')}>X</span>
            <span onClick={() => handleClick('Y')}>Y</span>
            <span onClick={() => handleClick('Z')}>Z</span>
          </div>
          <span style={{color:'white',fontSize:'2.2em',margin:'0 5px'}}><span style={{backgroundColor:'#5a2e98',borderRadius:'50%',fontSize:'1.1em',padding:'5px',fontWeight:'bold'}}>11</span><span style={{marginLeft:'2px',fontStyle:'italic',fontWeight:'bold'}}>Anime</span></span>
          <p style={{color:'gray',margin:'15px'}}>Copyright © 11anime. All Rights Reserved</p>
          <div style={{color:'#fff',fontSize:"1.3em",margin:'15px'}}>
              <i className="fa-brands fa-x-twitter"></i>
              <i className="fa-brands fa-square-reddit"></i>
              <i className="fa-brands fa-facebook"></i>
              <i className="fa-brands fa-instagram"></i>
            </div>
            <p style={{color:'gray',margin:'15px'}}>Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
            
      </div>
    </div>
  )
}

export default Watch
