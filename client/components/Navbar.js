
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';
import { logout } from '../store'; // Adjust the path as needed
import AuthModal from './AuthModal';
import ProtectedLink from './ProtectedLink';
import { fetchUserRecommendations } from "../store/allUserRecommendationsStore";
import { fetchFriends } from "../store/allFriendsStore";
import './Navbar.css'

const Navbar = ({ handleClick, isLoggedIn, location }) => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.auth.id);
  const recommendations = useSelector((state) => state.allUserRecommendations);
const pendingRequests = useSelector((state) => state.allFriends)
  .filter((friend) => friend.userId === currentUserId && friend.status === "pending");
const newRecs = recommendations.filter(
  (rec) => rec.receiverId == currentUserId && rec.accept === null
);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFormType, setModalFormType] = useState('login'); // 'login' or 'signup'

  const openModal = (formType = 'login') => {
    setModalFormType(formType);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    dispatch(fetchUserRecommendations());
    dispatch(fetchFriends());
  }, [dispatch]);

  // Watch for location changes to open AuthModal
  useEffect(() => {
    if (location.pathname === '/login') {
      openModal('login');
    } else if (location.pathname === '/signup') {
      openModal('signup');
    } else {
      // Close modal if navigating away from login/signup
      closeModal();
    }
  }, [location.pathname]);

  return (
    <div className="navbar-container">
      <nav className="navbar">
      <div className="navbar-notifications">
  {/* {pendingRequests.length > 0 && (
    <Link to="/list" className="notification friend">
      <img src="/friend.jpg" alt="Friend Icon" />
      {pendingRequests.length} Friend Request{pendingRequests.length > 1 ? "s" : ""}
    </Link>
  )}
  {newRecs.length > 0 && (
    <Link to="/recommendations" className="notification movie">
      <img src="/movie.jpg" alt="Movie Icon" />
      {newRecs.length} New Recommendation{newRecs.length > 1 ? "s" : ""}
    </Link>
  )} */}
   {location.pathname === "/home" && (
          <div className="navbar-notifications">
            {pendingRequests.length > 0 && (
              <Link to="/list" className="notification friend">
                <img src="/friend.jpg" alt="Friend Icon" />
                {pendingRequests.length} Friend Request{pendingRequests.length > 1 ? "s" : ""}
              </Link>
            )}
            {newRecs.length > 0 && (
              <Link to="/recommendations" className="notification movie">
                <img src="/movie.jpg" alt="Movie Icon" />
                {newRecs.length} New Recommendation{newRecs.length > 1 ? "s" : ""}
              </Link>
            )}
          </div>
        )}
</div>
      {/* <Link to="/" className="navbar-logo">
        🎬 PopCornPair
      </Link> */}
        {/* <Link to="/" className="navbar-brand">PopCornPair</Link> */}
        {isLoggedIn ? (
          <div className="navbar-links">
            {/* The navbar will show these links after you log in */}
            <ProtectedLink to="/home" className="navbar-link" >Home</ProtectedLink>
            <ProtectedLink to="/profile" className="navbar-link">Profile</ProtectedLink>
            <ProtectedLink to="/watchlist" className="navbar-link">Watchlist</ProtectedLink>
            <ProtectedLink to="/watched" className="navbar-link">Watched</ProtectedLink>
            <ProtectedLink to="/list" className="navbar-link">Friends</ProtectedLink>
            <ProtectedLink to="/recommendations" className="navbar-link">Recommendations</ProtectedLink>
            {/* <ProtectedLink to="/algorithm" className="navbar-link">Algorithm</ProtectedLink> */}
            {/* <ProtectedLink to="/addmovie" className="navbar-link">Add</ProtectedLink> */}
            <ProtectedLink to="/search" className="navbar-link">Search</ProtectedLink>
            <a href="#" onClick={handleClick} className="navbar-link">Logout</a>
          </div>
        ) : (
          <div className="navbar-links">
            {/* The navbar will show these links before you log in */}
            <Link className="navbar-link" onClick={() => openModal('login')}>Login</Link>
            <Link className="navbar-link" onClick={() => openModal('signup')}>Sign Up</Link>
          </div>
        )}
      </nav>
      <hr />

      {/* Auth Modal */}
      <AuthModal isOpen={isModalOpen} onClose={closeModal} formType={modalFormType} />
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => ({
  isLoggedIn: !!state.auth.id,
});

const mapDispatch = (dispatch) => ({
  handleClick() {
    dispatch(logout());
  },
});

export default withRouter(connect(mapState, mapDispatch)(Navbar));
