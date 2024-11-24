import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Konfiguracja axios

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Wywołanie backendowego endpointu '/logout' w celu wylogowania użytkownika
      await api.post("/login/logout", {}, { withCredentials: true });
      
      // Przekierowanie do strony logowania po wylogowaniu
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Welcome to the Home Page!</h1>
        <p className="lead">You have successfully logged in. Enjoy your visit!</p>
        <hr className="my-4" />
        <button className="btn btn-primary btn-lg" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-lg">
            <img src="https://via.placeholder.com/350x150" className="card-img-top" alt="Card image" />
            <div className="card-body">
              <h5 className="card-title">Feature 1</h5>
              <p className="card-text">Explore the features of our application.</p>
              <a href="#" className="btn btn-primary">Learn more</a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-lg">
            <img src="https://via.placeholder.com/350x150" className="card-img-top" alt="Card image" />
            <div className="card-body">
              <h5 className="card-title">Feature 2</h5>
              <p className="card-text">Discover more functionalities.</p>
              <a href="#" className="btn btn-primary">Learn more</a>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-lg">
            <img src="https://via.placeholder.com/350x150" className="card-img-top" alt="Card image" />
            <div className="card-body">
              <h5 className="card-title">Feature 3</h5>
              <p className="card-text">Enhance your experience with us.</p>
              <a href="#" className="btn btn-primary">Learn more</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
