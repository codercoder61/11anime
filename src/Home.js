import React,{useRef,useState,useEffect,useCallback } from 'react'
import './Home.css'
import axios from 'axios'
import { useSearchParams,useNavigate,Link } from 'react-router-dom';
function Home() {
   const navigate = useNavigate();
  const ress= useRef(null)
  const slideshow = useRef(null)
  const all = useRef(null)
  const ti = useRef(null)
  const refs = useRef([]);


const [genree,setGenree1] = useState('')
const [typee,setTypee1] = useState('')
const [statuse,setStatuse1] = useState('')




const [currentItems, setCurrentItems] = useState([]);




const [loading, setLoading] = useState(false);
const [loading2, setLoading2] = useState(true);
const [results, setResults] = useState(null);
const [searchParams] = useSearchParams();
  const letter = searchParams.get('letter');
  const [search,setSearch] = useState("")
  const [typeee,setTypee] = useState("")

  const [aired,setAired] = useState("")

  const [premiered,setPremiered] = useState("")

  const genree1 = searchParams.get('genre');
  const typee1 = searchParams.get('type');
  const statuse1 = searchParams.get('status');
  const handleSearch = async (search) => {
    if (!search.trim()) {
      setResults(null);
      ress.current.style.display = 'none';
      return;
    }
  
    try {
      const { data } = await axios.get('https://dollars-approx-perth-str.trycloudflare.com/search', {
        params: { keyword: search },
      });
      //(data)
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
  
  const [duration,setDuration]=useState('')
  const [genres,setGenres]=useState('')
  const [producers,setProducers]=useState('')
  const [statuss,setStatuss]=useState('')
  const [studio,setStudio]=useState('')
  const [synopsis,setSynopsis]=useState('')

  const [isSignIn,setIsSignIn] = useState(false)
  const [isSignUp,setIsSignUp] = useState(false)
  const [allState,setAllState] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null);
const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 8; // adjust as needed
let slideIndex = 1; // mutable, persists across renders
const slides = document.getElementsByClassName("mySlides");

function plusSlides(n) {
  slideIndex += n;
  if (!slides || slides.length === 0) return;
  if (slideIndex > slides.length) 
     slideIndex = 1;
  else 
     if (slideIndex < 1) 
        slideIndex = slides.length;
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  const currentSlide = slides[slideIndex - 1];
  if (currentSlide) 
     currentSlide.style.display = "block";
}




const showSlides = useCallback((n) => {
  let slideIndex = n; // local variable
  //const slides = document.getElementsByClassName("mySlides");
  if (!slides || slides.length === 0) return;

  if (slideIndex > slides.length) slideIndex = 1;
  else if (slideIndex < 1) slideIndex = slides.length;

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  const currentSlide = slides[slideIndex - 1];
  if (currentSlide) currentSlide.style.display = "block";
}, []);


  
  document.addEventListener('DOMContentLoaded', () => {
    //('DOM fully loaded and parsed');
});

useEffect(() => {
  if (slideshow.current) {
    showSlides(slideIndex);
  }
}, [slideIndex, showSlides]); // slideIndex ref object is stable, safe to include

  const [recUpd,setRecUpd] = useState([])
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;

useEffect(() => {
  setCurrentItems(recUpd?.slice(indexOfFirstItem, indexOfLastItem) || []);
}, [recUpd, indexOfFirstItem, indexOfLastItem]);
const totalPages = Math.ceil((recUpd?.length || 0) / itemsPerPage);
   const handleClick = useCallback(async (show) => {
  setCurrentPage(1);
  setLoading2(true);
  setRecUpd(null);
  
  if (ti.current) {
    ti.current.textContent = show ? 'Letter ' + show : 'All';
  }

  // Smooth scroll to anchor
  const anchor = document.getElementById("ancre");
  if (anchor) anchor.scrollIntoView({ behavior: "smooth" });

  try {
    const response = await axios.get(`https://dollars-approx-perth-str.trycloudflare.com/search?keyword=${show}`);
    //('Response:', response);

    const newData = response.data.animeList || [];
    setRecUpd(newData);

    // Update currentItems using state
    setCurrentItems(newData.slice(indexOfFirstItem, indexOfLastItem));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading2(false);
  }
}, [indexOfFirstItem, indexOfLastItem]);
   useEffect(() => {
    const fetchData = async (page=1) => {
      try {
         
        const response = await axios.get(`https://dollars-approx-perth-str.trycloudflare.com/?category=tv&page=${page}`, {
      type:'tv',
    })
        //(response)
        setRecUpd(response.data.animeList)
        setLoading2(false)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

     if (letter) {
      handleClick(letter);
    }else if(genree1 && typee1 && statuse1)
      {
setLoading2(true)

      axios.get('https://dollars-approx-perth-str.trycloudflare.com/filter', {
    params: {
      genree: genree1,
      typee: typee1,
      statuse: statuse1,
      page: 1
    }
  })
    .then(response => {
      //('Response:', response);
      ti.current.textContent = 'Filtered Anime'
      setRecUpd(response.data?.animeList || []);
        setLoading2(false)

    })
    .catch(error => {
      console.error('Error:', error);
    });
      }
    else{
    fetchData();
    }
  }, [handleClick,letter,genree1,typee1,statuse1]);
  


    
const handleSubmit = (e) => {
  e.preventDefault(); // Prevent form submission

  // Reset page number and loading state
  setCurrentPage(1);
  setLoading2(true);
  setRecUpd(null);  // Clear previous filtered results

  // Make the API call with the filter parameters as query parameters
  axios.get('https://dollars-approx-perth-str.trycloudflare.com/filter', {
  params: {
    typee,
    statuse,
    genree,
    page: 1
  },
})
  .then(response => {
    //('Response:', response);
    ti.current.textContent = 'Filtered Anime'; // Update the title or display message
    setRecUpd(response.data?.animeList || []);  // Update state with the filtered list
    setLoading2(false); // Stop loading spinner or indicator
  })
  .catch(error => {
    console.error('Error:', error);
    setLoading2(false);  // Stop loading even in case of error
  });
};





  function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNeighbours = 1; // how many pages to show on each side of current page

  const getPageNumbers = () => {
    const totalNumbers = pageNeighbours * 2 + 3; // current + neighbours + first & last
    const totalBlocks = totalNumbers + 2; // including the two ellipses

    if (totalPages > totalBlocks) {
      let pages = [];

      const leftBound = Math.max(2, currentPage - pageNeighbours);
      const rightBound = Math.min(totalPages - 1, currentPage + pageNeighbours);

      const hasLeftSpill = leftBound > 2;
      const hasRightSpill = rightBound < totalPages - 1;

      const spillOffset = totalNumbers - (rightBound - leftBound + 1);

      if (hasLeftSpill && !hasRightSpill) {
        // handle left spill
        const extraPages = Array.from({ length: spillOffset }, (_, i) => leftBound - spillOffset + i);
        pages = [...extraPages, ...Array.from({ length: rightBound - leftBound + 1 }, (_, i) => leftBound + i)];
        return [1, 'LEFT_ELLIPSIS', ...pages, totalPages];
      } else if (!hasLeftSpill && hasRightSpill) {
        // handle right spill
        const extraPages = Array.from({ length: spillOffset }, (_, i) => rightBound + i + 1);
        pages = [...Array.from({ length: rightBound - leftBound + 1 }, (_, i) => leftBound + i), ...extraPages];
        return [1, ...pages, 'RIGHT_ELLIPSIS', totalPages];
      } else if (hasLeftSpill && hasRightSpill) {
        // both left and right spill
        pages = Array.from({ length: rightBound - leftBound + 1 }, (_, i) => leftBound + i);
        return [1, 'LEFT_ELLIPSIS', ...pages, 'RIGHT_ELLIPSIS', totalPages];
      } else {
        // no spill, just show all
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
    }

    // less pages than totalBlocks, show all
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const pages = getPageNumbers();

  const onClick = (page) => {
    if (page !== 'LEFT_ELLIPSIS' && page !== 'RIGHT_ELLIPSIS' && page !== currentPage) {
      onPageChange(page);
    }
  };



  return (
    <div id='fas'>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className='bb'
      >
        Previous
      </button>

      {pages.map((page, index) => {
        if (page === 'LEFT_ELLIPSIS' || page === 'RIGHT_ELLIPSIS') {
          return (
            <span key={page + index} style={{ color:'white',margin: '0 5px', padding: '8px 12px' }}>
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onClick(page)}
            style={{
              margin: '0 5px',
              padding: '8px 12px',
              backgroundColor: page === currentPage ? '#5a2e98' : '#f0f0f0',
              color: page === currentPage ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: page === currentPage ? 'default' : 'pointer',
            }}
            disabled={page === currentPage}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        style={{ cursor:'pointer',backgroundColor:'#5a2e98',color:'white',outline:'none',border:'none',borderRadius:'15px',margin: '0 5px', padding: '8px 12px' }}
      >
        Next
      </button>
    </div>
  );
}
useEffect(() => {
  if (recUpd) {
    refs.current = recUpd.map((_, i) => refs.current[i] || React.createRef());
  }
}, [recUpd]);

const handleMouseEnter = (animeId, index) => {
  setAired("");
  setTypee("");
  setPremiered("");
  setSynopsis("");
  setStudio("");
  setStatuss("");
  setProducers("");
  setHoveredIndex(null);
  setDuration("");
  setGenres("");
  const rect = refs.current[index].getBoundingClientRect();
  const tooltipWidth = 300;
  const padding = 10;

  let left = rect.right + 10;
  let top = rect.top + rect.height / 2;

  if (left + tooltipWidth > window.innerWidth - padding) {
    left = rect.left - tooltipWidth - 10;
  }

  if (top + 100 > window.innerHeight) {
    top = window.innerHeight - 120;
  }

  setTooltipPos({ top, left });
  setHoveredIndex(index);
setLoading(true);
  axios
  .get('https://dollars-approx-perth-str.trycloudflare.com/animeInfo', {
    params: { animeId }
  })
  .then(response => {
    //('Response:', response);
    // You can store details if needed



    setDuration(response.data.animeInfo.duration)
    setGenres(response.data.animeInfo.genres.join(', '))
    setProducers(response.data.animeInfo.producers.join(', '))
    setStatuss(response.data.animeInfo.status)
    setStudio(response.data.animeInfo.studios)
    setSynopsis(response.data.animeInfo.description)
    setAired(response.data.animeInfo.aired)
    setPremiered(response.data.animeInfo.premiered)
    setTypee(response.data.animeInfo.type)
  })
  .catch(error => {
    console.error('Error:', error);
  })
  .finally(() => {
      setLoading(false); // Hide loader
    });

};

  return (
    <>
    <div>
      {allState && <div ref={all} className='all'></div>}
      {isSignIn && <div className='register'>
        <i onClick={()=>{setAllState(false);setIsSignIn(false)}} style={{cursor:'pointer',position:'absolute',right:'10px',top:'10px'}} className="fa-solid fa-xmark"></i>
        <div><img alt="2"style={{position:'relative',right:'20px',width:'250px'}} src='https://9animetv.to/images/icon-login2.png'/></div>
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
        <div><img alt="3"style={{position:'relative',right:'20px',width:'250px'}} src='https://9animetv.to/images/icon-register.png'/></div>
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
                  <div><img alt="4"style={{objectFit:'cover',width:'50px',height:'50px',borderRadius:'50%'}} src={elm.poster}/></div>
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
      <main ref={slideshow} className="slideshow-container">
        <div className='fadeToBlack'></div>
        <Link to='/watch?dataId=2&animeId=hunter-x-hunter-2'><div  className="mySlides">
                <div className="numbertext">1 / 5</div>
                <img alt="5"className="fade" src="https://worldofgeek.fr/wp-content/uploads/2025/07/hunter-x-hunter-nen-impact-1200x571.jpg" style={{width:'100%',minHeight:'300px',height:'200px',objectFit:'cover'}} />
                <div style={{boxShadow:'0 0 5px white',zIndex:'50000',position:'relative',width:'auto',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#5a2e98'}}>
                  <div>
                <div className="text noFade">Hunter x Hunter (2011)</div>
                <div className='desc'>Hunters devote themselves to accomplishing hazardous tasks, all from traversing the world’s uncharted territories...</div>
                </div>
                <button className='button'>Watch Now</button>
                </div>
            </div></Link>
        <Link to='/watch?dataId=100&animeId=one-piece-100'><div  className="mySlides">
                <div className="numbertext">2 / 5</div>
                <img alt="6"className="fade" src="https://cdna.artstation.com/p/assets/images/images/052/674/042/large/elix-asset.jpg?1660391448" style={{width:'100%',minHeight:'300px',height:'200px',objectFit:'cover'}} />
                <div style={{boxShadow:'0 0 5px white',zIndex:'50000',position:'relative',width:'auto',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#5a2e98'}}>
                  <div>
                <div className="text noFade">One Piece</div>
                <div className='desc'>Gold Roger was known as the “Pirate King,” the strongest and most infamous being to have sailed the Grand Line....</div>
                </div>
                <button className='button'>Watch Now</button>
                </div>
        </div></Link>
        <Link to='/watch?dataId=112&animeId=attack-on-titan-112'><div  className="mySlides">
                <div className="numbertext">3 / 5</div>
                <img alt="7"className="fade" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9f2fcbc8-1efd-4a10-aa26-f4d8fbf53f35/d6n4i7m-6744e406-bb25-4556-b1c4-f5e7e2ee8a41.jpg/v1/fill/w_851,h_315,q_75,strp/shingeki_no_kyojin_facebook_banner_by_jondedy_d6n4i7m-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzE1IiwicGF0aCI6IlwvZlwvOWYyZmNiYzgtMWVmZC00YTEwLWFhMjYtZjRkOGZiZjUzZjM1XC9kNm40aTdtLTY3NDRlNDA2LWJiMjUtNDU1Ni1iMWM0LWY1ZTdlMmVlOGE0MS5qcGciLCJ3aWR0aCI6Ijw9ODUxIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.jVDBOkhV_bxO2PVV0GnyP7sdvZdp_tYjpEsa1wZWcS8" style={{width:'100%',minHeight:'300px',height:'200px',objectFit:'cover'}} />

                <div style={{boxShadow:'0 0 5px white',zIndex:'50000',position:'relative',width:'auto',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#5a2e98'}}>
                  <div>
                <div className="text noFade">Attack on Titan (2013)</div>
                <div className='desc'>Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans....</div>
                </div>
                <button className='button'>Watch Now</button>
                </div>
        </div></Link>
        <Link to='/watch?dataId=19413&animeId=solo-leveling-season-2-arise-from-the-shadow-19413'><div  className="mySlides">
                <div className="numbertext">4 / 5</div>
                <img alt="8"className="fade" src="https://www.thathashtagshow.com/wp-content/uploads/2025/01/SoloLeveling_S2_KV1_16x9_3840x2160-1280x640.png" style={{width:'100%',minHeight:'300px',height:'200px',objectFit:'cover'}} />
                <div style={{boxShadow:'0 0 5px white',zIndex:'50000',position:'relative',width:'auto',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#5a2e98'}}>
                  <div>
                <div className="text noFade">Solo Leveling Season 2: Arise from the Shadow (2025)</div>
                <div className='desc'>Sung Jin-Woo, dubbed the weakest hunter of all mankind, grows stronger by the day with the supernatural powers....</div>
                </div>
                <button className='button'>Watch Now</button>
                </div>
        </div></Link>
        <Link to="/watch?dataId=677&animeId=naruto-677"><div  className="mySlides">
                <div className="numbertext">5 / 5</div>
                <img alt="9"className="fade" src="https://static1.colliderimages.com/wordpress/wp-content/uploads/2025/02/naruto-header.jpg?q=70&fit=crop&w=1100&h=618&dpr=1" style={{width:'100%',minHeight:'300px',height:'200px',objectFit:'cover'}} />
                <div style={{boxShadow:'0 0 5px white',zIndex:'50000',position:'relative',width:'auto',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#5a2e98'}}>
                  <div>
                <div className="text noFade">Naruto (2002)</div>
                <div className='desc'>Twelve years ago, a colossal demon fox terrorized the world. During the monster’s attack on the Hidden....</div>
                </div>
                <button className='button'>Watch Now</button>
                </div>

                
        </div></Link>
        <button className="prev" onClick={()=>plusSlides(-1)}>❮</button>
        <button className="next" onClick={()=>plusSlides(1)}>❯</button>
      </main>


      <div style={{display:'flex',height:'fit-content',paddingBottom:'150px'}}>
        <div id='apps'>
          <h1 ref={ti} id='ancre' style={{color:'#fff',fontSize:'1.2em',margin:'15px'}}>Recently updated</h1>
          <div>
            
          <div style={{ position: 'relative',display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {loading2 ? (
  <div className="spinner2"></div>
) : (
  <>
    {currentItems.length === 0 ? (
      <span style={{ color: 'white' }}>No anime found in this section.</span>
    ) : (
      <>
        {currentItems.map((elm, index) => (
          <div
            className="image-container"
            key={`${elm.poster}-${index}`}
            ref={(el) => (refs.current[index] = el)}
            onMouseEnter={() => handleMouseEnter(elm.animeId, index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              width: '150px',
              margin: '10px',
              display: 'inline-block',
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={()=>navigate(`/watch?dataId=${elm.dataId}&animeId=${elm.animeId}`)}
          >
            <img
              src={elm.poster}
              alt=""
              className="hover-image"
              style={{
                width: '150px',
                height: '220px',
                objectFit: 'cover',
                borderRadius: '15px',
              }}
            />
            <div className="play-button">▶</div>
            <p
              style={{
                color: 'white',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: '5px',
              }}
            >
              {elm.title}
            </p>

            {hoveredIndex === index && (
              <div
                style={{
                  position: 'fixed',
                  top: tooltipPos.top,
                  left: tooltipPos.left,
                  maxWidth: '300px',
                  backgroundColor: '#333',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '5px',
                  zIndex: 99999,
                  fontSize: '0.9em',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                  transform: 'translateY(-50%)',
                }}
              >
                <strong>{elm.title}</strong>
                <br />
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <p
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '10px',
                      }}
                    >
                      {synopsis?.trim() ? synopsis : 'N/A'}
                    </p>
                    <p>Genres : {genres || 'N/A'}</p>
                    <p>Producers : {producers || 'N/A'}</p>
                    <p>Status : {statuss || 'N/A'}</p>
                    <p>Studio : {studio || 'N/A'}</p>
                    <p>Aired : {aired || 'N/A'}</p>
                    <p>Premiered : {premiered || 'N/A'}</p>
                    <p>Type : {typeee || 'N/A'}</p>
                    <p>Duration : {duration ? duration + '/ep' : 'N/A'}</p>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </>
    )}
  </>
)}



  

</div>

          </div>
        </div>
        <div id='filter'>
            <h1 style={{color:'#fff',fontSize:'1.2em',margin:'40px 0'}}>Quick filter</h1>
            <form className="filter-form" onSubmit={handleSubmit}>
              <select value={genree} onChange={(e) => setGenree1(e.target.value)}>
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
              <select value={typee} onChange={(e) => setTypee1(e.target.value)}>
                <option value="">All</option>
                <option value="2">TV</option>
                <option value="1">Movie</option>
                <option value="3">OVA</option>
                <option value="6">Music</option>
                <option value="5">Special</option>
                <option value="4">ONA</option>
              </select><br/><br/>
              <select value={statuse} onChange={(e) => setStatuse1(e.target.value)}>
                <option value="">All</option>
                <option value="1">Finished airing</option>
                <option value="2">Currently airing</option>
                <option value="3">Not yet aired</option>
              </select><br/><br/>
              <button style={{color:'white',backgroundColor:'#5a2e98',outline:'none',border:'none',padding:'10px',borderRadius:'15px',boxShadow:'0 0 5px grey',fontSize:'1.3em'}}>Filter</button>
            </form>
        </div>
      </div>
    
    </div>
      <div style={{position:'relative',padding:'10px',backgroundColor:'#222',width:'100%',height:'fit-content',paddingBottom:'30px',marginTop:'50px'}}>
        <img alt="1"id='maga' src='https://9animetv.to/images/footer-icon.png'/>
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
            
      </div></>
  )
}

export default Home
