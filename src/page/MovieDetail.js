import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "../css/detail.css";
import "../css/trailer.css";
import Badge from "react-bootstrap/Badge";
import api from "../redux/api";
import MovieRelatedCard from "../components/MovieRelatedCard";
import Review from "../components/Review";
import Trailer from "../components/Trailer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";


const API_KEY = process.env.REACT_APP_API_KEY;

const MovieDetail = () => {
  // 장르 데이타 가져오기
  // 장르 
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  const [reviews, setReviews] = useState(true);
  const [related, setRelated] = useState([]);
  const [but, satBut] = useState(true);
  const [videoKey, setVideoKey] =useState("");
  
  const getMoviesDetail = async () => {
    let detailApi = await api.get(`/movie/${id}?api_key=${API_KEY}&language=en-US`);
    let reviewsApi = await api.get(`/movie/${id}/reviews?api_key=${API_KEY}&language=en-US`);
    let relatedApi = await api.get(`movie/${id}/recommendations?api_key=${API_KEY}&language=en-US`);
    let videoApi = await api.get(`movie/${id}/videos?api_key=${API_KEY}`)
    let detailData = detailApi.data;
    let reviews = reviewsApi.data;
    let related = relatedApi.data;
    let videoKey = videoApi.data.results[0].key;
    setMovie(detailData)
    setReviews(reviews)
    setRelated(related)
    setVideoKey(videoKey)
  };


  useEffect(() => {
    getMoviesDetail();
  }, []);

  console.log("추천", related)
  console.log("리뷰", reviews)
  console.log("예고",videoKey)

  return (
    <div className="detail-area">
      <section
        className="detail-banner"
        style={{
          backgroundImage:
            'url("https://images.hdqwalls.com/download/polygonal-abstract-red-dark-background-eo-1280x1024.jpg")',
        }}>
        <Container>
          <Row>
            <Col className="banner-area" lg={12}>
              <h1>NETFLIX</h1>
              <ul className="banner-text">
                <li>
                  <a href="/">HOME</a>
                </li>
                <li>
                  <span>{movie?.title}</span>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>
      <section >
        <Container className="container">
          <Row className="screen-top">
            <Col className="movie-left-page" lg={6}>
              <img src={`https://www.themoviedb.org/t/p/original/${movie?.poster_path}`} />
            </Col>
            <Col className="movie-right-page" lg={6}>
              <div className="movie-area" >
                <ul className="movie-genres">
                  {movie.genres && movie.genres.map((genre) => (<li><Badge key={genre} className="badge" bg="danger"><div>{genre.name}</div></Badge></li>))}
                </ul>
                <h1>{movie?.title}</h1>
                <div className="movie-info">
                  <ul className="info1">
                    <li>{movie?.vote_average}</li>
                    <li>{movie?.popularity}</li>
                    <li>{movie.adult ? "" : "Under 18"}</li>
                  </ul>
                  <div className="white-line">
                    <div className="movie-overview"><p>{movie?.overview}</p></div>
                    <div className="info2">
                      <ul className="info2-list">
                        <li>
                          <Badge bg="danger"><div>Budget</div></Badge>
                          <div>${movie?.budget}</div>
                        </li>
                        <li>
                          <Badge bg="danger"><div>Revenue</div></Badge>
                          <div>${movie?.revenue}</div>
                        </li>
                        <li>
                          <Badge bg="danger"><div>Release Day</div></Badge>
                          <div>{movie?.release_date}</div>
                        </li>
                        <li>
                          <Badge bg="danger"><div>Time</div></Badge>
                          <div>{movie?.runtime}</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="movie-warning">
                {<Trailer videoKey={videoKey}/>}
                </div>
                <div className="movie-like">
                  ♥
                </div>
              </div>
            </Col>
            <Col lg={12} className="screen-bottom" >
              <ul className="review-nav">
                <li><button onClick={() => satBut(true)}>REVIEWS ({reviews?.total_results})</button></li>
                <li><button onClick={() => satBut(false)}>RELATED MOVIES (21)</button></li>
              </ul>
              {but ?
                <Review reviews={reviews} /> :
                <div className='related-list'>
                  {related.results && related.results.map((related) => (<MovieRelatedCard key={related} related={related} />))}
                </div>}
            </Col>
          </Row>
        </Container>
      </section>

    </div>
  );
};

export default MovieDetail;
