'use client'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";

export default function LogIn({ openLOgForem, setOpenLogForm , setLogValid }) {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  const [token, setToken] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [data, setData] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    const savedSession = localStorage.getItem("tmdb_session") || sessionStorage.getItem("tmdb_session");
    if (savedSession) {
      setLogValid(true);
      setOpenLogForm(false);
    }
  }, [setLogValid, setOpenLogForm]);

  const getOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw'
    }
  };

  function auth() {
    fetch('https://api.themoviedb.org/3/authentication/token/new', getOptions)
      .then(res => res.json())
      .then(res => {
        setToken(res.request_token);
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    if (!token) return;

    const postOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MDE4N2VjMmZmZDQxNzk1ZDgxOWQ1OWVhNmUzMWE5OSIsIm5iZiI6MTc0NDM3NjY1MC42MzM5OTk4LCJzdWIiOiI2N2Y5MTM0YTdmNzBhYzFhMjFkOTRlOTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hWm7tkoEoX6mh442nNRoPCcsgGy439obMiIfOxtr-aw'
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        request_token: token
      })
    };

    fetch('https://api.themoviedb.org/3/authentication/token/validate_with_login', postOptions)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          return fetch(`https://api.themoviedb.org/3/authentication/session/new?api_key=70187ec2ffd41795d819d59ea6e31a99`, {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              request_token: token
            })
          });
        } else {
          throw new Error("Login failed");
        }
      })
      .then(res => res?.json())
      .then(sessionRes => {
        if (sessionRes && sessionRes.session_id) {
            setLogValid(true);
            setOpenLogForm(false);
            setMsg(`Logged in Successfully!`);

          if (rememberMe) {
            localStorage.setItem("tmdb_session", sessionRes.session_id);
          } else {
            sessionStorage.setItem("tmdb_session", sessionRes.session_id);
          }
        }
      })
      .catch(err => {
        console.error(err);
        setMsg("Login failed!");
      });
  }, [token]);


  return (
    <div className={`fixed ${openLOgForem ? 'bottom-0' : 'bottom-[-100%]'} transition-all z-[8000] left-0 h-screen w-screen`}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }}>
      <div className="size-full relative flex justify-center items-center container m-auto">
        <div className=" absolute top-[50px] right-0">
          <button onClick={() => setOpenLogForm(false)} className="cursor-pointer">
            <IoIosClose size={40} />
          </button>
        </div>
        <div className={`bg-white p-5 ${screenWidth > 885 ? 'w-[30%] h-[50%]' : screenWidth > 430 ? 'w-[60%] h-[30%]' : 'w-[90%] h-[40%]'} rounded-2xl`}>
          <h2 className="pb-5 w-full text-center text-black text-2xl font-bold">Log In</h2>
          <form className="w-full log-form flex flex-col gap-5" onSubmit={(e) => {
            e.preventDefault();
            auth();
          }}>
            <input
              required
              onChange={(e) => setData({ ...data, username: e.target.value })}
              value={data.username}
              className="w-full bg-gray-100 text-black"
              type="text"
              placeholder="Username"
            />
            <div className="w-full relative">
              <input
                required
                onChange={(e) => setData({ ...data, password: e.target.value })}
                value={data.password}
                className="w-full bg-gray-100 text-black"
                type={show ? 'text' : 'password'}
                placeholder="Password"
              />
              {data.password &&
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className=" absolute cursor-pointer text-black top-[12px] right-[20px]">
                  {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              }
            </div>

            {/* ✅ Checkbox Remember Me */}
            <label className="flex items-center gap-2 text-black text-xs">
              <input
                className="bg-black rounded-full w-[10px] h-[10px]"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>

            <button className="py-2 w-full bg-black text-white cursor-pointer text-xs">Log In</button>
            <p className="text-black text-xs w-full text-center ">{msg}</p>
          </form>
        </div>
      </div>
    </div>
  );
}
