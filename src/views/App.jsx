import Home from "../components/Home";
import Register from "../components/Registro";
import Login from "../components/Login";
import { Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import MovieItem from "../components/MovieItem";
import Search from "../components/Search";
import { setUser } from "../redux/user";
import { useDispatch } from "react-redux";
import { setFavoritos } from "../redux/favs";
import { setSerieFavoritos } from "../redux/serieFavs";
import axios from "axios";
import Usersadmin from "../components/Usersadmin";
import Favorites from "../components/Favorites";
import Series from "../components/Series";
import SerieItem from "../components/SerieItem";
import SearchSeries from "../components/SearchSeries";
import UserIdentification from "../components/UserIdentification";
import UpcomingMovies from "../components/UpcomingMovies";
import TredingMovies from "../components/TrendingMovies";
import Forgot from "../components/Forgot";
import ResetPassword from "../components/ResetPassword";
import SerieFavorites from "../components/SerieFavorites";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);

  // Carga inicial de sesión: golpea el backend (Render free).
  const [authLoading, setAuthLoading] = useState(true);
  // Si la carga tarda más de 4s, probablemente el backend está despertando
  // de un cold start: mostramos un mensaje aclaratorio.
  const [showWakingMessage, setShowWakingMessage] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      setShowWakingMessage(false);
      return;
    }
    const timer = setTimeout(() => setShowWakingMessage(true), 4000);
    return () => clearTimeout(timer);
  }, [authLoading]);

  // SET_USERS
  useEffect(() => {
    axios
      .get("/api/users/me", { withCredentials: true })
      .then((res) => res.data)
      .then((user) => {
        dispatch(setUser(user.user));
        setUserId(user.user.id); // Guardar el userId para cargar favoritos
      })
      .catch(() => console.log("Necesitas loguearte con tu cuenta"))
      .finally(() => setAuthLoading(false));
  }, [dispatch]);

  //ESTE SERIA EL NUEVO SET_FAVORITOS - Solo carga cuando hay userId
  useEffect(() => {
    if (userId) {
      axios
        .get("/api/favs/favmovies", {
          params: { userId: userId },
        })
        .then((res) => res.data)
        .then((data) => {
          dispatch(setFavoritos(data));
          console.log("FAVORITOS =>", data);
        })
        .catch(() => console.log("error"));
    }
  }, [dispatch, userId]);

  //SET_SERIE_FAVORITOS - Solo carga cuando hay userId
  useEffect(() => {
    if (userId) {
      axios
        .get("/api/serie/favseries", {
          params: { userId: userId },
        })
        .then((res) => res.data)
        .then((data) => {
          dispatch(setSerieFavoritos(data));
          console.log("SERIE FAVORITOS =>", data);
        })
        .catch(() => console.log("error"));
    }
  }, [dispatch, userId]);

  return (
    <>
      <BrowserRouter>
        {showWakingMessage && (
          <div
            role="status"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              background: "rgba(0, 0, 0, 0.85)",
              color: "#ffffff",
              textAlign: "center",
              padding: "10px 15px",
              fontSize: "14px",
            }}
          >
            Starting the server, this may take up to a minute on the first
            visit...
          </div>
        )}
        <ToastContainer
          toastStyle={{
            width: "400px",
            background: "rgba(0, 0, 0, 0.8)",
            color: "#ffffff",
            margin: "10px",
            borderRadius: "8px",
            padding: "15px",
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/searchseries" element={<SearchSeries />} />
          <Route path="/searchseries/serie/:id" element={<SerieItem />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movie/:id" element={<MovieItem />} />
          <Route path="/search/movie/:id" element={<MovieItem />} />
          <Route path="/upcomingmovies/movie/:id" element={<MovieItem />} />
          <Route path="/trendingmovies/movie/:id" element={<MovieItem />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/favoritos/movie/:id" element={<MovieItem />} />
          <Route path="/register/movie/:id" element={<MovieItem />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/login/movie/:id" element={<MovieItem />} />
          <Route path="/usuariosadmin" element={<Usersadmin />} />
          <Route path="/series" element={<Series />} />
          <Route path="/series/serie/:id" element={<SerieItem />} />
          <Route path="/seriefavoritos" element={<SerieFavorites />} />
          <Route path="/perfil/:id" element={<UserIdentification />} />
          <Route path="/seriefavoritos/serie/:id" element={<SerieItem />} />
          <Route path="/upcomingmovies" element={<UpcomingMovies />} />
          <Route path="/trendingmovies" element={<TredingMovies />} />
          <Route path="/resetPassword/:id" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

//     <Link to={"/login"} className="no-underline">
// Login
// </Link>

//         <Link to={`single/${data.id}`}>
export default App;
